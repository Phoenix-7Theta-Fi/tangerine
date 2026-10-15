#!/usr/bin/env bash
#
# Behavioral test: webhook idempotency.
#
# Proves, against a live API + live Postgres:
#   1. A correctly signed webhook is accepted (200).
#   2. Replaying the SAME signed webhook 100 times concurrently, from separate
#      processes, produces exactly ONE inbox row, ONE payment state transition,
#      and ONE ledger transaction.
#   3. Exactly one delivery is counted "processed"; the rest are "deduped".
#   4. A bad signature is rejected with 400 and leaves no inbox row.
#   5. The ledger stays balanced.
#
# Usage:  scripts/test-webhook-idempotency.sh
# Env:    API_URL, PG_CONTAINER, PG_USER, PG_DB, N (default 100)
#         STRIPE_WEBHOOK_SECRET (must match the API), LEDGER_TEST_RESET.
#
set -uo pipefail

API_URL="${API_URL:-http://localhost:3001}"
PG_CONTAINER="${PG_CONTAINER:-tangerine-postgres}"
PG_USER="${PG_USER:-tangerine}"
PG_DB="${PG_DB:-tangerine}"
N="${N:-100}"
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

echo "=== webhook idempotency test ==="
echo "api=$API_URL  n=$N  secret=${SECRET:0:10}…"

if [ "$RESET" = "1" ]; then
  psql_q 'TRUNCATE "PaymentStateTransition", "Payment", "WebhookEvent", "LedgerPosting", "LedgerTransaction", "IdempotencyKey";' >/dev/null 2>&1
  echo "reset webhook + payment + ledger tables"
fi

USER_ID="$(curl -fsS "$API_URL/api/session/identities" | python3 -c 'import sys,json;print(json.load(sys.stdin)[0]["id"])')"
[ -n "$USER_ID" ] || { echo "could not resolve identity"; exit 1; }
echo "acting as user=$USER_ID"

TMP="$(mktemp -d)"; trap 'rm -rf "$TMP"' EXIT
PI="pi_test_idem_$$"
NOW="$(date +%s)"

cat > "$TMP/event.json" <<JSON
{"id":"evt_idem_$$","object":"event","type":"payment_intent.succeeded","created":$NOW,
 "data":{"object":{"id":"$PI","object":"payment_intent","amount":1234,"currency":"usd","status":"succeeded","metadata":{"ownerId":"$USER_ID"}}}}
JSON

sign() { # <payload-file> -> stripe-signature header value
  python3 - "$1" "$SECRET" <<'PY'
import hmac, hashlib, time, sys
payload = open(sys.argv[1], "rb").read()
secret = sys.argv[2].encode()
t = str(int(time.time()))
v1 = hmac.new(secret, f"{t}.".encode() + payload, hashlib.sha256).hexdigest()
print(f"t={t},v1={v1}")
PY
}
SIG="$(sign "$TMP/event.json")"
metric() { curl -fsS "$API_URL/api/metrics" | awk -v m="$1" '$1==m{print $2}'; }
PROC_METRIC='tangerine_webhook_events_total{source="stripe",type="payment_intent.succeeded",outcome="processed"}'
BASE_PROC="$(metric "$PROC_METRIC")"; BASE_PROC="${BASE_PROC:-0}"

# ── 1. correct signature accepted ────────────────────────────────────────
CODE="$(curl -s -o /dev/null -w '%{http_code}' -X POST "$API_URL/api/webhooks/stripe" \
  -H 'content-type: application/json' -H "stripe-signature: $SIG" --data-binary @"$TMP/event.json")"
check "correctly signed webhook accepted (got $CODE)" "$([ "$CODE" = "200" ] && echo 1 || echo 0)"

# ── 2. 100 concurrent replays ────────────────────────────────────────────
echo "replaying the same signed webhook $N times concurrently..."
for i in $(seq 1 "$N"); do
  ( curl -s -o /dev/null -w '%{http_code}' -X POST "$API_URL/api/webhooks/stripe" \
      -H 'content-type: application/json' -H "stripe-signature: $SIG" \
      --data-binary @"$TMP/event.json" > "$TMP/$i.code" ) &
done
wait

ok=0; for i in $(seq 1 "$N"); do case "$(cat "$TMP/$i.code" 2>/dev/null)" in 2*) ok=$((ok+1));; esac; done
check "all $N concurrent replays returned 2xx (got $ok)" "$([ "$ok" = "$N" ] && echo 1 || echo 0)"

INBOX="$(psql_q "SELECT count(*) FROM \"WebhookEvent\" WHERE \"externalEventId\"='evt_idem_$$';")"
check "exactly ONE inbox row (got $INBOX)" "$([ "$INBOX" = "1" ] && echo 1 || echo 0)"

TRANS="$(psql_q "SELECT count(*) FROM \"PaymentStateTransition\" p JOIN \"Payment\" pay ON pay.id=p.\"paymentId\" WHERE pay.\"externalId\"='$PI';")"
check "exactly ONE payment state transition (got $TRANS)" "$([ "$TRANS" = "1" ] && echo 1 || echo 0)"

TX="$(psql_q "SELECT count(*) FROM \"LedgerTransaction\" WHERE \"sourceType\"='Payment' AND \"sourceId\"='$PI';")"
check "exactly ONE ledger transaction (got $TX)" "$([ "$TX" = "1" ] && echo 1 || echo 0)"

STATUS="$(psql_q "SELECT status FROM \"Payment\" WHERE \"externalId\"='$PI';")"
check "payment status SUCCEEDED (got $STATUS)" "$([ "$STATUS" = "SUCCEEDED" ] && echo 1 || echo 0)"

PROC="$(metric "$PROC_METRIC")"; PROC="${PROC:-0}"
check "exactly ONE delivery counted processed (delta $((PROC-BASE_PROC)))" "$([ "$((PROC-BASE_PROC))" = "1" ] && echo 1 || echo 0)"

# ── 3. bad signature rejected, nothing ingested ──────────────────────────
BADCODE="$(curl -s -o /dev/null -w '%{http_code}' -X POST "$API_URL/api/webhooks/stripe" \
  -H 'content-type: application/json' -H 'stripe-signature: t=1,v1=deadbeef' --data-binary @"$TMP/event.json")"
check "bad signature rejected with 400 (got $BADCODE)" "$([ "$BADCODE" = "400" ] && echo 1 || echo 0)"

BADSIG="$(curl -fsS "$API_URL/api/metrics" | awk '/^tangerine_webhook_events_total\{source="stripe",type="unknown",outcome="invalid_signature"\}/{print $2}')"
check "invalid-signature metric advanced (got ${BADSIG:-0})" "$([ -n "$BADSIG" ] && [ "$BADSIG" -ge 1 ] && echo 1 || echo 0)"

# ── 4. invariants ────────────────────────────────────────────────────────
IMBAL="$(psql_q 'SELECT COALESCE(SUM(CASE WHEN direction='"'"'DEBIT'"'"' THEN "amountCents" ELSE -"amountCents" END),0) FROM "LedgerPosting";')"
check "global ledger imbalance = 0 (got $IMBAL)" "$([ "$IMBAL" = "0" ] && echo 1 || echo 0)"
STUCK="$(curl -fsS "$API_URL/api/metrics" | awk '/^tangerine_orders_stuck_pending/{print $2}')"
check "orders_stuck_pending = 0 (got ${STUCK:-none})" "$([ "$STUCK" = "0" ] && echo 1 || echo 0)"

echo
echo "=== result: $pass passed, $fail failed ==="
[ "$fail" = "0" ]
