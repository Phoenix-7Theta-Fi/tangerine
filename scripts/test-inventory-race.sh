#!/usr/bin/env bash
#
# Behavioral test: inventory race.
#
# N concurrent reservations of 1 unit each against 10 units of stock must yield
# EXACTLY 10 successes — never more. Proves the single conditional UPDATE and
# the `reserved <= quantity` invariant hold under contention.
#
# Usage:  scripts/test-inventory-race.sh
# Env:    API_URL, PG_*, N (concurrent requests, default 100), STOCK (default 10)
#
set -uo pipefail

API_URL="${API_URL:-http://localhost:3001}"
PG_CONTAINER="${PG_CONTAINER:-tangerine-postgres}"
PG_USER="${PG_USER:-tangerine}"
PG_DB="${PG_DB:-tangerine}"
N="${N:-100}"
STOCK="${STOCK:-10}"
RESET="${LEDGER_TEST_RESET:-1}"

pass=0; fail=0
check() {
  if [ "$2" = "1" ]; then printf '  \033[32mPASS\033[0m  %s\n' "$1"; pass=$((pass + 1));
  else printf '  \033[31mFAIL\033[0m  %s\n' "$1"; fail=$((fail + 1)); fi
}
psql_q() { docker exec -i "$PG_CONTAINER" psql -U "$PG_USER" -d "$PG_DB" -tAX -c "$1"; }
jqget() { python3 -c "import sys,json;print(json.load(sys.stdin).get('$1',''))"; }

echo "=== inventory race test ==="
echo "api=$API_URL  stock=$STOCK  contenders=$N"

if [ "$RESET" = "1" ]; then
  psql_q 'TRUNCATE "OrderStateTransition","OrderItem","Order","CartItem","Cart","InventoryItem","Product";' >/dev/null 2>&1
  echo "reset marketplace tables"
fi

USER_ID="$(curl -fsS "$API_URL/api/session/identities" | python3 -c 'import sys,json;print(json.load(sys.stdin)[0]["id"])')"
[ -n "$USER_ID" ] || { echo "could not resolve identity"; exit 1; }

PROD="$(curl -fsS -X POST "$API_URL/api/marketplace/products" \
  -H 'content-type: application/json' -H "x-user-id: $USER_ID" \
  -d '{"name":"Race Widget","priceCents":100,"quantity":'"$STOCK"'}')"
PID="$(printf '%s' "$PROD" | jqget id)"
[ -n "$PID" ] || { echo "failed to create product: $PROD"; exit 1; }
echo "product=$PID  stock=$STOCK"

TMP="$(mktemp -d)"; trap 'rm -rf "$TMP"' EXIT
metric() { curl -fsS "$API_URL/api/metrics" | awk -v m="$1" '$1==m{print $2}'; }
BASE_RES="$(metric 'tangerine_inventory_reservations_total{outcome="reserved"}')"; BASE_RES="${BASE_RES:-0}"
BASE_REJ="$(metric 'tangerine_inventory_reservations_total{outcome="rejected"}')"; BASE_REJ="${BASE_REJ:-0}"
START=$(date +%s.%N)
for i in $(seq 1 "$N"); do
  ( curl -s -o "$TMP/$i" -w '%{http_code}' -X POST \
      "$API_URL/api/marketplace/inventory/$PID/reserve" \
      -H 'content-type: application/json' -H "x-user-id: $USER_ID" \
      -d '{"quantity":1}' > "$TMP/$i.code" ) &
done
wait
END=$(date +%s.%N)
echo "wall time: $(python3 -c "print(f'{$END-$START:.2f}')")s"

SUCC=0
for i in $(seq 1 "$N"); do grep -q '"reserved":true' "$TMP/$i" && SUCC=$((SUCC+1)); done
check "exactly $STOCK reservations succeeded (got $SUCC)" "$([ "$SUCC" = "$STOCK" ] && echo 1 || echo 0)"

ROW="$(psql_q "SELECT quantity||'|'||reserved FROM \"InventoryItem\" WHERE \"productId\"='$PID';")"
check "reserved == $STOCK and quantity == $STOCK (got $ROW)" \
  "$([ "$ROW" = "$STOCK|$STOCK" ] && echo 1 || echo 0)"
LEQ="$(psql_q "SELECT CASE WHEN reserved <= quantity THEN 1 ELSE 0 END FROM \"InventoryItem\" WHERE \"productId\"='$PID';")"
check "invariant reserved <= quantity (got $LEQ)" "$([ "$LEQ" = "1" ] && echo 1 || echo 0)"

RES="$(metric 'tangerine_inventory_reservations_total{outcome="reserved"}')"; RES="${RES:-0}"
REJ="$(metric 'tangerine_inventory_reservations_total{outcome="rejected"}')"; REJ="${REJ:-0}"
check "metric deltas reserved=$STOCK, rejected=$((N-STOCK)) (got $((RES-BASE_RES))/$((REJ-BASE_REJ)))" \
  "$([ "$((RES-BASE_RES))" = "$STOCK" ] && [ "$((REJ-BASE_REJ))" = "$((N-STOCK))" ] && echo 1 || echo 0)"

echo
echo "=== result: $pass passed, $fail failed ==="
[ "$fail" = "0" ]
