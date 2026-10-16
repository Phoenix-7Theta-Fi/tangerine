#!/usr/bin/env bash
#
# Adversarial test: partial logging with full adherence on logged days (Phase 5).
#
# Proves against a live API + live Postgres (no mocks):
#   a patient who adheres fully on the days they actually log, but skips logging
#   on the rest, must read correctly on BOTH axes:
#     * adherence rate = taken / expected — the fraction of the whole schedule
#       met, which is < 1 because of the gap;
#     * logging rate   = logged slots / expected = (expected - notLogged) /
#       expected — the fraction of the schedule the patient even recorded, and
#       it is the axis that moves when logging tapers off.
#   Crucially, "not logged" is NOT counted as "missed": a missing day is unknown,
#   not a failure, and the two are reported separately.
#
# Usage:  scripts/test-health-adherence-partial.sh
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
PID="test-padh-$RUN"
PP="pp-$RUN"
PROT="prot-$RUN"
AS_OF="2026-06-11T12:00:00Z"
WINDOW=10

echo "=== health adherence partial-logging test ==="
echo "api=$API_URL  patient=$PID  asOf=$AS_OF  window=${WINDOW}d"

psql_q "INSERT INTO \"User\"(id,handle,\"displayName\",role,\"createdAt\") VALUES ('$PID','$PID','Partial Adherence $RUN','MEMBER', now());
INSERT INTO \"PatientProfile\"(id,\"userId\",mrn,sex,\"birthDate\",\"createdAt\") VALUES ('$PP','$PID','mrn-$RUN','FEMALE','1985-01-01', now());
INSERT INTO \"Protocol\"(id,\"patientId\",name,\"conditionCode\",status,\"startAt\",\"createdAt\") VALUES ('$PROT','$PID','T2D plan','E11.9','ACTIVE','2026-06-01T00:00:00Z', now());
INSERT INTO \"ProtocolItem\"(id,\"protocolId\",key,name,\"adherenceType\",frequency,\"expectedPerDay\",phase,active,\"createdAt\") VALUES
  ('pi-$RUN','$PROT','metformin','Metformin 500 mg','MEDICATION_TAKEN','DAILY',1,'induction',true, now());" >/dev/null

# Window 2026-06-02 .. 2026-06-11 (10 days). Logged fully on the first 6 days
# (exactly one TAKEN row per day); the remaining 4 days have no row at all.
rows=()
for d in 02 03 04 05 06 07; do
  rows+=("('m-$RUN-$d','$PID','MEDICATION_TAKEN','metformin','2026-06-${d}T09:00:00Z','MANUAL','m-$RUN-$d', now())")
done
psql_q "INSERT INTO \"AdherenceEvent\"(id,\"patientId\",type,\"protocolItemKey\",\"occurredAt\",\"dataSource\",\"sourceId\",\"createdAt\") VALUES $(IFS=,; echo "${rows[*]}");" >/dev/null

RESP="$(curl -fsS "$API_URL/api/clinical/adherence?protocolId=$PROT&windowDays=$WINDOW&asOf=$AS_OF" -H "x-user-id: $PID")"
echo "  item: $(printf '%s' "$RESP" | python3 -c 'import sys,json;print(json.load(sys.stdin)["protocols"][0]["items"][0])' 2>/dev/null)"
v() { printf '%s' "$RESP" | python3 -c "import sys,json;print(json.load(sys.stdin)['protocols'][0]['items'][0]['$1'])"; }

check "expected slots over the window = 10 (got $(v expected))" "$([ "$(v expected)" = "10" ] && echo 1 || echo 0)"
check "taken = 6 (got $(v taken))" "$([ "$(v taken)" = "6" ] && echo 1 || echo 0)"
check "skipped = 0 — the gap is unknown, not failed (got $(v skipped))" "$([ "$(v skipped)" = "0" ] && echo 1 || echo 0)"
check "not-logged = 4 (got $(v notLogged))" "$([ "$(v notLogged)" = "4" ] && echo 1 || echo 0)"
check "adherence rate = taken/expected = 0.6 (got $(v adherenceRate))" "$([ "$(v adherenceRate)" = "0.6" ] && echo 1 || echo 0)"

# The logging rate is derived, not stored: logged slots / expected.
LOGGING_RATE="$(python3 -c "e=$(v expected); n=$(v notLogged); print(round((e-n)/e,4))")"
check "derived logging rate = (expected - notLogged)/expected = 0.6 (got $LOGGING_RATE)" \
  "$([ "$LOGGING_RATE" = "0.6" ] && echo 1 || echo 0)"

# Full adherence ON the logged days: exactly one TAKEN row on each of the 6 days.
LOGGED_DAYS="$(psql_q "SELECT count(DISTINCT date(\"occurredAt\")) FROM \"AdherenceEvent\" WHERE \"patientId\"='$PID' AND type='MEDICATION_TAKEN';")"
MAX_PER_DAY="$(psql_q "SELECT max(c) FROM (SELECT count(*) AS c FROM \"AdherenceEvent\" WHERE \"patientId\"='$PID' AND type='MEDICATION_TAKEN' GROUP BY date(\"occurredAt\")) d;")"
check "adherence is full on logged days: 6 distinct logged days (got $LOGGED_DAYS)" "$([ "$LOGGED_DAYS" = "6" ] && echo 1 || echo 0)"
check "never more than the expected 1 per logged day (max/day=$MAX_PER_DAY)" "$([ "$MAX_PER_DAY" = "1" ] && echo 1 || echo 0)"
check "anti-conflation: notLogged (4) and skipped (0) sum to the unmet slots (got $(($(v notLogged) + $(v skipped))) of $(( $(v expected) - $(v taken) )))" \
  "$([ "$(( $(v notLogged) + $(v skipped) ))" = "$(( $(v expected) - $(v taken) ))" ] && echo 1 || echo 0)"

echo
echo "=== result: $pass passed, $fail failed ==="
[ "$fail" = "0" ]
