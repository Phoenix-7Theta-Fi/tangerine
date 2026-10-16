#!/usr/bin/env bash
#
# Adversarial test: reference ranges follow the patient's demographics (Phase 5).
#
# Proves against a live API + live Postgres (no mocks):
#   the SAME code and the SAME value resolve to DIFFERENT ranges for a
#   pediatric patient and an adult, because the range is chosen from the
#   patient's age at the time of the observation — not from a single global
#   table. A heart rate of 150/min is normal for an infant and high for a
#   40-year-old; the API must say so.
#
# The band selection is the database's job (ORDER BY specificity), so this test
# asserts the resolved band, not just the status.
#
# Usage:  scripts/test-health-reference-range-demographics.sh
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

# Two patients, same observation (heart rate 150/min), different ages.
seed_patient() { # seed_patient <tag> <birth-interval>
  local tag="$1" birth="$2"
  local pid="test-$tag-$RUN" pp="pp-$tag-$RUN" obs="obs-$tag-$RUN"
  psql_q "INSERT INTO \"User\"(id,handle,\"displayName\",role,\"createdAt\") VALUES ('$pid','$pid','Range Test $tag $RUN','MEMBER', now());
INSERT INTO \"PatientProfile\"(id,\"userId\",mrn,sex,\"birthDate\",\"createdAt\") VALUES ('$pp','$pid','mrn-$tag-$RUN','FEMALE', now() - interval '$birth', now());
INSERT INTO \"Observation\"(id,\"patientId\",category,code,\"codeSystem\",display,\"valueNumeric\",\"valueUnit\",\"effectiveAt\",\"dataSource\",\"sourceId\",\"createdAt\") VALUES
  ('$obs','$pid','VITAL_SIGNS','8867-4','http://loinc.org','Heart rate',150,'/min', now(), 'MANUAL','src-$tag-$RUN', now());" >/dev/null
  echo "$pid $obs"
}

echo "=== health reference-range demographics test ==="
echo "api=$API_URL  code=8867-4 (heart rate)  value=150/min"

read -r PED_PID PED_OBS <<<"$(seed_patient ped '180 days')"
read -r ADULT_PID ADULT_OBS <<<"$(seed_patient adult '40 years')"

range() { # range <user-id> <obs-id> -> curl JSON
  curl -fsS "$API_URL/api/clinical/observations/$2/range" -H "x-user-id: $1"
}
rj() { printf '%s' "$1" | python3 -c "import sys,json;d=json.load(sys.stdin);r=d.get('range') or {};print(r.get('$2') if '$2' in r else d.get('$2'))"; }

PED="$(range "$PED_PID" "$PED_OBS")"
ADULT="$(range "$ADULT_PID" "$ADULT_OBS")"
echo "  pediatric: $(printf '%s' "$PED" | python3 -c 'import sys,json;d=json.load(sys.stdin);r=d["range"];print(d["rangeStatus"],r["ageMinDays"],r["ageMaxDays"],r["lowValue"],r["highValue"])' 2>/dev/null)"
echo "  adult:     $(printf '%s' "$ADULT" | python3 -c 'import sys,json;d=json.load(sys.stdin);r=d["range"];print(d["rangeStatus"],r["ageMinDays"],r["ageMaxDays"],r["lowValue"],r["highValue"])' 2>/dev/null)"

check "pediatric resolves the 0–364 day band (ageMaxDays=$(rj "$PED" ageMaxDays))" \
  "$([ "$(rj "$PED" ageMaxDays)" = "364" ] && echo 1 || echo 0)"
check "pediatric value 150 is normal (got $(rj "$PED" rangeStatus))" \
  "$([ "$(rj "$PED" rangeStatus)" = "normal" ] && echo 1 || echo 0)"

check "adult resolves the adult band (ageMinDays=$(rj "$ADULT" ageMinDays))" \
  "$([ "$(rj "$ADULT" ageMinDays)" = "6571" ] && echo 1 || echo 0)"
check "adult value 150 is high (got $(rj "$ADULT" rangeStatus))" \
  "$([ "$(rj "$ADULT" rangeStatus)" = "high" ] && echo 1 || echo 0)"

check "the two patients resolved DIFFERENT bands" \
  "$([ "$(rj "$PED" ageMaxDays)" = "364" ] && [ "$(rj "$ADULT" ageMinDays)" = "6571" ] && echo 1 || echo 0)"

echo
echo "=== result: $pass passed, $fail failed ==="
[ "$fail" = "0" ]
