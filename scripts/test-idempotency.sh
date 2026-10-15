#!/usr/bin/env bash
#
# Behavioral test: idempotency with recovery points.
#
# Proves, against a live API + live Postgres:
#   1. Firing the SAME operation 100 times concurrently (separate processes)
#      produces exactly ONE ledger transaction.
#   2. All 100 responses are identical (the winner's response is recorded and
#      replayed to every concurrent duplicate).
#   3. The idempotency row ends COMPLETED, recovery point cleared.
#   4. The same key with a different body is rejected (409).
#   5. CRASH RECOVERY (when the API runs with IDEMPOTENCY_CRASH_TEST=1): an
#      attempt that "crashes" after its first recovery point leaves a FAILED row
#      with the recovery point intact; a retry RESUMES from that point and
#      completes, still leaving exactly one ledger transaction.
#
# Usage:  scripts/test-idempotency.sh
# Env:    API_URL, PG_CONTAINER, PG_USER, PG_DB, N (default 100)
#         LEDGER_TEST_RESET=0 to skip the reset (default: reset).
#
set -uo pipefail

API_URL="${API_URL:-http://localhost:3001}"
PG_CONTAINER="${PG_CONTAINER:-tangerine-postgres}"
PG_USER="${PG_USER:-tangerine}"
PG_DB="${PG_DB:-tangerine}"
N="${N:-100}"
RESET="${LEDGER_TEST_RESET:-1}"

pass=0; fail=0
check() {
  if [ "$2" = "1" ]; then
    printf '  \033[32mPASS\033[0m  %s\n' "$1"; pass=$((pass + 1))
  else
    printf '  \033[31mFAIL\033[0m  %s\n' "$1"; fail=$((fail + 1))
  fi
}

psql_q() { docker exec -i "$PG_CONTAINER" psql -U "$PG_USER" -d "$PG_DB" -tAX -c "$1"; }

echo "=== idempotency behavioral test ==="
echo "api=$API_URL  db=$PG_CONTAINER  n=$N"

if [ "$RESET" = "1" ]; then
  psql_q 'TRUNCATE "LedgerPosting", "LedgerTransaction", "IdempotencyKey";' >/dev/null 2>&1
  echo "reset ledger + idempotency tables"
fi

USER_ID="$(curl -fsS "$API_URL/api/session/identities" | python3 -c 'import sys,json;print(json.load(sys.stdin)[0]["id"])')"
[ -n "$USER_ID" ] || { echo "could not resolve a demo identity"; exit 1; }
echo "acting as user=$USER_ID"

SRC="conc-1"
BODY='{"kind":"CHARGE","sourceType":"IdemTest","sourceId":"'"$SRC"'","postings":[{"accountId":"platform","direction":"DEBIT","amountCents":250},{"accountId":"user:'"$USER_ID"'","direction":"CREDIT","amountCents":250}]}'

# ── 1. N concurrent identical calls from separate processes ──────────────
echo "firing $N concurrent identical POSTs..."
TMP="$(mktemp -d)"; trap 'rm -rf "$TMP"' EXIT
START=$(date +%s.%N)
for i in $(seq 1 "$N"); do
  (
    code=$(curl -s -o "$TMP/$i.body" -w '%{http_code}' -X POST \
      "$API_URL/api/ledger/transactions" \
      -H 'content-type: application/json' -H "x-user-id: $USER_ID" -d "$BODY")
    printf '%s' "$code" > "$TMP/$i.code"
  ) &
done
wait
END=$(date +%s.%N)
echo "batch wall time: $(python3 -c "print(f'{$END-$START:.2f}')")s"

ok=0; for i in $(seq 1 "$N"); do case "$(cat "$TMP/$i.code" 2>/dev/null)" in 2*) ok=$((ok+1));; esac; done
check "all $N concurrent POSTs returned 2xx (got $ok)" "$([ "$ok" = "$N" ] && echo 1 || echo 0)"

# ── 2. exactly one ledger transaction ────────────────────────────────────
TXCOUNT="$(psql_q "SELECT count(*) FROM \"LedgerTransaction\" WHERE \"sourceType\"='IdemTest' AND \"sourceId\"='$SRC';")"
check "exactly ONE ledger transaction for the key (got $TXCOUNT)" "$([ "$TXCOUNT" = "1" ] && echo 1 || echo 0)"

# ── 3. all responses identical (canonical JSON), same ledger id ──────────
DISTINCT="$(python3 - "$TMP" "$N" <<'PY'
import json, sys, os
tmp, n = sys.argv[1], int(sys.argv[2])
seen = set()
for i in range(1, n + 1):
    with open(os.path.join(tmp, f"{i}.body")) as f:
        seen.add(json.dumps(json.load(f), sort_keys=True))
print(len(seen))
PY
)"
check "all $N responses identical (distinct canonical bodies = $DISTINCT)" "$([ "$DISTINCT" = "1" ] && echo 1 || echo 0)"

LEDGER_ID="$(psql_q "SELECT id FROM \"LedgerTransaction\" WHERE \"sourceType\"='IdemTest' AND \"sourceId\"='$SRC';")"
RESP_ID="$(python3 - "$TMP/1.body" <<'PY'
import json,sys
print(json.load(open(sys.argv[1]))["id"])
PY
)"
check "replayed response carries the committed ledger id" "$([ "$RESP_ID" = "$LEDGER_ID" ] && echo 1 || echo 0)"

# ── 4. idempotency row is COMPLETED with a cleared recovery point ────────
ROW="$(psql_q "SELECT status||'|'||COALESCE(\"recoveryPoint\",'~null~')||'|'||COALESCE(\"responseStatus\"::text,'~') FROM \"IdempotencyKey\" WHERE key='ledger:IdemTest:$SRC:CHARGE';")"
check "idempotency row COMPLETED, recoveryPoint cleared, 201 (got $ROW)" \
  "$([ "$ROW" = "COMPLETED|~null~|201" ] && echo 1 || echo 0)"

# ── 5. same key + different body → 409 ───────────────────────────────────
BODY2='{"kind":"CHARGE","sourceType":"IdemTest","sourceId":"'"$SRC"'","postings":[{"accountId":"platform","direction":"DEBIT","amountCents":999},{"accountId":"user:'"$USER_ID"'","direction":"CREDIT","amountCents":999}]}'
CODE2="$(curl -s -o /dev/null -w '%{http_code}' -X POST "$API_URL/api/ledger/transactions" -H 'content-type: application/json' -H "x-user-id: $USER_ID" -d "$BODY2")"
check "same key + different body rejected with 409 (got $CODE2)" "$([ "$CODE2" = "409" ] && echo 1 || echo 0)"
TXCOUNT2="$(psql_q "SELECT count(*) FROM \"LedgerTransaction\" WHERE \"sourceType\"='IdemTest' AND \"sourceId\"='$SRC';")"
check "conflicting request created no ledger transaction (count=$TXCOUNT2)" "$([ "$TXCOUNT2" = "1" ] && echo 1 || echo 0)"

# ── 6. crash recovery ────────────────────────────────────────────────────
PROBE="$(curl -s -o /dev/null -w '%{http_code}' -X POST "$API_URL/api/ledger/transactions" -H 'content-type: application/json' -H "x-user-id: $USER_ID" \
  -d '{"kind":"CHARGE","sourceType":"IdemTest","sourceId":"crash:probe","postings":[{"accountId":"platform","direction":"DEBIT","amountCents":1},{"accountId":"user:'"$USER_ID"'","direction":"CREDIT","amountCents":1}]}')"
CRASH_MODE=0; case "$PROBE" in 5*) CRASH_MODE=1;; esac

if [ "$CRASH_MODE" = "1" ]; then
  echo "crash hook detected (probe=$PROBE); exercising recovery"
  CBODY='{"kind":"CHARGE","sourceType":"IdemTest","sourceId":"crash:recover-1","postings":[{"accountId":"platform","direction":"DEBIT","amountCents":777},{"accountId":"user:'"$USER_ID"'","direction":"CREDIT","amountCents":777}]}'
  C1="$(curl -s -o /dev/null -w '%{http_code}' -X POST "$API_URL/api/ledger/transactions" -H 'content-type: application/json' -H "x-user-id: $USER_ID" -d "$CBODY")"
  check "crashing attempt fails (got $C1)" "$(case "$C1" in 5*) echo 1;; *) echo 0;; esac)"
  FAILROW="$(psql_q "SELECT status||'|'||COALESCE(\"recoveryPoint\",'~') FROM \"IdempotencyKey\" WHERE key='ledger:IdemTest:crash:recover-1:CHARGE';")"
  check "left FAILED with recovery point intact (got $FAILROW)" "$([ "$FAILROW" = "FAILED|ledger.before-post" ] && echo 1 || echo 0)"
  NOTX="$(psql_q "SELECT count(*) FROM \"LedgerTransaction\" WHERE \"sourceId\"='crash:recover-1';")"
  check "no ledger transaction before recovery (got $NOTX)" "$([ "$NOTX" = "0" ] && echo 1 || echo 0)"

  C2="$(curl -s -o /dev/null -w '%{http_code}' -X POST "$API_URL/api/ledger/transactions" -H 'content-type: application/json' -H "x-user-id: $USER_ID" -d "$CBODY")"
  check "retry resumes and completes (got $C2)" "$([ "$C2" = "201" ] && echo 1 || echo 0)"
  RTX="$(psql_q "SELECT count(*) FROM \"LedgerTransaction\" WHERE \"sourceId\"='crash:recover-1';")"
  check "recovery left exactly ONE ledger transaction (got $RTX)" "$([ "$RTX" = "1" ] && echo 1 || echo 0)"
  OKROW="$(psql_q "SELECT status FROM \"IdempotencyKey\" WHERE key='ledger:IdemTest:crash:recover-1:CHARGE';")"
  check "recovery row now COMPLETED (got $OKROW)" "$([ "$OKROW" = "COMPLETED" ] && echo 1 || echo 0)"
else
  echo "  \033[33mSKIP\033[0m  crash-recovery checks (start API with IDEMPOTENCY_CRASH_TEST=1)"
fi

# ── 7. invariants still hold ─────────────────────────────────────────────
IMBAL="$(psql_q 'SELECT COALESCE(SUM(CASE WHEN direction='"'"'DEBIT'"'"' THEN "amountCents" ELSE -"amountCents" END),0) FROM "LedgerPosting";')"
check "global SUM(debit)-SUM(credit) = 0 (got $IMBAL)" "$([ "$IMBAL" = "0" ] && echo 1 || echo 0)"
VERIFY="$(curl -fsS "$API_URL/api/ledger/verify" -H "x-user-id: $USER_ID")"
check "hash chain verifies ($VERIFY)" "$(printf '%s' "$VERIFY" | grep -q '"ok":true' && echo 1 || echo 0)"
REPLAYS="$(curl -fsS "$API_URL/api/metrics" | awk '/^tangerine_idempotent_replays_total/{print $2}' | head -1)"
check "replay counter advanced (tangerine_idempotent_replays_total=$REPLAYS)" "$([ -n "$REPLAYS" ] && [ "$REPLAYS" -ge 1 ] && echo 1 || echo 0)"

echo
echo "=== result: $pass passed, $fail failed ==="
[ "$fail" = "0" ]
