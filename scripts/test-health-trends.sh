#!/usr/bin/env bash
#
# Behavioral test: biomarker trends and reference-range resolution (Phase 2).
#
# Proves against a live API + live Postgres (no mocks):
#   1. the trend endpoint returns the latest value for a code.
#   2. it returns the value at the configured lookback interval.
#   3. it computes the delta and the direction of change.
#   4. it classifies the latest value against the patient's applicable range
#      (female adult hemoglobin band, not the wildcard).
#   5. the per-observation range endpoint resolves the same range.
#
# Each run seeds a uniquely-named patient, so it neither depends on nor disturbs
# the seeded population.
#
# Usage:  scripts/test-health-trends.sh
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
PID="test-trend-$RUN"
PP="pp-$RUN"
AS_OF="2026-06-01T00:00:00Z"

echo "=== health trends behavioral test ==="
echo "api=$API_URL  patient=$PID  asOf=$AS_OF"

# ── seed a known patient (female, adult) + two codes at known times ──────────
psql_q "INSERT INTO \"User\"(id,handle,\"displayName\",role,\"createdAt\") VALUES ('$PID','$PID','Trend Test $RUN','MEMBER', now());
INSERT INTO \"PatientProfile\"(id,\"userId\",mrn,sex,\"birthDate\",\"createdAt\") VALUES ('$PP','$PID','mrn-$RUN','FEMALE','1980-01-01', now());
INSERT INTO \"ReferenceRange\"(id,code,\"codeSystem\",display,\"valueUnit\",sex,\"ageMinDays\",\"ageMaxDays\",\"lowValue\",\"highValue\",\"effectiveFrom\",\"createdAt\") VALUES
  ('rr-$RUN-hgb','718-7','http://loinc.org','Hemoglobin','g/dL','FEMALE',6571,NULL,12.0,15.5,'2000-01-01', now()),
  ('rr-$RUN-na','2951-2','http://loinc.org','Sodium','mmol/L',NULL,NULL,NULL,135,145,'2000-01-01', now());
INSERT INTO \"Observation\"(id,\"patientId\",category,code,\"codeSystem\",display,\"valueNumeric\",\"valueUnit\",\"effectiveAt\",\"dataSource\",\"sourceId\",\"createdAt\") VALUES
  ('o1-$RUN','$PID','LABORATORY','718-7','http://loinc.org','Hemoglobin',10.0,'g/dL','2026-05-30T00:00:00Z','FHIR_IMPORT','src-hgb-new-$RUN', now()),
  ('o2-$RUN','$PID','LABORATORY','718-7','http://loinc.org','Hemoglobin',14.0,'g/dL','2026-01-01T00:00:00Z','FHIR_IMPORT','src-hgb-old-$RUN', now()),
  ('o3-$RUN','$PID','LABORATORY','2951-2','http://loinc.org','Sodium',140,'mmol/L','2026-05-30T00:00:00Z','FHIR_IMPORT','src-na-new-$RUN', now()),
  ('o4-$RUN','$PID','LABORATORY','2951-2','http://loinc.org','Sodium',136,'mmol/L','2026-01-01T00:00:00Z','FHIR_IMPORT','src-na-old-$RUN', now());" >/dev/null
check "seeded test patient with 4 observations" "$([ "$(psql_q "SELECT count(*) FROM \"Observation\" WHERE \"patientId\"='$PID';")" = "4" ] && echo 1 || echo 0)"

# ── call the trend endpoint ──────────────────────────────────────────────────
RESP="$(curl -fsS "$API_URL/api/clinical/trends?lookbackDays=90&codes=718-7,2951-2&asOf=$AS_OF" -H "x-user-id: $PID")"
echo "  response: $(printf '%s' "$RESP" | python3 -c 'import sys,json;d=json.load(sys.stdin);print([ (t["code"],t["latestValue"],t["lookbackValue"],t["delta"],t["direction"],t["rangeStatus"]) for t in d["trends"]])' 2>/dev/null)"

q() { # q <code> <field>
  printf '%s' "$RESP" | python3 -c "import sys,json;d=json.load(sys.stdin)
t=[x for x in d['trends'] if x['code']=='$1']
print('' if not t else t[0].get('$2'))"
}
check "hemoglobin latest value = 10.0 (got $(q 718-7 latestValue))" "$([ "$(q 718-7 latestValue)" = "10" ] && echo 1 || echo 0)"
check "hemoglobin lookback value = 14.0 (got $(q 718-7 lookbackValue))" "$([ "$(q 718-7 lookbackValue)" = "14" ] && echo 1 || echo 0)"
check "hemoglobin delta = -4.0 (got $(q 718-7 delta))" "$([ "$(q 718-7 delta)" = "-4" ] && echo 1 || echo 0)"
check "hemoglobin direction = falling (got $(q 718-7 direction))" "$([ "$(q 718-7 direction)" = "falling" ] && echo 1 || echo 0)"
check "hemoglobin status = low via female band (got $(q 718-7 rangeStatus))" "$([ "$(q 718-7 rangeStatus)" = "low" ] && echo 1 || echo 0)"
check "sodium latest = 140 (got $(q 2951-2 latestValue))" "$([ "$(q 2951-2 latestValue)" = "140" ] && echo 1 || echo 0)"
check "sodium lookback = 136 (got $(q 2951-2 lookbackValue))" "$([ "$(q 2951-2 lookbackValue)" = "136" ] && echo 1 || echo 0)"
check "sodium direction = rising (got $(q 2951-2 direction))" "$([ "$(q 2951-2 direction)" = "rising" ] && echo 1 || echo 0)"
check "sodium status = normal (got $(q 2951-2 rangeStatus))" "$([ "$(q 2951-2 rangeStatus)" = "normal" ] && echo 1 || echo 0)"

# ── per-observation range endpoint agrees ────────────────────────────────────
RR="$(curl -fsS "$API_URL/api/clinical/observations/o1-$RUN/range" -H "x-user-id: $PID")"
RSTATUS="$(printf '%s' "$RR" | python3 -c 'import sys,json;print(json.load(sys.stdin)["rangeStatus"])')"
RLOW="$(printf '%s' "$RR" | python3 -c 'import sys,json;print(json.load(sys.stdin)["range"]["lowValue"])')"
RHIGH="$(printf '%s' "$RR" | python3 -c 'import sys,json;print(json.load(sys.stdin)["range"]["highValue"])')"
check "observation range status = low (got $RSTATUS)" "$([ "$RSTATUS" = "low" ] && echo 1 || echo 0)"
check "observation range low/high = 12/15.5 (got $RLOW/$RHIGH)" "$([ "$RLOW" = "12" ] && [ "$RHIGH" = "15.5" ] && echo 1 || echo 0)"

echo
echo "=== result: $pass passed, $fail failed ==="
[ "$fail" = "0" ]
