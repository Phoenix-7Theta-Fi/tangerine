#!/usr/bin/env bash
#
# Behavioral test: adherence rates and protocol progress (Phase 2).
#
# Proves against a live API + live Postgres (no mocks):
#   1. the adherence rate is measured against the expected schedule over the
#      window (taken / expected).
#   2. "not logged" (no row) is reported separately from "missed"
#      (an explicit MEDICATION_SKIPPED row) — the clinical distinction.
#   3. current and longest completion streaks are computed.
#   4. protocol progress reports completion %, current phase and next milestone.
#
# Each run seeds a uniquely-named patient, so it neither depends on nor disturbs
# the seeded population.
#
# Usage:  scripts/test-health-adherence.sh
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
PID="test-adh-$RUN"
PP="pp-$RUN"
PROT="prot-$RUN"
AS_OF="2026-06-15T12:00:00Z"

echo "=== health adherence behavioral test ==="
echo "api=$API_URL  patient=$PID  asOf=$AS_OF  window=14d"

# ── seed protocol + schedule ─────────────────────────────────────────────────
psql_q "INSERT INTO \"User\"(id,handle,\"displayName\",role,\"createdAt\") VALUES ('$PID','$PID','Adherence Test $RUN','MEMBER', now());
INSERT INTO \"PatientProfile\"(id,\"userId\",mrn,sex,\"birthDate\",\"createdAt\") VALUES ('$PP','$PID','mrn-$RUN','FEMALE','1985-01-01', now());
INSERT INTO \"Protocol\"(id,\"patientId\",name,\"conditionCode\",status,\"startAt\",\"createdAt\") VALUES ('$PROT','$PID','T2D 90-day plan','E11.9','ACTIVE','2026-06-01T00:00:00Z', now());
INSERT INTO \"ProtocolItem\"(id,\"protocolId\",key,name,\"adherenceType\",frequency,\"expectedPerDay\",phase,active,\"createdAt\") VALUES
  ('pi-m-$RUN','$PROT','metformin','Metformin 500 mg','MEDICATION_TAKEN','DAILY',1,'induction',true, now()),
  ('pi-w-$RUN','$PROT','walk','Daily walk','EXERCISE_LOGGED','DAILY',1,'maintenance',true, now());
INSERT INTO \"ProtocolMilestone\"(id,\"protocolId\",\"orderIndex\",name,phase,\"dueAt\",\"requiredCumulativeTaken\",\"createdAt\") VALUES
  ('pm1-$RUN','$PROT',1,'Induction complete','induction','2026-06-15T00:00:00Z',10, now()),
  ('pm2-$RUN','$PROT',2,'Maintenance start','maintenance','2026-07-15T00:00:00Z',20, now());" >/dev/null
check "seeded protocol with 2 items and 2 milestones" "$([ "$(psql_q "SELECT count(*) FROM \"ProtocolItem\" WHERE \"protocolId\"='$PROT';")" = "2" ] && echo 1 || echo 0)"

# ── seed adherence events over 2026-06-02 .. 2026-06-15 (14 days) ────────────
# metformin: taken 9 days, explicitly skipped 2 days, 3 days with no row.
# walk:      taken 7 (oldest) days, 7 days with no row.
mk() { # mk <id> <type> <key> <date>
  printf "('%s','%s','%s','%s','%s','%s','%s', now())" "$1" "$PID" "$2" "$3" "${4}T09:00:00Z" 'MANUAL' "$1"
}
rows=()
for d in 02 03 04 05 09 10 11 14 15; do rows+=("$(mk "m-t-$RUN-$d" MEDICATION_TAKEN metformin "2026-06-$d")"); done
for d in 06 07; do rows+=("$(mk "m-s-$RUN-$d" MEDICATION_SKIPPED metformin "2026-06-$d")"); done
for d in 02 03 04 05 06 07 08; do rows+=("$(mk "w-t-$RUN-$d" EXERCISE_LOGGED walk "2026-06-$d")"); done
SQL="INSERT INTO \"AdherenceEvent\"(id,\"patientId\",type,\"protocolItemKey\",\"occurredAt\",\"dataSource\",\"sourceId\",\"createdAt\") VALUES $(IFS=,; echo "${rows[*]}");"
psql_q "$SQL" >/dev/null
EV="$(psql_q "SELECT count(*) FROM \"AdherenceEvent\" WHERE \"patientId\"='$PID';")"
check "seeded 18 adherence events (got $EV)" "$([ "$EV" = "18" ] && echo 1 || echo 0)"

# ── call adherence endpoint ──────────────────────────────────────────────────
RESP="$(curl -fsS "$API_URL/api/clinical/adherence?protocolId=$PROT&windowDays=14&asOf=$AS_OF" -H "x-user-id: $PID")"
echo "  response: $(printf '%s' "$RESP" | python3 -c 'import sys,json;d=json.load(sys.stdin);print(d["protocols"][0]["items"])' 2>/dev/null)"
item() { # item <key> <field>
  printf '%s' "$RESP" | python3 -c "import sys,json
d=json.load(sys.stdin);i=[x for x in d['protocols'][0]['items'] if x['key']=='$1'][0];print(i['$2'])"
}
check "metformin expected = 14 (got $(item metformin expected))" "$([ "$(item metformin expected)" = "14" ] && echo 1 || echo 0)"
check "metformin taken = 9 (got $(item metformin taken))" "$([ "$(item metformin taken)" = "9" ] && echo 1 || echo 0)"
check "metformin missed (skipped) = 2 (got $(item metformin skipped))" "$([ "$(item metformin skipped)" = "2" ] && echo 1 || echo 0)"
check "metformin not-logged = 3 (got $(item metformin notLogged))" "$([ "$(item metformin notLogged)" = "3" ] && echo 1 || echo 0)"
check "metformin rate = 0.6429 (got $(item metformin adherenceRate))" "$([ "$(item metformin adherenceRate)" = "0.6429" ] && echo 1 || echo 0)"
check "metformin current streak = 2 (got $(item metformin currentStreak))" "$([ "$(item metformin currentStreak)" = "2" ] && echo 1 || echo 0)"
check "metformin longest streak = 4 (got $(item metformin longestStreak))" "$([ "$(item metformin longestStreak)" = "4" ] && echo 1 || echo 0)"

check "walk taken = 7 (got $(item walk taken))" "$([ "$(item walk taken)" = "7" ] && echo 1 || echo 0)"
check "walk not-logged = 7 (got $(item walk notLogged))" "$([ "$(item walk notLogged)" = "7" ] && echo 1 || echo 0)"
check "walk rate = 0.5 (got $(item walk adherenceRate))" "$([ "$(item walk adherenceRate)" = "0.5" ] && echo 1 || echo 0)"
check "walk current streak = 0 (got $(item walk currentStreak))" "$([ "$(item walk currentStreak)" = "0" ] && echo 1 || echo 0)"
check "walk longest streak = 7 (got $(item walk longestStreak))" "$([ "$(item walk longestStreak)" = "7" ] && echo 1 || echo 0)"

# ── protocol progress ────────────────────────────────────────────────────────
PROG="$(curl -fsS "$API_URL/api/clinical/protocols/$PROT/progress?asOf=$AS_OF" -H "x-user-id: $PID")"
echo "  progress: $PROG"
pj() { printf '%s' "$PROG" | python3 -c "import sys,json;d=json.load(sys.stdin);print(d.get('$1'))"; }
check "progress takenTotal = 16 (got $(pj takenTotal))" "$([ "$(pj takenTotal)" = "16" ] && echo 1 || echo 0)"
check "progress currentPhase = maintenance (got $(pj currentPhase))" "$([ "$(pj currentPhase)" = "maintenance" ] && echo 1 || echo 0)"
check "progress nextMilestone = Maintenance start (got $(printf '%s' "$PROG" | python3 -c 'import sys,json;print(json.load(sys.stdin)["nextMilestone"]["name"])'))" \
  "$(printf '%s' "$PROG" | python3 -c 'import sys,json;print(1 if json.load(sys.stdin)["nextMilestone"]["name"]=="Maintenance start" else 0)')"
check "progress completion % in (55.0, 55.4) (got $(pj completionPercentage))" \
  "$(printf '%s' "$PROG" | python3 -c 'import sys,json;c=json.load(sys.stdin)["completionPercentage"];print(1 if 55.0<c<55.4 else 0)')"

echo
echo "=== result: $pass passed, $fail failed ==="
[ "$fail" = "0" ]
