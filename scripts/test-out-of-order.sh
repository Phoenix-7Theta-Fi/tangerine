#!/usr/bin/env bash
#
# Behavioral test: out-of-order webhook delivery.
#
# Providers do not guarantee order. For many rounds, deliver the pair
# {payment_intent.created, payment_intent.succeeded} in a RANDOM order (and with
# a duplicated late event) and assert the terminal state is identical and
# correct: SUCCEEDED, exactly one transition, exactly one ledger charge.
#
# Usage:  scripts/test-out-of-order.sh
#
set -uo pipefail

API_URL="${API_URL:-http://localhost:3001}"
PG_CONTAINER="${PG_CONTAINER:-tangerine-postgres}"
PG_USER="${PG_USER:-tangerine}"
PG_DB="${PG_DB:-tangerine}"
SECRET="${STRIPE_WEBHOOK_SECRET:-whsec_dev_test_secret}"
ROUNDS="${ROUNDS:-20}"
RESET="${LEDGER_TEST_RESET:-1}"

pass=0; fail=0
check() {
  if [ "$2" = "1" ]; then printf '  \033[32mPASS\033[0m  %s\n' "$1"; pass=$((pass + 1));
  else printf '  \033[31mFAIL\033[0m  %s\n' "$1"; fail=$((fail + 1)); fi
}
psql_q() { docker exec -i "$PG_CONTAINER" psql -U "$PG_USER" -d "$PG_DB" -tAX -c "$1"; }

echo "=== out-of-order webhook test ==="

if [ "$RESET" = "1" ]; then
  psql_q 'TRUNCATE "PaymentStateTransition","Payment","WebhookEvent","LedgerPosting","LedgerTransaction","IdempotencyKey";' >/dev/null 2>&1
  echo "reset webhook + payment + ledger tables"
fi

USER_ID="$(curl -fsS "$API_URL/api/session/identities" | python3 -c 'import sys,json;print(json.load(sys.stdin)[0]["id"])')"
[ -n "$USER_ID" ] || { echo "could not resolve identity"; exit 1; }

TMP="$(mktemp -d)"; trap 'rm -rf "$TMP"' EXIT

send_type() { # <event-id> <type> <pi>
  python3 - "$TMP" "$1" "$2" "$3" "$USER_ID" <<'PY'
import json,sys,time,os
tmp,eid,typ,pi,owner=sys.argv[1:6]
json.dump({"id":eid,"object":"event","type":typ,"created":int(time.time()),
  "data":{"object":{"id":pi,"object":"payment_intent","amount":333,"currency":"usd","metadata":{"ownerId":owner}}}},
  open(os.path.join(tmp,"ev.json"),"w"))
PY
  local sig
  sig="$(python3 - "$TMP/ev.json" "$SECRET" <<'PY'
import hmac,hashlib,time,sys
p=open(sys.argv[1],'rb').read(); s=sys.argv[2].encode(); t=str(int(time.time()))
print(f"t={t},v1={hmac.new(s,f'{t}.'.encode()+p,hashlib.sha256).hexdigest()}")
PY
)"
  curl -s -o /dev/null -w '%{http_code}' -X POST "$API_URL/api/webhooks/stripe" \
    -H 'content-type: application/json' -H "stripe-signature: $sig" --data-binary @"$TMP/ev.json"
}

BAD=0
for r in $(seq 1 "$ROUNDS"); do
  PI="pi_ooo_${r}_$$"
  if [ $((r % 2)) -eq 0 ]; then ORDER=(created succeeded); else ORDER=(succeeded created); fi
  for t in "${ORDER[@]}"; do
    send_type "evt_ooo_${r}_${t}_$$" "payment_intent.$t" "$PI" >/dev/null
  done
  # a duplicated late event must be a no-op
  send_type "evt_ooo_${r}_dup_$$" "payment_intent.created" "$PI" >/dev/null

  ST="$(psql_q "SELECT status FROM \"Payment\" WHERE \"externalId\"='$PI';")"
  TR="$(psql_q "SELECT count(*) FROM \"PaymentStateTransition\" p JOIN \"Payment\" pay ON pay.id=p.\"paymentId\" WHERE pay.\"externalId\"='$PI';")"
  TX="$(psql_q "SELECT count(*) FROM \"LedgerTransaction\" WHERE \"sourceId\"='$PI' AND kind='CHARGE';")"
  [ "$ST" = "SUCCEEDED" ] && [ "$TR" = "1" ] && [ "$TX" = "1" ] || { BAD=$((BAD+1)); echo "    round $r order=${ORDER[*]} status=$ST transitions=$TR ledger=$TX"; }
done

check "$ROUNDS shuffled rounds all reach SUCCEEDED with 1 transition + 1 charge (bad=$BAD)" \
  "$([ "$BAD" = "0" ] && echo 1 || echo 0)"

IMBAL="$(psql_q 'SELECT COALESCE(SUM(CASE WHEN direction='"'"'DEBIT'"'"' THEN "amountCents" ELSE -"amountCents" END),0) FROM "LedgerPosting";')"
check "ledger balanced (imbalance=$IMBAL)" "$([ "$IMBAL" = "0" ] && echo 1 || echo 0)"

echo
echo "=== result: $pass passed, $fail failed ==="
[ "$fail" = "0" ]
