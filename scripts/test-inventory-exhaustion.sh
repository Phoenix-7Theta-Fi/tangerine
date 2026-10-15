#!/usr/bin/env bash
#
# Behavioral test: inventory exhaustion.
#
# Drain a product to zero, then keep hammering it concurrently. No request may
# ever push reserved past quantity: the invariant reserved <= quantity must hold
# and the extra requests must all be rejected.
#
# Usage:  scripts/test-inventory-exhaustion.sh
#
set -uo pipefail

API_URL="${API_URL:-http://localhost:3001}"
PG_CONTAINER="${PG_CONTAINER:-tangerine-postgres}"
PG_USER="${PG_USER:-tangerine}"
PG_DB="${PG_DB:-tangerine}"
STOCK="${STOCK:-10}"
EXTRA="${EXTRA:-25}"
RESET="${LEDGER_TEST_RESET:-1}"

pass=0; fail=0
check() {
  if [ "$2" = "1" ]; then printf '  \033[32mPASS\033[0m  %s\n' "$1"; pass=$((pass + 1));
  else printf '  \033[31mFAIL\033[0m  %s\n' "$1"; fail=$((fail + 1)); fi
}
psql_q() { docker exec -i "$PG_CONTAINER" psql -U "$PG_USER" -d "$PG_DB" -tAX -c "$1"; }
jqget() { python3 -c "import sys,json;print(json.load(sys.stdin).get('$1',''))"; }

echo "=== inventory exhaustion test ==="

if [ "$RESET" = "1" ]; then
  psql_q 'TRUNCATE "OrderStateTransition","OrderItem","Order","CartItem","Cart","InventoryItem","Product";' >/dev/null 2>&1
  echo "reset marketplace tables"
fi

USER_ID="$(curl -fsS "$API_URL/api/session/identities" | python3 -c 'import sys,json;print(json.load(sys.stdin)[0]["id"])')"
[ -n "$USER_ID" ] || { echo "could not resolve identity"; exit 1; }

PID="$(curl -fsS -X POST "$API_URL/api/marketplace/products" -H 'content-type: application/json' -H "x-user-id: $USER_ID" \
  -d '{"name":"Exhaust Widget","priceCents":100,"quantity":'"$STOCK"'}' | jqget id)"
echo "product=$PID stock=$STOCK"

reserve() { curl -s -o /dev/null -w '%{http_code}' -X POST "$API_URL/api/marketplace/inventory/$PID/reserve" \
  -H 'content-type: application/json' -H "x-user-id: $USER_ID" -d '{"quantity":1}'; }

# Drain to zero.
for _ in $(seq 1 "$STOCK"); do reserve >/dev/null; done
check "drained to exactly $STOCK reserved (got $(psql_q "SELECT reserved FROM \"InventoryItem\" WHERE \"productId\"='$PID';"))" \
  "$([ "$(psql_q "SELECT reserved FROM \"InventoryItem\" WHERE \"productId\"='$PID';")" = "$STOCK" ] && echo 1 || echo 0)"

# Hammer past exhaustion, concurrently.
TMP="$(mktemp -d)"; trap 'rm -rf "$TMP"' EXIT
for i in $(seq 1 "$EXTRA"); do ( reserve > "$TMP/$i" ) & done
wait
WINS=0; for i in $(seq 1 "$EXTRA"); do grep -q '"reserved":true' "$TMP/$i" && WINS=$((WINS+1)); done
check "no reservation won past exhaustion (got $WINS)" "$([ "$WINS" = "0" ] && echo 1 || echo 0)"

ROW="$(psql_q "SELECT quantity||'|'||reserved FROM \"InventoryItem\" WHERE \"productId\"='$PID';")"
check "invariant reserved=$STOCK <= quantity=$STOCK (got $ROW)" "$([ "$ROW" = "$STOCK|$STOCK" ] && echo 1 || echo 0)"

echo
echo "=== result: $pass passed, $fail failed ==="
[ "$fail" = "0" ]
