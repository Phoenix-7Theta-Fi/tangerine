#!/usr/bin/env bash
#
# Behavioral test: webhook order-independence.
#
# Providers deliver events out of order. This proves the Payment state machine
# is order-independent:
#   1. `payment_intent.succeeded` arriving BEFORE `payment_intent.created`
#      still lands on SUCCEEDED (with one ledger transaction).
#   2. The late `payment_intent.created` is a no-op: status unchanged, no extra
#      transition, no extra ledger transaction.
#   3. The natural order (created → succeeded) also reaches SUCCEEDED.
#   4. A refund after success moves SUCCEEDED → REFUNDED.
#   5. An illegal transition (refund before success) is a no-op.
#
# Usage:  scripts/test-webhook-ordering.sh
# Env:    API_URL, PG_*, STRIPE_WEBHOOK_SECRET, LEDGER_TEST_RESET.
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
  if [ "$2" = "1" ]; then
    printf '  \033[32mPASS\033[0m  %s\n' "$1"; pass=$((pass + 1))
  else
    printf '  \033[31mFAIL\033[0m  %s\n' "$1"; fail=$((fail + 1))
  fi
}
psql_q() { docker exec -i "$PG_CONTAINER" psql -U "$PG_USER" -d "$PG_DB" -tAX -c "$1"; }

echo "=== webhook ordering test ==="

if [ "$RESET" = "1" ]; then
  psql_q 'TRUNCATE "PaymentStateTransition", "Payment", "WebhookEvent", "LedgerPosting", "LedgerTransaction", "IdempotencyKey";' >/dev/null 2>&1
  echo "reset webhook + payment + ledger tables"
fi

USER_ID="$(curl -fsS "$API_URL/api/session/identities" | python3 -c 'import sys,json;print(json.load(sys.stdin)[0]["id"])')"
[ -n "$USER_ID" ] || { echo "could not resolve identity"; exit 1; }
TMP="$(mktemp -d)"; trap 'rm -rf "$TMP"' EXIT

send() { # <event-id> <type> <pi-id> [amount]
  local eid="$1" type="$2" pi="$3" amount="${4:-2000}"
  python3 - "$TMP" "$eid" "$type" "$pi" "$amount" "$USER_ID" <<'PY'
import json, sys, time, os
tmp, eid, typ, pi, amount, owner = sys.argv[1:7]
if typ.startswith("charge."):
    obj = {"id": "ch_" + pi, "object": "charge", "payment_intent": pi,
           "amount": int(amount), "currency": "usd", "metadata": {"ownerId": owner}}
else:
    obj = {"id": pi, "object": "payment_intent", "amount": int(amount),
           "currency": "usd", "metadata": {"ownerId": owner}}
ev = {"id": eid, "object": "event", "type": typ, "created": int(time.time()),
      "data": {"object": obj}}
json.dump(ev, open(os.path.join(tmp, "ev.json"), "w"))
PY
  local sig
  sig="$(python3 - "$TMP/ev.json" "$SECRET" <<'PY'
import hmac, hashlib, time, sys
p = open(sys.argv[1], "rb").read(); s = sys.argv[2].encode(); t = str(int(time.time()))
print(f"t={t},v1={hmac.new(s, f'{t}.'.encode()+p, hashlib.sha256).hexdigest()}")
PY
)"
  curl -s -o /dev/null -w '%{http_code}' -X POST "$API_URL/api/webhooks/stripe" \
    -H 'content-type: application/json' -H "stripe-signature: $sig" --data-binary @"$TMP/ev.json"
}
status_of() { psql_q "SELECT status FROM \"Payment\" WHERE \"externalId\"='$1';"; }
trans_of() { psql_q "SELECT count(*) FROM \"PaymentStateTransition\" p JOIN \"Payment\" pay ON pay.id=p.\"paymentId\" WHERE pay.\"externalId\"='$1';"; }
tx_of() { psql_q "SELECT count(*) FROM \"LedgerTransaction\" WHERE \"sourceType\"='Payment' AND \"sourceId\"='$1';"; }

# ── 1+2. succeeded before created ───────────────────────────────────────
PI1="pi_order_a_$$"
C="$(send "evt_o_a1_$$" payment_intent.succeeded "$PI1" 2000)"
check "succeeded-first accepted (got $C)" "$([ "$C" = "200" ] && echo 1 || echo 0)"
check "terminal status SUCCEEDED (got $(status_of "$PI1"))" "$([ "$(status_of "$PI1")" = "SUCCEEDED" ] && echo 1 || echo 0)"
check "one ledger transaction (got $(tx_of "$PI1"))" "$([ "$(tx_of "$PI1")" = "1" ] && echo 1 || echo 0)"

send "evt_o_a2_$$" payment_intent.created "$PI1" 2000 >/dev/null
check "late 'created' is a no-op on status (got $(status_of "$PI1"))" "$([ "$(status_of "$PI1")" = "SUCCEEDED" ] && echo 1 || echo 0)"
check "late 'created' added no transition (got $(trans_of "$PI1"))" "$([ "$(trans_of "$PI1")" = "1" ] && echo 1 || echo 0)"
check "late 'created' added no ledger tx (got $(tx_of "$PI1"))" "$([ "$(tx_of "$PI1")" = "1" ] && echo 1 || echo 0)"

# ── 3. natural order ─────────────────────────────────────────────────────
PI2="pi_order_b_$$"
send "evt_o_b1_$$" payment_intent.created "$PI2" 500 >/dev/null
check "created-first status CREATED (got $(status_of "$PI2"))" "$([ "$(status_of "$PI2")" = "CREATED" ] && echo 1 || echo 0)"
send "evt_o_b2_$$" payment_intent.succeeded "$PI2" 500 >/dev/null
check "then succeeded reaches SUCCEEDED (got $(status_of "$PI2"))" "$([ "$(status_of "$PI2")" = "SUCCEEDED" ] && echo 1 || echo 0)"

# ── 4. refund after success ──────────────────────────────────────────────
send "evt_o_b3_$$" charge.refunded "$PI2" 500 >/dev/null
check "refund moves SUCCEEDED → REFUNDED (got $(status_of "$PI2"))" "$([ "$(status_of "$PI2")" = "REFUNDED" ] && echo 1 || echo 0)"
check "refund wrote a REFUND ledger transaction (got $(psql_q "SELECT count(*) FROM \"LedgerTransaction\" WHERE \"sourceId\"='$PI2' AND kind='REFUND';"))" \
  "$([ "$(psql_q "SELECT count(*) FROM \"LedgerTransaction\" WHERE \"sourceId\"='$PI2' AND kind='REFUND';")" = "1" ] && echo 1 || echo 0)"

# ── 5. illegal transition is a no-op ─────────────────────────────────────
PI3="pi_order_c_$$"
send "evt_o_c1_$$" charge.refunded "$PI3" 700 >/dev/null
check "refund-before-success stays CREATED (got $(status_of "$PI3"))" "$([ "$(status_of "$PI3")" = "CREATED" ] && echo 1 || echo 0)"
check "refund-before-success recorded no transition (got $(trans_of "$PI3"))" "$([ "$(trans_of "$PI3")" = "0" ] && echo 1 || echo 0)"

# ── invariants ───────────────────────────────────────────────────────────
IMBAL="$(psql_q 'SELECT COALESCE(SUM(CASE WHEN direction='"'"'DEBIT'"'"' THEN "amountCents" ELSE -"amountCents" END),0) FROM "LedgerPosting";')"
check "global ledger imbalance = 0 (got $IMBAL)" "$([ "$IMBAL" = "0" ] && echo 1 || echo 0)"
VERIFY="$(curl -fsS "$API_URL/api/ledger/verify" -H "x-user-id: $USER_ID")"
check "hash chain verifies ($VERIFY)" "$(printf '%s' "$VERIFY" | grep -q '"ok":true' && echo 1 || echo 0)"

echo
echo "=== result: $pass passed, $fail failed ==="
[ "$fail" = "0" ]
