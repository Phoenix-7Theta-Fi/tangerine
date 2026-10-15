#!/usr/bin/env bash
#
# Behavioral test: end-to-end purchase.
#
# Exercises every subsystem in one flow:
#   browse products → add to cart → create order → checkout (saga: reserve,
#   charge, ledger, confirm) → receive the payment webhook → verify order
#   status, ledger integrity, and inventory decrement.
#
# Usage:  scripts/test-e2e-purchase.sh
#
set -uo pipefail

API_URL="${API_URL:-http://localhost:3001}"
PG_CONTAINER="${PG_CONTAINER:-tangerine-postgres}"
PG_USER="${PG_USER:-tangerine}"
PG_DB="${PG_DB:-tangerine}"
SECRET="${STRIPE_WEBHOOK_SECRET:-whsec_dev_test_secret}"
RESET="${LEDGER_TEST_RESET:-1}"

pass=0; fail=0
check() {
  if [ "$2" = "1" ]; then printf '  \033[32mPASS\033[0m  %s\n' "$1"; pass=$((pass + 1));
  else printf '  \033[31mFAIL\033[0m  %s\n' "$1"; fail=$((fail + 1)); fi
}
psql_q() { docker exec -i "$PG_CONTAINER" psql -U "$PG_USER" -d "$PG_DB" -tAX -c "$1"; }
jqget() { python3 -c "import sys,json;print(json.load(sys.stdin).get('$1',''))"; }

echo "=== e2e purchase test ==="

if [ "$RESET" = "1" ]; then
  psql_q 'TRUNCATE "SagaState","OrderStateTransition","OrderItem","Order","CartItem","Cart","InventoryItem","Product","PaymentStateTransition","Payment","WebhookEvent","OutboxEvent","LedgerPosting","LedgerTransaction","IdempotencyKey";' >/dev/null 2>&1
  echo "reset all test tables"
fi

USER_ID="$(curl -fsS "$API_URL/api/session/identities" | python3 -c 'import sys,json;print(json.load(sys.stdin)[0]["id"])')"
[ -n "$USER_ID" ] || { echo "could not resolve identity"; exit 1; }
H=(-H "x-user-id: $USER_ID")

# 1. browse → create a product then list it
PID="$(curl -fsS -X POST "$API_URL/api/marketplace/products" -H 'content-type: application/json' "${H[@]}" \
  -d '{"name":"E2E Widget","priceCents":500,"quantity":3}' | jqget id)"
LISTED="$(curl -fsS "$API_URL/api/marketplace/products" "${H[@]}" | python3 -c 'import sys,json;print(sum(1 for p in json.load(sys.stdin) if p["id"]=="'"$PID"'"))')"
check "product browsable (got $LISTED)" "$([ "$LISTED" = "1" ] && echo 1 || echo 0)"
echo "product=$PID"

# 2. add to cart
CID="$(curl -fsS "$API_URL/api/marketplace/cart" "${H[@]}" | jqget id)"
curl -fsS -X POST "$API_URL/api/marketplace/cart/items" -H 'content-type: application/json' "${H[@]}" \
  -d '{"productId":"'"$PID"'","quantity":2,"expectedVersion":0}' >/dev/null
LINES="$(psql_q "SELECT count(*) FROM \"CartItem\" WHERE \"cartId\"='$CID';")"
check "cart has one line (got $LINES)" "$([ "$LINES" = "1" ] && echo 1 || echo 0)"

# 3. create order
OID="$(curl -fsS -X POST "$API_URL/api/marketplace/orders" -H 'content-type: application/json' "${H[@]}" \
  -d '{"cartId":"'"$CID"'"}' | jqget id)"
check "order created PENDING (got $(psql_q "SELECT status FROM \"Order\" WHERE id='$OID';"))" \
  "$([ "$(psql_q "SELECT status FROM \"Order\" WHERE id='$OID';")" = "PENDING" ] && echo 1 || echo 0)"
echo "order=$OID"

# 4. checkout saga
SAGA="$(curl -fsS -X POST "$API_URL/api/sagas/checkout" -H 'content-type: application/json' "${H[@]}" -d '{"orderId":"'"$OID"'"}')"
check "checkout saga COMPLETED (got $(printf '%s' "$SAGA" | jqget status))" \
  "$([ "$(printf '%s' "$SAGA" | jqget status)" = "COMPLETED" ] && echo 1 || echo 0)"

# 5. receive the payment webhook (idempotent re-confirmation)
TMP="$(mktemp -d)"; trap 'rm -rf "$TMP"' EXIT
cat > "$TMP/ev.json" <<JSON
{"id":"evt_e2e_$$","object":"event","type":"payment_intent.succeeded","created":$(date +%s),
 "data":{"object":{"id":"pi_saga_$OID","object":"payment_intent","amount":1000,"currency":"usd","status":"succeeded","metadata":{"ownerId":"$USER_ID"}}}}
JSON
SIG="$(python3 - "$TMP/ev.json" "$SECRET" <<'PY'
import hmac,hashlib,time,sys
p=open(sys.argv[1],'rb').read(); s=sys.argv[2].encode(); t=str(int(time.time()))
print(f"t={t},v1={hmac.new(s,f'{t}.'.encode()+p,hashlib.sha256).hexdigest()}")
PY
)"
WCODE="$(curl -s -o /dev/null -w '%{http_code}' -X POST "$API_URL/api/webhooks/stripe" \
  -H 'content-type: application/json' -H "stripe-signature: $SIG" --data-binary @"$TMP/ev.json")"
check "webhook accepted (got $WCODE)" "$([ "$WCODE" = "200" ] && echo 1 || echo 0)"
INBOX="$(psql_q "SELECT count(*) FROM \"WebhookEvent\" WHERE \"externalEventId\"='evt_e2e_$$';")"
check "webhook ingested once (got $INBOX)" "$([ "$INBOX" = "1" ] && echo 1 || echo 0)"

# 6. verify order status
check "order remains PAID (got $(psql_q "SELECT status FROM \"Order\" WHERE id='$OID';"))" \
  "$([ "$(psql_q "SELECT status FROM \"Order\" WHERE id='$OID';")" = "PAID" ] && echo 1 || echo 0)"

# 7. verify ledger integrity + the order's charge
IMBAL="$(psql_q 'SELECT COALESCE(SUM(CASE WHEN direction='"'"'DEBIT'"'"' THEN "amountCents" ELSE -"amountCents" END),0) FROM "LedgerPosting";')"
check "ledger balanced (imbalance=$IMBAL)" "$([ "$IMBAL" = "0" ] && echo 1 || echo 0)"
VERIFY="$(curl -fsS "$API_URL/api/ledger/verify" "${H[@]}")"
check "hash chain verifies ($VERIFY)" "$(printf '%s' "$VERIFY" | grep -q '"ok":true' && echo 1 || echo 0)"
OCH="$(psql_q "SELECT count(*) FROM \"LedgerTransaction\" WHERE \"sourceType\"='Order' AND \"sourceId\"='$OID' AND kind='CHARGE';")"
check "order has a CHARGE ledger entry (got $OCH)" "$([ "$OCH" = "1" ] && echo 1 || echo 0)"

# 8. verify inventory decremented (2 reserved of 3)
INV="$(psql_q "SELECT quantity||'|'||reserved FROM \"InventoryItem\" WHERE \"productId\"='$PID';")"
check "inventory decremented: 2 of 3 reserved (got $INV)" "$([ "$INV" = "3|2" ] && echo 1 || echo 0)"

echo
echo "=== result: $pass passed, $fail failed ==="
[ "$fail" = "0" ]
