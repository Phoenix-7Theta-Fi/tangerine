#!/usr/bin/env bash
#
# Behavioral test: exactly-once ingestion under a concurrent stampede (Phase 3).
#
# Proves against a live API + live Postgres (no mocks):
#   firing the SAME observation 100 times concurrently, all under one
#   idempotency key, writes exactly ONE observation row and exactly ONE outbox
#   event — while every caller gets a successful (202) response, either as the
#   winner's result or as a replay of it.
#
# The observation is a vital sign, so it needs no reference range; the test is
# about the write path, not the range layer.
#
# Usage:  scripts/test-health-idempotency.sh
# Env:    API_URL (default http://localhost:3001)
#         PG_CONTAINER (default tangerine-postgres), PG_USER, PG_DB
#
set -uo pipefail

API_URL="${API_URL:-http://localhost:3001}"
PG_CONTAINER="${PG_CONTAINER:-tangerine-postgres}"
PG_USER="${PG_USER:-tangerine}"
PG_DB="${PG_DB:-tangerine}"
CONCURRENCY="${CONCURRENCY:-100}"

pass=0; fail=0
check() { if [ "$2" = "1" ]; then printf '  \033[32mPASS\033[0m  %s\n' "$1"; pass=$((pass+1)); else printf '  \033[31mFAIL\033[0m  %s\n' "$1"; fail=$((fail+1)); fi; }
psql_q() { docker exec -i "$PG_CONTAINER" psql -U "$PG_USER" -d "$PG_DB" -tAX -c "$1"; }

RUN="$(date +%s%N)"
PID="test-conc-$RUN"
PP="pp-conc-$RUN"
KEY="conc-$RUN"
SRC="conc-src-$RUN"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

echo "=== health idempotency stampede test ==="
echo "api=$API_URL  patient=$PID  key=$KEY  concurrency=$CONCURRENCY"

psql_q "INSERT INTO \"User\"(id,handle,\"displayName\",role,\"createdAt\") VALUES ('$PID','$PID','Concurrency Test $RUN','MEMBER', now());
INSERT INTO \"PatientProfile\"(id,\"userId\",mrn,sex,\"birthDate\",\"createdAt\") VALUES ('$PP','$PID','mrn-$RUN','FEMALE','1980-01-01', now());" >/dev/null

cat >"$TMP/obs.json" <<JSON
{ "category": "VITAL_SIGNS", "code": "8867-4", "codeSystem": "http://loinc.org",
  "display": "Heart rate", "valueNumeric": 72, "valueUnit": "beats/min",
  "effectiveAt": "2026-06-03T08:00:00Z", "sourceId": "$SRC" }
JSON

echo "  firing $CONCURRENCY concurrent identical requests..."
seq 1 "$CONCURRENCY" | xargs -P "$CONCURRENCY" -I{} \
  curl -s -o /dev/null -w '%{http_code}\n' \
    -X POST "$API_URL/api/clinical/observations" \
    -H 'content-type: application/json' -H "x-user-id: $PID" -H "idempotency-key: $KEY" \
    --data "@$TMP/obs.json" >"$TMP/codes" 2>/dev/null

sort "$TMP/codes" | uniq -c | sed 's/^/    status /'
OK="$(grep -c '^202$' "$TMP/codes" || true)"
FIVEXX="$(grep -c '^5' "$TMP/codes" || true)"

check "no 5xx under the stampede (got $FIVEXX)" "$([ "$FIVEXX" = "0" ] && echo 1 || echo 0)"
check "every request succeeded or replayed 202 (got $OK/$CONCURRENCY)" "$([ "$OK" = "$CONCURRENCY" ] && echo 1 || echo 0)"
check "exactly ONE observation row for the source (got $(psql_q "SELECT count(*) FROM \"Observation\" WHERE \"sourceId\"='$SRC';"))" \
  "$([ "$(psql_q "SELECT count(*) FROM \"Observation\" WHERE \"sourceId\"='$SRC';")" = "1" ] && echo 1 || echo 0)"
check "exactly ONE observation row for the patient (got $(psql_q "SELECT count(*) FROM \"Observation\" WHERE \"patientId\"='$PID';"))" \
  "$([ "$(psql_q "SELECT count(*) FROM \"Observation\" WHERE \"patientId\"='$PID';")" = "1" ] && echo 1 || echo 0)"
# The side effect (outbox event) must be exactly-once too, not just the row.
for _ in $(seq 1 15); do
  [ "$(psql_q "SELECT count(*) FROM \"OutboxEvent\" WHERE type='health.observation.ingested' AND payload->>'patientId'='$PID' AND payload->>'code'='8867-4';")" != "0" ] && break
  sleep 1
done
check "exactly ONE outbox event for the write (got $(psql_q "SELECT count(*) FROM \"OutboxEvent\" WHERE type='health.observation.ingested' AND payload->>'patientId'='$PID' AND payload->>'code'='8867-4';"))" \
  "$([ "$(psql_q "SELECT count(*) FROM \"OutboxEvent\" WHERE type='health.observation.ingested' AND payload->>'patientId'='$PID' AND payload->>'code'='8867-4';")" = "1" ] && echo 1 || echo 0)"
check "idempotency key recorded COMPLETED (got $(psql_q "SELECT status FROM \"IdempotencyKey\" WHERE \"userId\"='$PID' AND key='$KEY';"))" \
  "$([ "$(psql_q "SELECT status FROM \"IdempotencyKey\" WHERE \"userId\"='$PID' AND key='$KEY';")" = "COMPLETED" ] && echo 1 || echo 0)"

echo
echo "=== result: $pass passed, $fail failed ==="
[ "$fail" = "0" ]
