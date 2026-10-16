#!/usr/bin/env bash
# Runs the health-monitoring benchmark suite against a running API + Postgres
# and writes all artifacts into a timestamped results directory.
#
#   apps/api/performance/run-health.sh
#
# Scenarios: observation ingestion, FHIR bundle ingestion, concurrent sources,
# trend-query scaling, adherence-rate scaling. Also samples outbox lag during
# the ingestion run and captures EXPLAIN (ANALYZE, BUFFERS) for the trend query.
set -uo pipefail

ROOT=$(cd "$(dirname "$0")/../../.." && pwd)
cd "$ROOT"

BASE="${BASE_URL:-http://localhost:3001}"
PG_CONTAINER="${PG_CONTAINER:-tangerine-postgres}"
PG_USER="${PG_USER:-tangerine}"
PG_DB="${PG_DB:-tangerine}"
STAMP="${RUN_STAMP:-$(date +%Y%m%d-%H%M%S)}"
OUT="${ARTIFACT_ROOT:-apps/api/performance/results}/$STAMP"
mkdir -p "$OUT"
export ARTIFACT_DIR="$OUT"
export BASE_URL="$BASE"

INGEST_VUS="${INGEST_VUS:-20}"
INGEST_DURATION="${INGEST_DURATION:-30s}"
BUNDLE_VUS="${BUNDLE_VUS:-10}"
BUNDLE_DURATION="${BUNDLE_DURATION:-30s}"
BUNDLE_OBS="${BUNDLE_OBS:-3}"
MIXED_VUS="${MIXED_VUS:-15}"
MIXED_DURATION="${MIXED_DURATION:-30s}"
TREND_COUNTS="${TREND_COUNTS:-1000 10000 100000 500000}"
TREND_ITERS="${TREND_ITERS:-200}"
ADH_CONFIGS="${ADH_CONFIGS:-20:10000 100:50000 200:200000}"
ADH_ITERS="${ADH_ITERS:-60}"

pg() { docker exec -i "$PG_CONTAINER" psql -U "$PG_USER" -d "$PG_DB" -tAX -c "$1"; }

echo "== tangerine health benchmarks =="
echo "artifacts: $OUT"

if ! curl -sf "$BASE/api/health" >/dev/null; then
  echo "API is not reachable at $BASE — start it first." >&2
  exit 1
fi

# ── 1. observation ingestion throughput + outbox lag ─────────────────────────
echo ""
echo "### observation-ingestion ($(date +%T))"
LAG="$OUT/outbox-lag.csv"
echo "t,pending,relayed,processed" > "$LAG"
(
  while :; do
    paste -sd, <(pg "SELECT count(*) FROM \"OutboxEvent\" WHERE type LIKE 'health.observation.ingested' AND status='PENDING';
                    SELECT count(*) FROM \"OutboxEvent\" WHERE type LIKE 'health.observation.ingested' AND status='RELAYED';
                    SELECT count(*) FROM \"OutboxEvent\" WHERE type LIKE 'health.observation.ingested' AND status='PROCESSED';") \
      | awk -v t="$(date +%s.%N)" '{print t","$0}'
    sleep 1
  done
) >>"$LAG" 2>/dev/null &
SAMPLER=$!
VUS="$INGEST_VUS" DURATION="$INGEST_DURATION" \
  k6 run apps/api/performance/health-observation-ingestion.js
DRAIN_START=$(date +%s.%N)
for _ in $(seq 1 120); do
  [ "$(pg "SELECT count(*) FROM \"OutboxEvent\" WHERE type LIKE 'health%' AND status='PENDING';")" = "0" ] && break
  sleep 0.5
done
DRAIN_S=$(python3 -c "print(round($(date +%s.%N) - $DRAIN_START, 3))")
kill "$SAMPLER" 2>/dev/null
echo "outbox drained ${DRAIN_S}s after writers stopped" | tee "$OUT/outbox-drain.txt"

# ── 2. FHIR bundle ingestion throughput ──────────────────────────────────────
echo ""
echo "### fhir-bundle-ingestion ($(date +%T))"
VUS="$BUNDLE_VUS" DURATION="$BUNDLE_DURATION" OBS_PER_BUNDLE="$BUNDLE_OBS" \
  k6 run apps/api/performance/health-fhir-bundle-ingestion.js

# ── 3. concurrent sources ────────────────────────────────────────────────────
echo ""
echo "### concurrent-sources ($(date +%T))"
VUS="$MIXED_VUS" DURATION="$MIXED_DURATION" \
  k6 run apps/api/performance/health-concurrent-sources.js

# ── 4. trend query latency as observation count grows ────────────────────────
echo ""
echo "### trend-query scaling ($(date +%T))"
for N in $TREND_COUNTS; do
  echo "--- observations=$N ---"
  SUFFIX="t${N}-$STAMP"
  MODE=trend TREND_OBS="$N" PERF_SUFFIX="$SUFFIX" PERF_CODE=8867-4 \
    pnpm --filter @tangerine/api perf:seed-health > "$OUT/seed-trend-$N.json" 2>/dev/null
  PERF_PATIENT_ID="$(tail -1 "$OUT/seed-trend-$N.json" | python3 -c 'import sys,json;print(json.load(sys.stdin)["patientId"])')"
  VUS=4 ITERS="$TREND_ITERS" LABEL="n$N" PERF_PATIENT_ID="$PERF_PATIENT_ID" PERF_CODE=8867-4 \
    k6 run apps/api/performance/health-trend-query.js
  # EXPLAIN the exact trend statement for the largest sizes (first only).
  pg "EXPLAIN (ANALYZE, BUFFERS)
      SELECT DISTINCT ON (code) code, display, \"valueNumeric\", \"effectiveAt\"
        FROM \"Observation\"
       WHERE \"patientId\" = (SELECT \"userId\" FROM \"PatientProfile\" WHERE mrn='MRN-PERF-$SUFFIX')
         AND code = '8867-4' AND \"effectiveAt\" <= now()
       ORDER BY code, \"effectiveAt\" DESC, \"issuedAt\" DESC NULLS LAST;" \
    > "$OUT/explain-trend-$N.txt" 2>&1
done

# ── 5. adherence rate under high event volume ────────────────────────────────
echo ""
echo "### adherence-rate scaling ($(date +%T))"
for CFG in $ADH_CONFIGS; do
  ITEMS="${CFG%%:*}"; EVENTS="${CFG##*:}"
  echo "--- items=$ITEMS events=$EVENTS ---"
  SUFFIX="a${ITEMS}x${EVENTS}-$STAMP"
  MODE=adherence ADH_ITEMS="$ITEMS" ADH_EVENTS="$EVENTS" ADH_DAYS=30 PERF_SUFFIX="$SUFFIX" \
    pnpm --filter @tangerine/api perf:seed-health > "$OUT/seed-adherence-$ITEMS-$EVENTS.json" 2>/dev/null
  PERF_PATIENT_ID="$(tail -1 "$OUT/seed-adherence-$ITEMS-$EVENTS.json" | python3 -c 'import sys,json;print(json.load(sys.stdin)["patientId"])')"
  VUS=4 ITERS="$ADH_ITERS" LABEL="i${ITEMS}e${EVENTS}" PERF_PATIENT_ID="$PERF_PATIENT_ID" WINDOW_DAYS=30 \
    k6 run apps/api/performance/health-adherence-rate.js
done

echo ""
cat > "$OUT/manifest.md" <<EOF
# Health benchmark run $STAMP

- base URL: $BASE
- k6: $(k6 version 2>/dev/null | head -1)
- observation ingestion: VUS=$INGEST_VUS DURATION=$INGEST_DURATION
- FHIR bundle ingestion: VUS=$BUNDLE_VUS DURATION=$BUNDLE_DURATION OBS_PER_BUNDLE=$BUNDLE_OBS
- concurrent sources: VUS=$MIXED_VUS DURATION=$MIXED_DURATION
- trend scaling: counts=[$TREND_COUNTS] iters=$TREND_ITERS code=8867-4
- adherence scaling: configs=[$ADH_CONFIGS] iters=$ADH_ITERS window=30d
- outbox drain after ingestion: ${DRAIN_S}s
EOF

echo ""
echo "HEALTH_BENCHMARKS_COMPLETE $OUT"
