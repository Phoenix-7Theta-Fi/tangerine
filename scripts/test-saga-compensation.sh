#!/usr/bin/env bash
#
# Behavioral test: checkout saga compensation.
#
# Requires the API to run with SAGA_FAILURE_INJECTION=1.
#
# Part A — forced failure at the ledger step:
#   * saga ends FAILED
#   * completedSteps = [reserve-inventory, charge-payment]
#   * compensations run LIFO for BOTH completed steps
#   * inventory released (reserved back to 0)
#   * payment refunded (status REFUNDED)
#   * order cancelled (PENDING → CANCELLED)
#   * compensation metrics recorded
# Part B — a clean checkout completes:
#   * saga COMPLETED, order PAID, inventory held, payment SUCCEEDED, ledger charged
#
# Usage:  scripts/test-saga-compensation.sh
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
json_in() { python3 -c "import sys,json;d=json.load(sys.stdin);print('yes' if '$1' in d.get('$2',[]) else 'no')"; }

echo "=== saga compensation test ==="

if [ "$RESET" = "1" ]; then
  psql_q 'TRUNCATE "SagaState","OrderStateTransition","OrderItem","Order","CartItem","Cart","InventoryItem","Product","PaymentStateTransition","Payment","WebhookEvent","OutboxEvent","LedgerPosting","LedgerTransaction","IdempotencyKey";' >/dev/null 2>&1
  echo "reset all test tables"
fi

USER_ID="$(curl -fsS "$API_URL/api/session/identities" | python3 -c 'import sys,json;print(json.load(sys.stdin)[0]["id"])')"
[ -n "$USER_ID" ] || { echo "could not resolve identity"; exit 1; }
metric() { curl -fsS "$API_URL/api/metrics" | awk -v m="$1" '$1==m{print $2}'; }
MC1_METRIC='tangerine_saga_compensations_total{saga_type="checkout",step="reserve-inventory"}'
MC2_METRIC='tangerine_saga_compensations_total{saga_type="checkout",step="charge-payment"}'
BASE_MC1="$(metric "$MC1_METRIC")"; BASE_MC1="${BASE_MC1:-0}"
BASE_MC2="$(metric "$MC2_METRIC")"; BASE_MC2="${BASE_MC2:-0}"

PID="$(curl -fsS -X POST "$API_URL/api/marketplace/products" -H 'content-type: application/json' -H "x-user-id: $USER_ID" \
  -d '{"name":"Saga Widget","priceCents":400,"quantity":5}' | jqget id)"
echo "product=$PID"

add_item() { # expectedVersion
  curl -fsS -X POST "$API_URL/api/marketplace/cart/items" -H 'content-type: application/json' -H "x-user-id: $USER_ID" \
    -d '{"productId":"'"$PID"'","quantity":2,"expectedVersion":'"$1"'}' >/dev/null
}
cart_version() { curl -fsS "$API_URL/api/marketplace/cart" -H "x-user-id: $USER_ID" | python3 -c 'import sys,json;print(json.load(sys.stdin)["version"])'; }

# ── Part A: forced failure at write-ledger ───────────────────────────────
V="$(cart_version)"
add_item "$V"
CID="$(curl -fsS "$API_URL/api/marketplace/cart" -H "x-user-id: $USER_ID" | jqget id)"
OID="$(curl -fsS -X POST "$API_URL/api/marketplace/orders" -H 'content-type: application/json' -H "x-user-id: $USER_ID" \
  -d '{"cartId":"'"$CID"'"}' | jqget id)"
echo "order A=$OID"
BEFORE="$(psql_q "SELECT reserved FROM \"InventoryItem\" WHERE \"productId\"='$PID';")"
echo "reserved before checkout: $BEFORE"

RUNDIR="$(mktemp -d)"; RUN="$RUNDIR/run.json"
curl -fsS -X POST "$API_URL/api/sagas/checkout" -H 'content-type: application/json' -H "x-user-id: $USER_ID" \
  -d '{"orderId":"'"$OID"'","forceFailStep":"write-ledger"}' > "$RUN" || true
echo "saga response: $(cat "$RUN")"

check "saga status FAILED (got $(jqget status < "$RUN"))" "$([ "$(jqget status < "$RUN")" = "FAILED" ] && echo 1 || echo 0)"
check "completedSteps = reserve-inventory + charge-payment (got $(jqget completedSteps < "$RUN"))" \
  "$([ "$(json_in reserve-inventory completedSteps < "$RUN")" = "yes" ] && [ "$(json_in charge-payment completedSteps < "$RUN")" = "yes" ] && echo 1 || echo 0)"
check "compensations ran for BOTH completed steps (got $(jqget compensationsRun < "$RUN"))" \
  "$([ "$(json_in reserve-inventory compensationsRun < "$RUN")" = "yes" ] && [ "$(json_in charge-payment compensationsRun < "$RUN")" = "yes" ] && echo 1 || echo 0)"

RES="$(psql_q "SELECT reserved FROM \"InventoryItem\" WHERE \"productId\"='$PID';")"
check "inventory released (reserved back to 0, got $RES)" "$([ "$RES" = "0" ] && echo 1 || echo 0)"

PAY="$(psql_q "SELECT status FROM \"Payment\" WHERE \"externalId\"='pi_saga_$OID';")"
check "payment refunded (got $PAY)" "$([ "$PAY" = "REFUNDED" ] && echo 1 || echo 0)"

ORD="$(psql_q "SELECT status FROM \"Order\" WHERE id='$OID';")"
check "order cancelled (got $ORD)" "$([ "$ORD" = "CANCELLED" ] && echo 1 || echo 0)"

MC="$(metric "$MC1_METRIC")"; MC="${MC:-0}"
MC2="$(metric "$MC2_METRIC")"; MC2="${MC2:-0}"
check "compensation metrics for steps 1 and 2 (deltas $((MC-BASE_MC1))/$((MC2-BASE_MC2)))" \
  "$([ "$((MC-BASE_MC1))" = "1" ] && [ "$((MC2-BASE_MC2))" = "1" ] && echo 1 || echo 0)"

# ── Part B: clean checkout completes ─────────────────────────────────────
V="$(cart_version)"
add_item "$V"
OID2="$(curl -fsS -X POST "$API_URL/api/marketplace/orders" -H 'content-type: application/json' -H "x-user-id: $USER_ID" \
  -d '{"cartId":"'"$CID"'"}' | jqget id)"
echo "order B=$OID2"
RUN2="$RUNDIR/run2.json"
curl -fsS -X POST "$API_URL/api/sagas/checkout" -H 'content-type: application/json' -H "x-user-id: $USER_ID" \
  -d '{"orderId":"'"$OID2"'"}' > "$RUN2" || true

check "clean saga COMPLETED (got $(jqget status < "$RUN2"))" "$([ "$(jqget status < "$RUN2")" = "COMPLETED" ] && echo 1 || echo 0)"
check "order B PAID (got $(psql_q "SELECT status FROM \"Order\" WHERE id='$OID2';"))" "$([ "$(psql_q "SELECT status FROM \"Order\" WHERE id='$OID2';")" = "PAID" ] && echo 1 || echo 0)"
check "inventory held = 2 (got $(psql_q "SELECT reserved FROM \"InventoryItem\" WHERE \"productId\"='$PID';"))" \
  "$([ "$(psql_q "SELECT reserved FROM \"InventoryItem\" WHERE \"productId\"='$PID';")" = "2" ] && echo 1 || echo 0)"
check "ledger charged for order B (got $(psql_q "SELECT count(*) FROM \"LedgerTransaction\" WHERE \"sourceType\"='Order' AND \"sourceId\"='$OID2' AND kind='CHARGE';"))" \
  "$([ "$(psql_q "SELECT count(*) FROM \"LedgerTransaction\" WHERE \"sourceType\"='Order' AND \"sourceId\"='$OID2' AND kind='CHARGE';")" = "1" ] && echo 1 || echo 0)"
NOTIF="$(psql_q "SELECT count(*) FROM \"OutboxEvent\" WHERE type='order.paid';")"
check "notification emitted (got $NOTIF)" "$([ "$NOTIF" -ge 1 ] && echo 1 || echo 0)"

IMBAL="$(psql_q 'SELECT COALESCE(SUM(CASE WHEN direction='"'"'DEBIT'"'"' THEN "amountCents" ELSE -"amountCents" END),0) FROM "LedgerPosting";')"
check "global ledger imbalance = 0 (got $IMBAL)" "$([ "$IMBAL" = "0" ] && echo 1 || echo 0)"

echo
echo "=== result: $pass passed, $fail failed ==="
[ "$fail" = "0" ]
