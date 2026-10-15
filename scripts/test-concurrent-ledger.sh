#!/usr/bin/env bash
#
# Adversarial workload: 100 concurrent ledger writes; assert the balance holds.
# Delegates to the canonical double-entry ledger test (single source of truth),
# pinning the concurrency to 100.
set -euo pipefail
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
echo "[test-concurrent-ledger] ${N:-100} concurrent balanced writes"
N="${N:-100}" exec bash "$DIR/test-ledger.sh"
