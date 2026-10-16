#!/usr/bin/env bash
#
# Behavioral test: trends derive from event time, not arrival order (Phase 3).
#
# Proves against a live API + live Postgres (no mocks):
#   three observations for one code are ingested in a deliberately jumbled
#   arrival order (newest, then oldest, then middle). The derived trend still
#   reports the chronologically-latest value as "latest" and the value at the
#   lookback boundary as "lookback", with the delta and direction that follow —
#   because the pipeline orders by effectiveAt, not by insertion.
#
# Uses a vital sign (heart rate) so no reference range is required.
#
# Usage:  scripts/test-health-out-of-order.sh
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
PID="test-order-$RUN"
PP="pp-order-$RUN"

echo "=== health out-of-order derivation test ==="
echo "api=$API_URL  patient=$PID"

psql_q "INSERT INTO \"User\"(id,handle,\"displayName\",role,\"createdAt\") VALUES ('$PID','$PID','Order Test $RUN','MEMBER', now());
INSERT INTO \"PatientProfile\"(id,\"userId\",mrn,sex,\"birthDate\",\"createdAt\") VALUES ('$PP','$PID','mrn-$RUN','FEMALE','1980-01-01', now());" >/dev/null

ingest() { # ingest <suffix> <effectiveAt> <value>
  curl -s -o /dev/null -w '%{http_code}' -X POST "$API_URL/api/clinical/observations" \
    -H 'content-type: application/json' -H "x-user-id: $PID" -H "idempotency-key: order-$1-$RUN" \
    --data "{\"category\":\"VITAL_SIGNS\",\"code\":\"8867-4\",\"codeSystem\":\"http://loinc.org\",\"display\":\"Heart rate\",\"valueNumeric\":$3,\"valueUnit\":\"beats/min\",\"effectiveAt\":\"$2\",\"sourceId\":\"hr-$1-$RUN\"}"
}

# Arrival order: newest (June) first, then oldest (January), then middle (April).
C1="$(ingest jun 2026-06-01T08:00:00Z 80)"
C2="$(ingest jan 2026-01-01T08:00:00Z 60)"
C3="$(ingest apr 2026-04-01T08:00:00Z 70)"
check "all three observations accepted (got $C1/$C2/$C3)" \
  "$([ "$C1" = "202" ] && [ "$C2" = "202" ] && [ "$C3" = "202" ] && echo 1 || echo 0)"
check "three rows stored (got $(psql_q "SELECT count(*) FROM \"Observation\" WHERE \"patientId\"='$PID';"))" \
  "$([ "$(psql_q "SELECT count(*) FROM \"Observation\" WHERE \"patientId\"='$PID';")" = "3" ] && echo 1 || echo 0)"

RESP="$(curl -fsS "$API_URL/api/clinical/trends?codes=8867-4&lookbackDays=90&asOf=2026-06-15T00:00:00Z" -H "x-user-id: $PID")"
echo "  trend: $(printf '%s' "$RESP" | python3 -c 'import sys,json;t=json.load(sys.stdin)["trends"][0];print((t["latestValue"],t["lookbackValue"],t["delta"],t["direction"]))' 2>/dev/null)"
q() { printf '%s' "$RESP" | python3 -c "import sys,json;t=json.load(sys.stdin)['trends'][0];print(t['$1'])"; }

check "latest = June value 80, ingested first (got $(q latestValue))" "$([ "$(q latestValue)" = "80" ] && echo 1 || echo 0)"
check "lookback = January value 60, ingested second (got $(q lookbackValue))" "$([ "$(q lookbackValue)" = "60" ] && echo 1 || echo 0)"
check "delta = 20 (got $(q delta))" "$([ "$(q delta)" = "20" ] && echo 1 || echo 0)"
check "direction = rising (got $(q direction))" "$([ "$(q direction)" = "rising" ] && echo 1 || echo 0)"

# The worker drains the three ingestion events (best-effort).
for _ in $(seq 1 15); do
  [ "$(psql_q "SELECT count(*) FROM \"OutboxEvent\" WHERE type LIKE 'health.%' AND payload->>'patientId'='$PID' AND status='PENDING';")" = "0" ] && break
  sleep 1
done
check "all three ingestion events drained (PENDING=0)" \
  "$([ "$(psql_q "SELECT count(*) FROM \"OutboxEvent\" WHERE type LIKE 'health.%' AND payload->>'patientId'='$PID' AND status='PENDING';")" = "0" ] && echo 1 || echo 0)"

echo
echo "=== result: $pass passed, $fail failed ==="
[ "$fail" = "0" ]
