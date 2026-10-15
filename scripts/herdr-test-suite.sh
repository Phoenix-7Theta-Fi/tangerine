#!/usr/bin/env bash
#
# Herdr-orchestrated behavioral test suite.
#
# Runs every workload, collects pass/fail, prints a summary, and sends a Herdr
# notification. Each workload gets its own Herdr tab (when running inside
# Herdr) so its output is isolated.
#
# NOTE ON PARALLELISM: the workloads share ONE Postgres database and each resets
# the tables it asserts on, so running them simultaneously would corrupt each
# other's counts. The suite therefore runs them SEQUENTIALLY by default. A
# PARALLEL=1 mode launches one tab per workload for illustration, but is only
# safe against disjoint data (e.g. a per-workload database).
#
# Environment:
#   SUITE_TESTS   comma-separated script names (default: all)
#   PARALLEL=1    (opt-in) launch workloads in parallel Herdr tabs
#   HERDR_ENV     set to 1 inside Herdr
#
set -uo pipefail
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$DIR/.." && pwd)"
RESULTS="${RESULTS_DIR:-$(mktemp -d)}"
mkdir -p "$RESULTS"

DEFAULT_TESTS=(
  test-ledger.sh
  test-idempotency.sh
  test-webhook-idempotency.sh
  test-webhook-ordering.sh
  test-inventory-race.sh
  test-cart-concurrency.sh
  test-order-state-machine.sh
  test-saga-compensation.sh
  test-saga-failure.sh
  test-e2e-purchase.sh
  test-out-of-order.sh
  test-inventory-exhaustion.sh
  test-concurrent-ledger.sh
  test-webhook-replay.sh
)
if [ -n "${SUITE_TESTS:-}" ]; then
  IFS=',' read -r -a TESTS <<< "$SUITE_TESTS"
else
  TESTS=("${DEFAULT_TESTS[@]}")
fi

echo "=== Herdr test suite ==="
echo "root=$ROOT  results=$RESULTS  workloads=${#TESTS[@]}  parallel=${PARALLEL:-0}"

in_herdr() { command -v herdr >/dev/null 2>&1 && [ "${HERDR_ENV:-}" = "1" ]; }

run_one() { # <script> ; writes log + rc
  local s="$1" log="$RESULTS/${1%.sh}.log"
  ( cd "$ROOT" && bash "scripts/$s" ) >"$log" 2>&1
  echo $? > "$log.rc"
}

herdr_workspace() {
  herdr pane current 2>/dev/null | python3 -c 'import sys,json;print(json.load(sys.stdin)["result"]["pane"]["workspace_id"])' 2>/dev/null
}

run_one_in_tab() { # <script> -> pane id
  local s="$1" log="$RESULTS/${1%.sh}.log" ws pane
  ws="$(herdr_workspace)"
  pane="$(herdr tab create --workspace "$ws" --label "${s%.sh}" --no-focus 2>/dev/null \
    | python3 -c 'import sys,json
d=json.load(sys.stdin)
r=d.get("result",{})
print(r.get("pane",{}).get("pane_id") or r.get("tab",{}).get("pane_id") or "")' 2>/dev/null)"
  [ -n "$pane" ] || return 1
  herdr pane run "$pane" "cd '$ROOT' && bash 'scripts/$s' >'$log' 2>&1; echo \$? > '$log.rc'" >/dev/null 2>&1
  echo "$pane"
}

declare -A PANES
if [ "${PARALLEL:-0}" = "1" ] && in_herdr; then
  echo "-- launching workloads in parallel Herdr tabs --"
  for s in "${TESTS[@]}"; do
    p="$(run_one_in_tab "$s")" || { echo "  (fallback: running $s inline)"; run_one "$s"; continue; }
    PANES["$s"]="$p"
    echo "  -> ${s%.sh} in $p"
  done
  # wait for every rc file
  for s in "${TESTS[@]}"; do
    [ -n "${PANES[$s]:-}" ] || continue
    log="$RESULTS/${s%.sh}.log"
    for _ in $(seq 1 600); do [ -f "$log.rc" ] && break; sleep 0.5; done
  done
else
  for s in "${TESTS[@]}"; do
    printf '\n----- %s -----\n' "${s%.sh}"
    run_one "$s"
    tail -n 2 "$RESULTS/${s%.sh}.log" 2>/dev/null | sed 's/^/    /'
  done
fi

# ── summary ──────────────────────────────────────────────────────────────
echo
echo "===================== SUITE SUMMARY ====================="
PASSED=0; FAILED=0; FAILED_TESTS=()
printf '%-32s %s\n' "WORKLOAD" "RESULT"
for s in "${TESTS[@]}"; do
  rc="$(cat "$RESULTS/${s%.sh}.log.rc" 2>/dev/null || echo 99)"
  if [ "$rc" = "0" ]; then printf '%-32s \033[32mPASS\033[0m\n' "${s%.sh}"; PASSED=$((PASSED+1));
  else printf '%-32s \033[31mFAIL (rc=%s)\033[0m\n' "${s%.sh}" "$rc"; FAILED=$((FAILED+1)); FAILED_TESTS+=("$s"); fi
done
echo "---------------------------------------------------------"
echo "passed=$PASSED failed=$FAILED total=${#TESTS[@]}"
echo "logs: $RESULTS"

if command -v herdr >/dev/null 2>&1; then
  if [ "$FAILED" = "0" ]; then
    herdr notification show "Test suite passed" --body "$PASSED/${#TESTS[@]} workloads green" --sound done 2>/dev/null || true
  else
    herdr notification show "Test suite FAILED" --body "$FAILED workload(s) failed: ${FAILED_TESTS[*]}" --sound error 2>/dev/null || true
  fi
fi

[ "$FAILED" = "0" ]
