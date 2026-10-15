#!/usr/bin/env bash
#
# Behavioral test: order state machine (exhaustive).
#
# For every (current, next, role) triple, the API must accept exactly the
# transitions declared in the table and reject the rest with 409. Also verifies
# the transition record (from/to/actor) is written for an accepted move.
#
# Usage:  scripts/test-order-state-machine.sh
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

STATUSES=(PENDING PAID FULFILLING SHIPPED DELIVERED RETURNED REFUNDED CANCELLED)
ROLES=(MEMBER PRACTITIONER SYSTEM)

expected_legal() { # from to
  case "$1:$2" in
    PENDING:PAID|PENDING:CANCELLED|PAID:FULFILLING|PAID:REFUNDED) echo 1 ;;
    FULFILLING:SHIPPED|FULFILLING:CANCELLED|SHIPPED:DELIVERED) echo 1 ;;
    DELIVERED:RETURNED|RETURNED:REFUNDED) echo 1 ;;
    *) echo 0 ;;
  esac
}
set_status() { psql_q "UPDATE \"Order\" SET status='$1' WHERE id='$OID';" >/dev/null; }

echo "=== order state machine test ==="

if [ "$RESET" = "1" ]; then
  psql_q 'TRUNCATE "OrderStateTransition","OrderItem","Order","CartItem","Cart","InventoryItem","Product";' >/dev/null 2>&1
  echo "reset marketplace tables"
fi

USER_ID="$(curl -fsS "$API_URL/api/session/identities" | python3 -c 'import sys,json;print(json.load(sys.stdin)[0]["id"])')"
[ -n "$USER_ID" ] || { echo "could not resolve identity"; exit 1; }

PID="$(curl -fsS -X POST "$API_URL/api/marketplace/products" -H 'content-type: application/json' -H "x-user-id: $USER_ID" \
  -d '{"name":"SM Widget","priceCents":900,"quantity":10}' | jqget id)"
CID="$(curl -fsS "$API_URL/api/marketplace/cart" -H "x-user-id: $USER_ID" | jqget id)"
curl -fsS -X POST "$API_URL/api/marketplace/cart/items" -H 'content-type: application/json' -H "x-user-id: $USER_ID" \
  -d '{"productId":"'"$PID"'","quantity":1,"expectedVersion":0}' >/dev/null
OID="$(curl -fsS -X POST "$API_URL/api/marketplace/orders" -H 'content-type: application/json' -H "x-user-id: $USER_ID" \
  -d '{"cartId":"'"$CID"'"}' | jqget id)"
[ -n "$OID" ] || { echo "failed to create order"; exit 1; }
echo "order=$OID"

# ── transition record written for an accepted move ───────────────────────
set_status PENDING
CODE="$(curl -s -o /dev/null -w '%{http_code}' -X POST "$API_URL/api/marketplace/orders/$OID/transition" \
  -H 'content-type: application/json' -H "x-user-id: $USER_ID" -d '{"to":"PAID","actorRole":"MEMBER"}')"
check "PENDING→PAID accepted (got $CODE)" "$([ "$CODE" = "201" ] && echo 1 || echo 0)"
REC="$(psql_q "SELECT \"fromStatus\"||'|'||\"toStatus\"||'|'||\"actorRole\" FROM \"OrderStateTransition\" WHERE \"orderId\"='$OID' ORDER BY \"createdAt\" DESC LIMIT 1;")"
check "transition record PENDING|PAID|MEMBER (got $REC)" "$([ "$REC" = "PENDING|PAID|MEMBER" ] && echo 1 || echo 0)"

# ── exhaustive (current, next, role) ─────────────────────────────────────
TOTAL=0; MISMATCH=0
for from in "${STATUSES[@]}"; do
  for to in "${STATUSES[@]}"; do
    LEGAL="$(expected_legal "$from" "$to")"
    set_status "$from"
    for role in "${ROLES[@]}"; do
      # A legal move mutates status; reset before the next role's attempt.
      if [ "$LEGAL" = "1" ] && [ "$role" != "${ROLES[0]}" ]; then set_status "$from"; fi
      CODE="$(curl -s -o /dev/null -w '%{http_code}' -X POST "$API_URL/api/marketplace/orders/$OID/transition" \
        -H 'content-type: application/json' -H "x-user-id: $USER_ID" -d '{"to":"'"$to"'","actorRole":"'"$role"'"}')"
      TOTAL=$((TOTAL+1))
      if [ "$LEGAL" = "1" ]; then
        [ "$CODE" = "201" ] || { MISMATCH=$((MISMATCH+1)); [ "$MISMATCH" -le 5 ] && echo "    legal $from→$to ($role) got $CODE"; }
      else
        [ "$CODE" = "409" ] || { MISMATCH=$((MISMATCH+1)); [ "$MISMATCH" -le 5 ] && echo "    illegal $from→$to ($role) got $CODE"; }
      fi
    done
  done
done

check "exhaustive triples tested (got $TOTAL, expected 192)" "$([ "$TOTAL" = "192" ] && echo 1 || echo 0)"
check "zero legality mismatches across all triples (got $MISMATCH)" "$([ "$MISMATCH" = "0" ] && echo 1 || echo 0)"

echo
echo "=== result: $pass passed, $fail failed ==="
[ "$fail" = "0" ]
