#!/usr/bin/env bash
#
# Behavioral test: saga failure at EVERY step.
#
# Requires the API to run with SAGA_FAILURE_INJECTION=1.
#
# For each step of the checkout saga, force that step to fail and assert:
#   * the saga ends FAILED;
#   * exactly the completed steps were compensated (LIFO);
#   * inventory ends fully released (reserved = 0);
#   * the payment ends refunded (once charged) or absent (if never charged);
#   * the order ends in a terminal state (CANCELLED before confirmation,
#     REFUNDED once confirmation was compensated).
#
# Usage:  scripts/test-saga-failure.sh
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
jlen() { python3 -c "import sys,json;print(len(json.load(sys.stdin).get('$1',[])))"; }

echo "=== saga step-failure test ==="

USER_ID="$(curl -fsS "$API_URL/api/session/identities" | python3 -c 'import sys,json;print(json.load(sys.stdin)[0]["id"])')"
[ -n "$USER_ID" ] || { echo "could not resolve identity"; exit 1; }
H=(-H "x-user-id: $USER_ID")

reset() { psql_q 'TRUNCATE "SagaState","OrderStateTransition","OrderItem","Order","CartItem","Cart","InventoryItem","Product","PaymentStateTransition","Payment","OutboxEvent","LedgerPosting","LedgerTransaction","IdempotencyKey";' >/dev/null 2>&1; }

run_case() { # <step> <expected_comp_count> <payment: none|REFUNDED> <order: CANCELLED|REFUNDED>
  local step="$1" exp_comps="$2" exp_pay="$3" exp_order="$4"
  reset
  local pid cid oid saga status comps reserved pay order
  pid="$(curl -fsS -X POST "$API_URL/api/marketplace/products" -H 'content-type: application/json' "${H[@]}" \
    -d '{"name":"Fail Widget","priceCents":300,"quantity":5}' | jqget id)"
  cid="$(curl -fsS "$API_URL/api/marketplace/cart" "${H[@]}" | jqget id)"
  curl -fsS -X POST "$API_URL/api/marketplace/cart/items" -H 'content-type: application/json' "${H[@]}" \
    -d '{"productId":"'"$pid"'","quantity":1,"expectedVersion":0}' >/dev/null
  oid="$(curl -fsS -X POST "$API_URL/api/marketplace/orders" -H 'content-type: application/json' "${H[@]}" \
    -d '{"cartId":"'"$cid"'"}' | jqget id)"

  saga="$(curl -fsS -X POST "$API_URL/api/sagas/checkout" -H 'content-type: application/json' "${H[@]}" \
    -d '{"orderId":"'"$oid"'","forceFailStep":"'"$step"'"}')"
  status="$(printf '%s' "$saga" | jqget status)"
  comps="$(printf '%s' "$saga" | jlen compensationsRun)"
  reserved="$(psql_q "SELECT reserved FROM \"InventoryItem\" WHERE \"productId\"='$pid';")"
  pay="$(psql_q "SELECT COALESCE((SELECT status::text FROM \"Payment\" WHERE \"externalId\"='pi_saga_$oid'),'none');")"
  order="$(psql_q "SELECT status FROM \"Order\" WHERE id='$oid';")"

  check "[$step] saga FAILED (got $status)" "$([ "$status" = "FAILED" ] && echo 1 || echo 0)"
  check "[$step] $exp_comps compensations ran (got $comps)" "$([ "$comps" = "$exp_comps" ] && echo 1 || echo 0)"
  check "[$step] inventory fully released (got $reserved)" "$([ "$reserved" = "0" ] && echo 1 || echo 0)"
  check "[$step] payment $exp_pay (got $pay)" "$([ "$pay" = "$exp_pay" ] && echo 1 || echo 0)"
  check "[$step] order $exp_order (got $order)" "$([ "$order" = "$exp_order" ] && echo 1 || echo 0)"
}

echo "-- forcing each step to fail --"
run_case reserve-inventory 0 none      CANCELLED
run_case charge-payment    1 none      CANCELLED
run_case write-ledger      2 REFUNDED  CANCELLED
run_case confirm-order     3 REFUNDED  CANCELLED
run_case emit-notification 4 REFUNDED  REFUNDED

IMBAL="$(psql_q 'SELECT COALESCE(SUM(CASE WHEN direction='"'"'DEBIT'"'"' THEN "amountCents" ELSE -"amountCents" END),0) FROM "LedgerPosting";')"
check "global ledger imbalance = 0 after all failures (got $IMBAL)" "$([ "$IMBAL" = "0" ] && echo 1 || echo 0)"

echo
echo "=== result: $pass passed, $fail failed ==="
[ "$fail" = "0" ]
