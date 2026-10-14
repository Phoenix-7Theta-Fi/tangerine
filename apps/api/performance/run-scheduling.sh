#!/usr/bin/env bash
# Runs the scheduling benchmark suite against a running API and writes all k6
# JSON artifacts into a timestamped directory. Safe to re-run; seeding is
# isolated to the synthetic `perf.practitioner` account.
set -uo pipefail

ROOT=$(cd "$(dirname "$0")/../../.." && pwd)
cd "$ROOT"

BASE="${BASE_URL:-http://localhost:3001}"
STAMP="${RUN_STAMP:-$(date +%Y%m%d-%H%M%S)}"
OUT="${ARTIFACT_ROOT:-apps/api/performance/results}/$STAMP"
mkdir -p "$OUT"
export ARTIFACT_DIR="$OUT"
export BASE_URL="$BASE"

# Tunables (exported so k6 sees them via __ENV).
export CONTENTION_VUS="${CONTENTION_VUS:-20}"
export CONTENTION_ITER="${CONTENTION_ITER:-10}"
export CONTENTION_RACERS="${CONTENTION_RACERS:-10}"
export IDEM_VUS="${IDEM_VUS:-10}"
export IDEM_ITER="${IDEM_ITER:-10}"
export HOLD_VUS="${HOLD_VUS:-8}"
export HOLD_ITER="${HOLD_ITER:-6}"
export HOLD_TTL="${HOLD_TTL:-5}"
export FEED_VUS="${FEED_VUS:-20}"
export FEED_DURATION="${FEED_DURATION:-30s}"
export SLOT_COUNTS="${SLOT_COUNTS:-0 400 800 1200}"
export SLOT_VUS="${SLOT_VUS:-10}"
export SLOT_DURATION="${SLOT_DURATION:-20s}"

echo "== tangerine scheduling benchmarks =="
echo "artifacts: $OUT"

if ! curl -sf "$BASE/api/health" >/dev/null; then
  echo "API is not reachable at $BASE — start it first." >&2
  exit 1
fi

echo ""
echo "### booking-contention ($(date +%T))"
VUS="$CONTENTION_VUS" ITER="$CONTENTION_ITER" RACERS="$CONTENTION_RACERS" \
  k6 run apps/api/performance/booking-contention.js

echo ""
echo "### reschedule-idempotency ($(date +%T))"
VUS="$IDEM_VUS" ITER="$IDEM_ITER" \
  k6 run apps/api/performance/reschedule-idempotency.js

echo ""
echo "### hold-expiry ($(date +%T))"
VUS="$HOLD_VUS" ITER="$HOLD_ITER" HOLD_TTL_SECONDS="$HOLD_TTL" \
  k6 run apps/api/performance/hold-expiry.js

echo ""
echo "### feed-read warm-up ($(date +%T))"
MAYA=$(curl -s "$BASE/api/session/identities" | jq -r '.[] | select(.handle=="maya") | .id')
for i in $(seq 1 40); do
  curl -s -X POST "$BASE/api/posts" \
    -H "x-user-id: $MAYA" -H 'content-type: application/json' \
    -d "{\"body\":\"benchmark warm-up post $i\"}" >/dev/null
done
sleep 3

echo "### feed-read ($(date +%T))"
VUS="$FEED_VUS" DURATION="$FEED_DURATION" \
  k6 run apps/api/performance/feed-read.js

echo ""
echo "### slot-lookup scaling ($(date +%T))"
for N in $SLOT_COUNTS; do
  echo "--- conflicts=$N ---"
  BOOKING_COUNT="$N" SLOT_MINUTES=15 \
    pnpm --filter @tangerine/api perf:seed-bookings > "$OUT/seed-$N.json" 2>/dev/null
  VUS="$SLOT_VUS" DURATION="$SLOT_DURATION" FROM_DAYS=1 TO_DAYS=15 \
    k6 run apps/api/performance/slot-lookup.js
done

echo ""
cat > "$OUT/manifest.md" <<EOF
# Benchmark run $STAMP

- base URL: $BASE
- k6: $(k6 version 2>/dev/null | head -1)
- contention: VUS=$CONTENTION_VUS ITER=$CONTENTION_ITER RACERS=$CONTENTION_RACERS
- feed-read: VUS=$FEED_VUS DURATION=$FEED_DURATION
- slot-lookup: VUS=$SLOT_VUS DURATION=$SLOT_DURATION counts=$SLOT_COUNTS
EOF

echo ""
echo "BENCHMARKS_COMPLETE $OUT"
