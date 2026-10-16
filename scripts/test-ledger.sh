#!/usr/bin/env bash
#
# Behavioral test: double-entry ledger.
#
# Proves, against a live API + live Postgres (no mocks, no unit tests):
#   1. 100 concurrent balanced transactions all commit.
#   2. global SUM(debit) - SUM(credit) = 0 across every posting (psql).
#   3. the deferred balance constraint trigger did NOT fire during the batch.
#   4. an unbalanced transaction inserted directly in SQL is rejected at COMMIT.
#   5. an UPDATE (and DELETE) on an append-only ledger table is rejected.
#   6. the hash chain verifies end to end.
#   7. the Prometheus imbalance gauge reads 0.
#
# Usage:  scripts/test-ledger.sh
# Env:    API_URL (default http://localhost:3001)
#         PG_CONTAINER (default tangerine-postgres), PG_USER, PG_DB
#         N (concurrent writes, default 100)
#         LEDGER_TEST_RESET=0 to skip the TRUNCATE reset.
#
set -uo pipefail

API_URL="${API_URL:-http://localhost:3001}"
PG_CONTAINER="${PG_CONTAINER:-tangerine-postgres}"
PG_USER="${PG_USER:-tangerine}"
PG_DB="${PG_DB:-tangerine}"
N="${N:-100}"
RESET="${LEDGER_TEST_RESET:-1}"

pass=0
fail=0
check() { # check <description> <0|1>
  if [ "$2" = "1" ]; then
    printf '  \033[32mPASS\033[0m  %s\n' "$1"; pass=$((pass + 1))
  else
    printf '  \033[31mFAIL\033[0m  %s\n' "$1"; fail=$((fail + 1))
  fi
}

psql_q() { docker exec -i "$PG_CONTAINER" psql -U "$PG_USER" -d "$PG_DB" -tAX -c "$1"; }
psql_file() { docker exec -i "$PG_CONTAINER" psql -U "$PG_USER" -d "$PG_DB" -tAX "$@"; }
pg_unbalanced_errors() {
  docker logs "$PG_CONTAINER" 2>&1 | grep -c 'is unbalanced' || true
}

echo "=== ledger behavioral test ==="
echo "api=$API_URL  db=$PG_CONTAINER  n=$N"

# ── 0. reset (test-only) ─────────────────────────────────────────────────
if [ "$RESET" = "1" ]; then
  # Reset the idempotency rows too: the ledger endpoint is exactly-once on
  # (sourceType, sourceId, kind), so leaving them behind would replay the
  # previous run's cached responses and insert nothing.
  psql_q 'TRUNCATE "LedgerPosting", "LedgerTransaction", "IdempotencyKey";' >/dev/null 2>&1
  echo "reset ledger tables"
fi

# ── identity + baseline ──────────────────────────────────────────────────
USER_ID="$(curl -fsS "$API_URL/api/session/identities" | python3 -c 'import sys,json;print(json.load(sys.stdin)[0]["id"])')"
if [ -z "$USER_ID" ]; then echo "could not resolve a demo identity"; exit 1; fi
echo "acting as user=$USER_ID"

BASE_UNBALANCED="$(pg_unbalanced_errors)"
echo "postgres 'is unbalanced' errors before batch: $BASE_UNBALANCED"

# ── 1. N concurrent balanced writes ──────────────────────────────────────
echo "firing $N concurrent transactions..."
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

START=$(date +%s.%N)
for i in $(seq 1 "$N"); do
  (
    payload=$(cat <<JSON
{"kind":"CHARGE","sourceType":"LedgerTest","sourceId":"lt-${i}","description":"concurrent batch ${i}",
 "postings":[
   {"accountId":"platform","direction":"DEBIT","amountCents":$((i * 7))},
   {"accountId":"user:${USER_ID}","direction":"CREDIT","amountCents":$((i * 7))}
 ]}
JSON
)
    code=$(curl -s -o /dev/null -w '%{http_code}' -X POST "$API_URL/api/ledger/transactions" \
      -H 'content-type: application/json' -H "x-user-id: $USER_ID" -d "$payload")
    printf '%s' "$code" > "$TMP/$i"
  ) &
done
wait
END=$(date +%s.%N)
DUR=$(python3 -c "print(f'{$END-$START:.2f}')")
echo "batch wall time: ${DUR}s"

# API returns 201 for POST by default; accept any 2xx.
ok_codes=0
for i in $(seq 1 "$N"); do
  c="$(cat "$TMP/$i" 2>/dev/null)"
  case "$c" in 2*) ok_codes=$((ok_codes + 1));; esac
done
check "all $N concurrent POSTs returned 2xx (got $ok_codes)" "$([ "$ok_codes" = "$N" ] && echo 1 || echo 0)"

# ── 2. row count + global balance via psql ───────────────────────────────
ROWS="$(psql_q "SELECT count(*) FROM \"LedgerTransaction\" WHERE \"sourceType\"='LedgerTest';")"
check "exactly $N LedgerTransaction rows for the batch (got $ROWS)" "$([ "$ROWS" = "$N" ] && echo 1 || echo 0)"

IMBALANCE="$(psql_q 'SELECT COALESCE(SUM(CASE WHEN direction='"'"'DEBIT'"'"' THEN "amountCents" ELSE -"amountCents" END),0) FROM "LedgerPosting";')"
check "global SUM(debit)-SUM(credit) = 0 (got $IMBALANCE)" "$([ "$IMBALANCE" = "0" ] && echo 1 || echo 0)"

# ── 3. deferred trigger never fired during the batch ─────────────────────
AFTER_UNBALANCED="$(pg_unbalanced_errors)"
check "no balance-trigger exception during batch (before=$BASE_UNBALANCED after=$AFTER_UNBALANCED)" \
  "$([ "$AFTER_UNBALANCED" = "$BASE_UNBALANCED" ] && echo 1 || echo 0)"

# ── 4. unbalanced transaction is rejected at COMMIT (database arbiter) ───
NEG_OUT="$(psql_file -v ON_ERROR_STOP=1 <<'SQL' 2>&1
BEGIN;
INSERT INTO "LedgerTransaction"(id,seq,kind,"sourceType","sourceId","createdAt","previousHash",hash)
  VALUES ('test-neg', 9000001, 'CHARGE', 'LedgerTest', 'neg-unbalanced', now(), NULL, 'x');
INSERT INTO "LedgerPosting"(id,"transactionId","accountId",direction,"amountCents",currency,"createdAt")
  VALUES ('test-neg-p', 'test-neg', 'platform', 'DEBIT', 12345, 'USD', now());
COMMIT;
SQL
)"
NEG_RC=$?
check "unbalanced transaction rejected at COMMIT (rc=$NEG_RC)" "$([ "$NEG_RC" != "0" ] && echo 1 || echo 0)"
check "rejection came from the deferred trigger" "$(printf '%s' "$NEG_OUT" | grep -q 'unbalanced by' && echo 1 || echo 0)"
LEAKED="$(psql_q "SELECT count(*) FROM \"LedgerTransaction\" WHERE id='test-neg';")"
check "rejected transaction left no rows (got $LEAKED)" "$([ "$LEAKED" = "0" ] && echo 1 || echo 0)"

# ── 5. append-only: UPDATE and DELETE are rejected ───────────────────────
TARGET="$(psql_q "SELECT id FROM \"LedgerPosting\" LIMIT 1;")"
UPD_OUT="$(psql_file -v ON_ERROR_STOP=1 -c "UPDATE \"LedgerPosting\" SET \"amountCents\"=1 WHERE id='$TARGET';" 2>&1)"
UPD_RC=$?
check "UPDATE on LedgerPosting rejected (rc=$UPD_RC)" "$([ "$UPD_RC" != "0" ] && echo 1 || echo 0)"
check "rejection mentions append-only" "$(printf '%s' "$UPD_OUT" | grep -q 'append-only' && echo 1 || echo 0)"

DEL_OUT="$(psql_file -v ON_ERROR_STOP=1 -c "DELETE FROM \"LedgerPosting\" WHERE id='$TARGET';" 2>&1)"
DEL_RC=$?
check "DELETE on LedgerPosting rejected (rc=$DEL_RC)" "$([ "$DEL_RC" != "0" ] && echo 1 || echo 0)"

# ── 6. hash chain verifies ───────────────────────────────────────────────
VERIFY="$(curl -fsS "$API_URL/api/ledger/verify" -H "x-user-id: $USER_ID")"
echo "  verify: $VERIFY"
check "GET /api/ledger/verify ok=true" "$(printf '%s' "$VERIFY" | grep -q '"ok":true' && echo 1 || echo 0)"
check "verify checked >= $N" "$(printf '%s' "$VERIFY" | python3 -c "import sys,json;print(1 if json.load(sys.stdin)['checked']>=$N else 0)" 2>/dev/null || echo 0)"

# ── 7. Prometheus imbalance gauge ────────────────────────────────────────
GAUGE="$(curl -fsS "$API_URL/api/metrics" | awk '/^tangerine_ledger_balance_imbalance_cents/{print $2}')"
check "metrics tangerine_ledger_balance_imbalance_cents = 0 (got ${GAUGE:-none})" "$([ "$GAUGE" = "0" ] && echo 1 || echo 0)"

echo
echo "=== result: $pass passed, $fail failed ==="
[ "$fail" = "0" ]
