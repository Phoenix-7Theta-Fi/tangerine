#!/usr/bin/env bash
#
# Behavioral test: cart optimistic concurrency.
#
# Two concurrent edits that both present the SAME cart version must not both
# win: exactly one is accepted and the other is rejected with 409. Proves the
# `UPDATE ... WHERE version = expected` guard.
#
# Usage:  scripts/test-cart-concurrency.sh
#
set -uo pipefail

API_URL="${API_URL:-http://localhost:3001}"
PG_CONTAINER="${PG_CONTAINER:-tangerine-postgres}"
PG_USER="${PG_USER:-tangerine}"
PG_DB="${PG_DB:-tangerine}"
RESET="${LEDGER_TEST_RESET:-1}"

pass=0; fail=0
check() {
  if [ "$2" = "1" ]; then printf '  \033[32mPASS\033[0m  %s\n' "$1"; pass=$((pass + 1));
  else printf '  \033[31mFAIL\033[0m  %s\n' "$1"; fail=$((fail + 1)); fi
}
psql_q() { docker exec -i "$PG_CONTAINER" psql -U "$PG_USER" -d "$PG_DB" -tAX -c "$1"; }
jqget() { python3 -c "import sys,json;print(json.load(sys.stdin).get('$1',''))"; }

echo "=== cart concurrency test ==="

if [ "$RESET" = "1" ]; then
  psql_q 'TRUNCATE "OrderStateTransition","OrderItem","Order","CartItem","Cart","InventoryItem","Product";' >/dev/null 2>&1
  echo "reset marketplace tables"
fi

USER_ID="$(curl -fsS "$API_URL/api/session/identities" | python3 -c 'import sys,json;print(json.load(sys.stdin)[0]["id"])')"
[ -n "$USER_ID" ] || { echo "could not resolve identity"; exit 1; }

PID="$(curl -fsS -X POST "$API_URL/api/marketplace/products" \
  -H 'content-type: application/json' -H "x-user-id: $USER_ID" \
  -d '{"name":"Cart Widget","priceCents":250,"quantity":100}' | jqget id)"
echo "product=$PID"

CART="$(curl -fsS "$API_URL/api/marketplace/cart" -H "x-user-id: $USER_ID")"
CID="$(printf '%s' "$CART" | jqget id)"
VER="$(printf '%s' "$CART" | python3 -c 'import sys,json;print(json.load(sys.stdin)["version"])')"
echo "cart=$CID version=$VER"

TMP="$(mktemp -d)"; trap 'rm -rf "$TMP"' EXIT
BODY='{"productId":"'"$PID"'","quantity":1,"expectedVersion":'"$VER"'}'
for i in 1 2; do
  ( curl -s -o /dev/null -w '%{http_code}' -X POST "$API_URL/api/marketplace/cart/items" \
      -H 'content-type: application/json' -H "x-user-id: $USER_ID" -d "$BODY" > "$TMP/$i" ) &
done
wait
C1="$(cat "$TMP/1")"; C2="$(cat "$TMP/2")"
echo "codes: $C1 $C2"

OK=0; CONFLICT=0
for c in "$C1" "$C2"; do
  [ "$c" = "201" ] && OK=$((OK+1))
  [ "$c" = "409" ] && CONFLICT=$((CONFLICT+1))
done
check "exactly one edit accepted (got $OK x 201)" "$([ "$OK" = "1" ] && echo 1 || echo 0)"
check "exactly one edit rejected 409 (got $CONFLICT x 409)" "$([ "$CONFLICT" = "1" ] && echo 1 || echo 0)"

NEWVER="$(psql_q "SELECT version FROM \"Cart\" WHERE id='$CID';")"
check "cart version advanced by exactly 1 (got $NEWVER, was $VER)" "$([ "$NEWVER" = "$((VER+1))" ] && echo 1 || echo 0)"

ITEMS="$(psql_q "SELECT COALESCE(SUM(quantity),0) FROM \"CartItem\" WHERE \"cartId\"='$CID';")"
check "cart contains exactly one accepted line (got $ITEMS)" "$([ "$ITEMS" = "1" ] && echo 1 || echo 0)"

CONF="$(curl -fsS "$API_URL/api/metrics" | awk '/^tangerine_cart_conflicts_total/{print $2}')"
check "cart_conflicts metric advanced (got ${CONF:-0})" "$([ -n "$CONF" ] && [ "$CONF" -ge 1 ] && echo 1 || echo 0)"

echo
echo "=== result: $pass passed, $fail failed ==="
[ "$fail" = "0" ]
