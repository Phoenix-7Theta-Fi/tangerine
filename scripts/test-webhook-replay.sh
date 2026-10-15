#!/usr/bin/env bash
#
# Adversarial workload: 100 replays of the same signed webhook.
# Delegates to the canonical webhook-idempotency test (single source of truth),
# pinning the replay count to 100.
set -euo pipefail
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
echo "[test-webhook-replay] same signed webhook x${N:-100}"
N="${N:-100}" exec bash "$DIR/test-webhook-idempotency.sh"
