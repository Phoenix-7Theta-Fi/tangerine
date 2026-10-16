#!/usr/bin/env bash
#
# Herdr-orchestrated ADVERSARIAL test suite for health monitoring (Phase 5).
#
# Runs the adversarial workloads — the ones that try to BREAK the system rather
# than exercise the happy path — collects pass/fail, prints a summary, and sends
# a Herdr notification on completion or failure.
#
# Each workload gets its own Herdr tab (when running inside Herdr) so its output
# is isolated. Completion is awaited per pane: via `herdr agent wait` when the
# pane hosts a detected agent, otherwise by polling the workload's rc file.
#
# NOTE ON PARALLELISM: the workloads share ONE Postgres database and each creates
# uniquely-named patients, so they are *mostly* disjoint — but the
# referential-integrity workload asserts over the shared population and the
# populator could reseed. They therefore run SEQUENTIALLY by default. A
# PARALLEL=1 mode launches one tab per workload; it is only safe against a
# per-workload database (or when the populator is already seeded and untouched).
#
# Environment:
#   SUITE_TESTS   comma-separated script names (default: all adversarial ones)
#   PARALLEL=1    (opt-in) launch workloads in parallel Herdr tabs
#   API_URL       default http://localhost:3001
#   HERDR_ENV     set to 1 inside Herdr
#
set -uo pipefail
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$DIR/.." && pwd)"
RESULTS="${RESULTS_DIR:-$(mktemp -d)}"
mkdir -p "$RESULTS"

DEFAULT_TESTS=(
  test-health-idempotency.sh
  test-health-out-of-order.sh
  test-health-adherence-partial.sh
  test-health-reference-range-demographics.sh
  test-health-immutability.sh
  test-health-referential-integrity.sh
)
if [ -n "${SUITE_TESTS:-}" ]; then
  IFS=',' read -r -a TESTS <<< "$SUITE_TESTS"
else
  TESTS=("${DEFAULT_TESTS[@]}")
fi

API_URL="${API_URL:-http://localhost:3001}"
export API_URL

echo "=== Herdr health adversarial suite ==="
echo "root=$ROOT  results=$RESULTS  workloads=${#TESTS[@]}  parallel=${PARALLEL:-0}  api=$API_URL"

# The API-backed workloads need a live server; the DB-only ones do not. Fail fast
# with a clear instruction rather than letting the API tests silently 000.
API_NEEDED=0
for s in "${TESTS[@]}"; do
  case "$s" in
    test-health-immutability.sh|test-health-referential-integrity.sh) ;;
    *) API_NEEDED=1 ;;
  esac
done
if [ "$API_NEEDED" = "1" ] && ! curl -fsS "$API_URL/api/health" >/dev/null 2>&1; then
  echo "FATAL: no API responding at $API_URL. Start it first, e.g.:" >&2
  echo "  pnpm --filter @tangerine/api start:dev" >&2
  exit 1
fi

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
  local s="$1" log="$RESULTS/${s%.sh}.log" ws pane
  ws="$(herdr_workspace)"
  pane="$(herdr tab create --workspace "$ws" --label "${s%.sh}" --no-focus 2>/dev/null \
    | python3 -c 'import sys,json
d=json.load(sys.stdin)
r=d.get("result",{})
print(r.get("root_pane",{}).get("pane_id") or r.get("tab",{}).get("pane_id") or "")' 2>/dev/null)"
  [ -n "$pane" ] || return 1
  herdr pane run "$pane" "cd '$ROOT' && bash 'scripts/$s' >'$log' 2>&1; echo \$? > '$log.rc'" >/dev/null 2>&1
  echo "$pane"
}

# Await a workload launched in a pane: prefer `herdr agent wait` for detected
# agents, then fall back to the rc file (which a shell workload always writes).
wait_for() { # <script> <pane>
  local s="$1" pane="$2" log="$RESULTS/${1%.sh}.log"
  if command -v herdr >/dev/null 2>&1; then
    herdr agent wait "$pane" --until done --until idle --timeout 600000 >/dev/null 2>&1 || true
  fi
  for _ in $(seq 1 1200); do [ -f "$log.rc" ] && break; sleep 0.5; done
}

declare -A PANES
if [ "${PARALLEL:-0}" = "1" ] && in_herdr; then
  echo "-- launching workloads in parallel Herdr tabs --"
  for s in "${TESTS[@]}"; do
    p="$(run_one_in_tab "$s")" || { echo "  (fallback: running $s inline)"; run_one "$s"; continue; }
    PANES["$s"]="$p"
    echo "  -> ${s%.sh} in $p"
  done
  for s in "${TESTS[@]}"; do
    [ -n "${PANES[$s]:-}" ] || continue
    wait_for "$s" "${PANES[$s]}"
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
echo "===================== ADVERSARIAL SUMMARY ====================="
PASSED=0; FAILED=0; FAILED_TESTS=()
printf '%-40s %s\n' "WORKLOAD" "RESULT"
for s in "${TESTS[@]}"; do
  rc="$(cat "$RESULTS/${s%.sh}.log.rc" 2>/dev/null || echo 99)"
  if [ "$rc" = "0" ]; then printf '%-40s \033[32mPASS\033[0m\n' "${s%.sh}"; PASSED=$((PASSED+1));
  else printf '%-40s \033[31mFAIL (rc=%s)\033[0m\n' "${s%.sh}" "$rc"; FAILED=$((FAILED+1)); FAILED_TESTS+=("$s"); fi
done
echo "--------------------------------------------------------------"
echo "passed=$PASSED failed=$FAILED total=${#TESTS[@]}"
echo "logs: $RESULTS"

if command -v herdr >/dev/null 2>&1; then
  if [ "$FAILED" = "0" ]; then
    herdr notification show "Health adversarial suite passed" --body "$PASSED/${#TESTS[@]} adversarial workloads green" --sound done 2>/dev/null || true
  else
    herdr notification show "Health adversarial suite FAILED" --body "$FAILED workload(s) failed: ${FAILED_TESTS[*]}" --sound error 2>/dev/null || true
  fi
fi

[ "$FAILED" = "0" ]
