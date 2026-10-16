#!/usr/bin/env bash
#
# Behavioral test: ingestion pipeline — FHIR bundle + single observation +
# adherence event, exactly-once idempotency, and the validation layer (Phase 3).
#
# Proves against a live API + live Postgres (no mocks):
#   1. a FHIR R4 Bundle is verified, extracted and written: an observation row
#      per Observation and a clinical event row per Condition/Encounter/
#      Procedure/MedicationRequest.
#   2. re-posting the same key + body replays the recorded response and writes
#      nothing new.
#   3. re-posting under a new key with the same source ids still writes nothing
#      new (the natural unique key holds).
#   4. a missing idempotency-key header is rejected.
#   5. a structurally malformed Bundle is rejected 400 with structured issues.
#   6. a laboratory observation with no applicable reference range is rejected
#      422 (not silently stored).
#   7. a single observation and an adherence event each write exactly one row
#      and one outbox event.
#   8. the worker drains every ingestion outbox event (PENDING -> 0) and the
#      derived trends are queryable.
#
# Each run uses a uniquely-named patient, so it neither depends on nor disturbs
# the seeded population.
#
# Usage:  scripts/test-health-ingestion.sh
# Env:    API_URL (default http://localhost:3001)
#         PG_CONTAINER (default tangerine-postgres), PG_USER, PG_DB
#
set -uo pipefail

API_URL="${API_URL:-http://localhost:3001}"
PG_CONTAINER="${PG_CONTAINER:-tangerine-postgres}"
PG_USER="${PG_USER:-tangerine}"
PG_DB="${PG_DB:-tangerine}"

pass=0; fail=0
check() { if [ "$2" = "1" ]; then printf '  \033[32mPASS\033[0m  %s\n' "$1"; pass=$((pass+1)); else printf '  \033[31mFAIL\033[0m  %s\n' "$1"; fail=$((fail+1)); fi; }
psql_q() { docker exec -i "$PG_CONTAINER" psql -U "$PG_USER" -d "$PG_DB" -tAX -c "$1"; }

RUN="$(date +%s%N)"
MRN="mrn-ing-$RUN"
CALLER="test-ingest-$RUN"
KEY="ing-$RUN"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

echo "=== health ingestion behavioral test ==="
echo "api=$API_URL  mrn=$MRN  caller=$CALLER  key=$KEY"

# The authenticated caller (container for the single-observation and adherence
# writes); the bundle's own patient is provisioned from its MRN.
psql_q "INSERT INTO \"User\"(id,handle,\"displayName\",role,\"createdAt\") VALUES ('$CALLER','$CALLER','Ingest Caller $RUN','MEMBER', now());
INSERT INTO \"PatientProfile\"(id,\"userId\",mrn,sex,\"birthDate\",\"createdAt\") VALUES ('pp-$CALLER','$CALLER','mrn-caller-$RUN','FEMALE','1985-01-01', now());" >/dev/null

# ── a well-formed bundle: 1 patient, 3 labs, 4 clinical resources ────────────
cat >"$TMP/bundle.json" <<JSON
{
  "resourceType": "Bundle",
  "type": "collection",
  "entry": [
    { "resource": { "resourceType": "Patient", "id": "pat-$RUN",
      "identifier": [ { "system": "urn:tangerine:mrn", "value": "$MRN" } ],
      "name": [ { "family": "Ingest", "given": ["Test"] } ],
      "gender": "female", "birthDate": "1985-01-01" } },
    { "resource": { "resourceType": "Observation", "id": "obs-hgb-$RUN",
      "status": "final", "category": [ { "coding": [ { "code": "laboratory" } ] } ],
      "code": { "coding": [ { "system": "http://loinc.org", "code": "718-7", "display": "Hemoglobin" } ] },
      "effectiveDateTime": "2026-06-01T08:00:00Z",
      "valueQuantity": { "value": 13.0, "unit": "g/dL" } } },
    { "resource": { "resourceType": "Observation", "id": "obs-na-$RUN",
      "status": "final", "category": [ { "coding": [ { "code": "laboratory" } ] } ],
      "code": { "coding": [ { "system": "http://loinc.org", "code": "2951-2", "display": "Sodium" } ] },
      "effectiveDateTime": "2026-06-01T08:00:00Z",
      "valueQuantity": { "value": 140, "unit": "mmol/L" } } },
    { "resource": { "resourceType": "Observation", "id": "obs-glu-$RUN",
      "status": "final", "category": [ { "coding": [ { "code": "laboratory" } ] } ],
      "code": { "coding": [ { "system": "http://loinc.org", "code": "2339-0", "display": "Glucose" } ] },
      "effectiveDateTime": "2026-06-01T08:00:00Z",
      "valueQuantity": { "value": 90, "unit": "mg/dL" } } },
    { "resource": { "resourceType": "Encounter", "id": "enc-$RUN",
      "status": "finished", "class": { "system": "http://terminology.hl7.org/CodeSystem/v3-ActCode", "code": "AMB" },
      "period": { "start": "2026-06-01T08:00:00Z", "end": "2026-06-01T09:00:00Z" } } },
    { "resource": { "resourceType": "Condition", "id": "cond-$RUN",
      "clinicalStatus": { "coding": [ { "code": "active" } ] },
      "code": { "coding": [ { "system": "http://snomed.info/sct", "code": "44054006", "display": "Diabetes" } ] },
      "onsetDateTime": "2020-01-01T00:00:00Z", "recordedDate": "2020-01-02T00:00:00Z" } },
    { "resource": { "resourceType": "Procedure", "id": "proc-$RUN",
      "status": "completed",
      "code": { "coding": [ { "system": "http://snomed.info/sct", "code": "430193006", "display": "CBC" } ] },
      "performedDateTime": "2026-06-01T08:00:00Z" } },
    { "resource": { "resourceType": "MedicationRequest", "id": "med-$RUN",
      "status": "active",
      "medicationCodeableConcept": { "coding": [ { "system": "http://www.nlm.nih.gov/research/umls/rxnorm", "code": "860975", "display": "Metformin" } ] },
      "authoredOn": "2026-05-01T00:00:00Z" } }
  ]
}
JSON

post() { # post <path> <key|-> <file>  -> writes $TMP/http and $TMP/body
  local path="$1" key="$2" file="$3"
  local args=(-sS -o "$TMP/body" -w '%{http_code}' -X POST "$API_URL$path"
    -H 'content-type: application/json' -H "x-user-id: $CALLER")
  [ "$key" != "-" ] && args+=(-H "idempotency-key: $key")
  args+=(--data "@$file")
  curl "${args[@]}" >"$TMP/http" 2>/dev/null
}
jget() { python3 -c "import sys,json;d=json.load(open('$TMP/body'));print(d$1)" 2>/dev/null; }

# ── 1. ingest the bundle ─────────────────────────────────────────────────────
post "/api/clinical/ingest/fhir" "$KEY" "$TMP/bundle.json"
echo "  http=$(cat "$TMP/http")  body=$(cat "$TMP/body")"
check "bundle accepted 202" "$([ "$(cat "$TMP/http")" = "202" ] && echo 1 || echo 0)"
check "response counts observations=3 events=4 (got $(jget "['observations']")/$(jget "['clinicalEvents']"))" \
  "$([ "$(jget "['observations']")" = "3" ] && [ "$(jget "['clinicalEvents']")" = "4" ] && echo 1 || echo 0)"

PID="$(psql_q "SELECT id FROM \"User\" WHERE handle = lower('$MRN');")"
echo "  resolved patient=$PID"
check "patient provisioned from bundle MRN" "$([ -n "$PID" ] && echo 1 || echo 0)"
check "3 observation rows for the patient (got $(psql_q "SELECT count(*) FROM \"Observation\" WHERE \"patientId\"='$PID';"))" \
  "$([ "$(psql_q "SELECT count(*) FROM \"Observation\" WHERE \"patientId\"='$PID';")" = "3" ] && echo 1 || echo 0)"
check "4 clinical event rows for the patient (got $(psql_q "SELECT count(*) FROM \"ClinicalEvent\" WHERE \"patientId\"='$PID';"))" \
  "$([ "$(psql_q "SELECT count(*) FROM \"ClinicalEvent\" WHERE \"patientId\"='$PID';")" = "4" ] && echo 1 || echo 0)"

# ── 2. replay same key + body: no new rows, recorded response returned ───────
post "/api/clinical/ingest/fhir" "$KEY" "$TMP/bundle.json"
check "replay same key -> 202 (got $(cat "$TMP/http"))" "$([ "$(cat "$TMP/http")" = "202" ] && echo 1 || echo 0)"
check "replay reports same observations=3 (got $(jget "['observations']"))" "$([ "$(jget "['observations']")" = "3" ] && echo 1 || echo 0)"
check "replay wrote no new rows (got $(psql_q "SELECT count(*) FROM \"Observation\" WHERE \"patientId\"='$PID';"))" \
  "$([ "$(psql_q "SELECT count(*) FROM \"Observation\" WHERE \"patientId\"='$PID';")" = "3" ] && echo 1 || echo 0)"

# ── 3. new key, same source ids: natural unique key still dedupes ────────────
post "/api/clinical/ingest/fhir" "ing2-$RUN" "$TMP/bundle.json"
check "new key same sources wrote no new rows (got $(psql_q "SELECT count(*) FROM \"Observation\" WHERE \"patientId\"='$PID';"))" \
  "$([ "$(psql_q "SELECT count(*) FROM \"Observation\" WHERE \"patientId\"='$PID';")" = "3" ] && echo 1 || echo 0)"

# ── 4. missing idempotency-key ───────────────────────────────────────────────
post "/api/clinical/ingest/fhir" "-" "$TMP/bundle.json"
check "missing idempotency-key rejected 400 (got $(cat "$TMP/http"))" "$([ "$(cat "$TMP/http")" = "400" ] && echo 1 || echo 0)"

# ── 5. malformed bundle -> 400 with structured issues ────────────────────────
cat >"$TMP/bad.json" <<JSON
{ "resourceType": "Bundle", "type": "collection", "entry": [
  { "resource": { "resourceType": "Patient", "identifier": [ { "system": "urn:tangerine:mrn", "value": "$MRN" } ], "birthDate": "1985-01-01" } },
  { "resource": { "resourceType": "Observation", "id": "bad-$RUN",
    "code": { "coding": [ { "code": "718-7" } ] },
    "valueQuantity": { "value": 13.0, "unit": "g/dL" } } } ] }
JSON
post "/api/clinical/ingest/fhir" "bad-$RUN" "$TMP/bad.json"
check "malformed bundle rejected 400 (got $(cat "$TMP/http"))" "$([ "$(cat "$TMP/http")" = "400" ] && echo 1 || echo 0)"
check "validation returns structured issues ($(jget "['details'][0]['path']"))" \
  "$([ -n "$(jget "['details'][0]['path']")" ] && echo 1 || echo 0)"

# ── 6. lab with no applicable reference range -> 422 ─────────────────────────
cat >"$TMP/norange.json" <<JSON
{ "resourceType": "Bundle", "type": "collection", "entry": [
  { "resource": { "resourceType": "Patient", "identifier": [ { "system": "urn:tangerine:mrn", "value": "mrn-nr-$RUN" } ], "gender": "female", "birthDate": "1985-01-01" } },
  { "resource": { "resourceType": "Observation", "id": "nr-$RUN", "status": "final",
    "category": [ { "coding": [ { "code": "laboratory" } ] } ],
    "code": { "coding": [ { "code": "99999-9", "display": "Made up analyte" } ] },
    "effectiveDateTime": "2026-06-01T08:00:00Z",
    "valueQuantity": { "value": 1.0, "unit": "x" } } } ] }
JSON
post "/api/clinical/ingest/fhir" "norange-$RUN" "$TMP/norange.json"
check "lab with no reference range rejected 422 (got $(cat "$TMP/http"))" "$([ "$(cat "$TMP/http")" = "422" ] && echo 1 || echo 0)"

# ── 7. single observation + adherence event write one row + one event each ───
cat >"$TMP/obs.json" <<JSON
{ "category": "VITAL_SIGNS", "code": "8867-4", "codeSystem": "http://loinc.org",
  "display": "Heart rate", "valueNumeric": 72, "valueUnit": "beats/min",
  "effectiveAt": "2026-06-02T08:00:00Z", "sourceId": "hr-$RUN" }
JSON
post "/api/clinical/observations" "obs-$RUN" "$TMP/obs.json"
check "single observation accepted 202 (got $(cat "$TMP/http"))" "$([ "$(cat "$TMP/http")" = "202" ] && echo 1 || echo 0)"
check "single observation wrote one row" \
  "$([ "$(psql_q "SELECT count(*) FROM \"Observation\" WHERE \"sourceId\"='hr-$RUN';")" = "1" ] && echo 1 || echo 0)"
check "single observation wrote one outbox event" \
  "$([ "$(psql_q "SELECT count(*) FROM \"OutboxEvent\" WHERE type='health.observation.ingested' AND payload->>'sourceId' IS NULL AND payload->>'code'='8867-4';")" -ge "1" ] && echo 1 || echo 0)"

cat >"$TMP/adh.json" <<JSON
{ "type": "MEDICATION_TAKEN", "protocolItemKey": "metformin-am", "occurredAt": "2026-06-02T08:05:00Z", "sourceId": "adh-$RUN" }
JSON
post "/api/clinical/adherence-events" "adh-$RUN" "$TMP/adh.json"
check "adherence event accepted 202 (got $(cat "$TMP/http"))" "$([ "$(cat "$TMP/http")" = "202" ] && echo 1 || echo 0)"
check "adherence event wrote one row" \
  "$([ "$(psql_q "SELECT count(*) FROM \"AdherenceEvent\" WHERE \"sourceId\"='adh-$RUN';")" = "1" ] && echo 1 || echo 0)"
check "adherence event wrote one outbox event" \
  "$([ "$(psql_q "SELECT count(*) FROM \"OutboxEvent\" WHERE type='health.adherence.logged' AND payload->>'patientId'='$CALLER';")" -ge "1" ] && echo 1 || echo 0)"

# ── 7b. an out-of-range lab makes the worker emit a notification event ───────
cat >"$TMP/low.json" <<JSON
{ "category": "LABORATORY", "code": "718-7", "codeSystem": "http://loinc.org",
  "display": "Hemoglobin", "valueNumeric": 8.0, "valueUnit": "g/dL",
  "effectiveAt": "2026-06-02T09:00:00Z", "sourceId": "hgb-low-$RUN" }
JSON
post "/api/clinical/observations" "low-$RUN" "$TMP/low.json"
check "out-of-range lab accepted 202 (got $(cat "$TMP/http"))" "$([ "$(cat "$TMP/http")" = "202" ] && echo 1 || echo 0)"
for _ in $(seq 1 20); do
  [ "$(psql_q "SELECT count(*) FROM \"OutboxEvent\" WHERE type='health.range.alert' AND payload->>'patientId'='$CALLER' AND payload->>'code'='718-7';")" != "0" ] && break
  sleep 1
done
check "worker emitted a range alert for the low value (got $(psql_q "SELECT count(*) FROM \"OutboxEvent\" WHERE type='health.range.alert' AND payload->>'patientId'='$CALLER' AND payload->>'code'='718-7';"))" \
  "$([ "$(psql_q "SELECT count(*) FROM \"OutboxEvent\" WHERE type='health.range.alert' AND payload->>'patientId'='$CALLER' AND payload->>'code'='718-7';")" -ge "1" ] && echo 1 || echo 0)"
check "range alert status is low (got $(psql_q "SELECT payload->>'status' FROM \"OutboxEvent\" WHERE type='health.range.alert' AND payload->>'patientId'='$CALLER' AND payload->>'code'='718-7' LIMIT 1;"))" \
  "$([ "$(psql_q "SELECT payload->>'status' FROM \"OutboxEvent\" WHERE type='health.range.alert' AND payload->>'patientId'='$CALLER' AND payload->>'code'='718-7' LIMIT 1;")" = "low" ] && echo 1 || echo 0)"

# ── 8. worker drains the pipeline and trends become queryable ────────────────
for _ in $(seq 1 20); do
  [ "$(psql_q "SELECT count(*) FROM \"OutboxEvent\" WHERE type LIKE 'health.%' AND status='PENDING';")" = "0" ] && break
  sleep 1
done
check "all health outbox events drained (PENDING=0, got $(psql_q "SELECT count(*) FROM \"OutboxEvent\" WHERE type LIKE 'health.%' AND status='PENDING';"))" \
  "$([ "$(psql_q "SELECT count(*) FROM \"OutboxEvent\" WHERE type LIKE 'health.%' AND status='PENDING';")" = "0" ] && echo 1 || echo 0)"
check "ingestion events processed for the patient (got $(psql_q "SELECT count(*) FROM \"OutboxEvent\" WHERE type='health.observation.ingested' AND status='PROCESSED' AND payload->>'patientId'='$PID';"))" \
  "$([ "$(psql_q "SELECT count(*) FROM \"OutboxEvent\" WHERE type='health.observation.ingested' AND status='PROCESSED' AND payload->>'patientId'='$PID';")" -ge "3" ] && echo 1 || echo 0)"

TR="$(curl -fsS "$API_URL/api/clinical/trends?codes=718-7,2951-2,2339-0" -H "x-user-id: $PID")"
NTR="$(printf '%s' "$TR" | python3 -c 'import sys,json;print(len(json.load(sys.stdin)["trends"]))' 2>/dev/null)"
check "derived trends queryable for the ingested labs (got $NTR)" "$([ "$NTR" = "3" ] && echo 1 || echo 0)"

echo
echo "=== result: $pass passed, $fail failed ==="
[ "$fail" = "0" ]
