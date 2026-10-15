# Payments — ledger, idempotency, and webhooks

**Status:** measured (behavioral harnesses against live Postgres + API).

Machine, dataset, and fixed parameters are in `docs/performance/README.md`.
Charts here are [Mermaid](https://mermaid.js.org/) (rendered by the markdown
host), not hand-authored SVG — a charting library keeps them maintainable.

## Hypothesis

A payments core can be made **exactly-once and auditable without distributed
transactions**, by pushing the invariants into Postgres and composing three
mechanisms:

1. A **double-entry ledger** where a transaction is unbalanced unless its
   postings net to zero — enforced by a deferred constraint trigger, not by
   application code.
2. **Idempotent writes** keyed by source, so a retry after a crash never
   double-applies.
3. **Idempotent webhook ingestion**, because providers deliver at-least-once,
   out of order, and sometimes twice.

If this holds, then under concurrency the ledger stays balanced, every retry is
a no-op, and a replayed webhook mutates state once.

## Methodology

Behavioral harnesses, run against the real API and a real `postgres:18-alpine`
(`docker compose up -d`). Each is a shell script under `scripts/` that asserts
against `psql` output, the API, and `/api/metrics`:

| Script | Workload |
| --- | --- |
| `test-ledger.sh` | 100 concurrent balanced writes; unbalanced-insert and `UPDATE`/`DELETE` rejection; hash-chain verify |
| `test-idempotency.sh` | 100 concurrent identical requests; cached-response equality; crash-after-recovery-point, then retry |
| `test-webhook-idempotency.sh` | 100 concurrent replays of one signed webhook; bad-signature rejection |
| `test-webhook-ordering.sh` | `succeeded` before `created`; late event is a no-op |
| `test-out-of-order.sh` | 20 rounds of shuffled `created`/`succeeded` delivery |

Timing is wall-clock for the batch (the harness records it), single host shared
with Postgres — the same caveat as every number in this directory.

## Results

### Double-entry ledger

`test-ledger.sh`, 100 concurrent balanced transactions:

| Metric | Value |
| --- | --- |
| Concurrent writes accepted | **100 / 100** |
| Batch wall time | **1.58 s** (second run 1.37 s) → ≈ **63–73 writes/s** |
| Global `SUM(debit) − SUM(credit)` | **0** |
| Balance-trigger exceptions during the batch | **0** (unchanged log count) |
| Unbalanced insert (direct SQL, `ON_ERROR_STOP`) | rejected at `COMMIT`, rc=3 |
| `UPDATE` / `DELETE` on a ledger row | rejected, `... append-only ... is not permitted` |
| Hash chain (`GET /api/ledger/verify`) | `{"ok":true}` over every row |

The unbalanced write fails **at commit**, proving the trigger is deferred
(`CREATE CONSTRAINT TRIGGER ... DEFERRABLE INITIALLY DEFERRED`): all legs insert
first, the invariant is checked once, at the transaction boundary.

### Idempotency with recovery points

`test-idempotency.sh`, same key, identical body, 100 concurrent processes:

| Metric | Value |
| --- | --- |
| Ledger transactions created | **1** |
| Distinct canonical responses across 100 callers | **1** |
| `tangerine_idempotent_replays_total` | **99** (one leader, 99 replays) |
| Same key, different body | **409** |
| Crash after recovery point → retry | row `FAILED` with `recoveryPoint=ledger.before-post`; retry → `COMPLETED`, still **1** ledger tx |

```mermaid
sequenceDiagram
    autonumber
    participant C1 as Caller 1 (leader)
    participant C2 as Caller 2..100 (duplicates)
    participant DB as Postgres
    C1->>DB: INSERT ... ON CONFLICT DO NOTHING; SELECT ... FOR UPDATE
    DB-->>C1: claimed (lockToken=A)
    C2->>DB: claim (short tx)
    DB-->>C2: STARTED, lease valid → WAIT
    C1->>C1: run operation, set recovery points
    C1->>DB: finish → status=COMPLETED, responseBody
    C2->>DB: poll (every 50ms) → COMPLETED
    DB-->>C2: replay recorded response
```

The claim transaction is **short**: the operation runs *outside* the row lock.
That is deliberate (see the rejected approach in the optimization log) — holding
the lock across the operation pins a pooled connection while 99 others block on
the same row, and the pool deadlocks under a stampede.

### Webhook ingestion

`test-webhook-idempotency.sh`, 100 concurrent replays of one signed event:

| Metric | Value |
| --- | --- |
| Inbox rows (`WebhookEvent`) | **1** |
| Payment state transitions | **1** |
| Ledger transactions | **1** |
| Deliveries counted `processed` | **1** (rest `deduped`) |
| Bad signature | **400**, no inbox row |

`test-webhook-ordering.sh` (order-independence):

| Scenario | Terminal status | Transitions |
| --- | --- | --- |
| `succeeded` → `created` (out of order) | `SUCCEEDED` | 1 |
| late `created` after terminal | `SUCCEEDED` (no-op) | 1 |
| `created` → `succeeded` (natural) | `SUCCEEDED` | — |
| `charge.refunded` after success | `REFUNDED` | — |
| `charge.refunded` before success | `CREATED` (no-op) | 0 |

`test-out-of-order.sh` runs 20 shuffled rounds; **all 20** reach `SUCCEEDED`
with exactly one transition and one ledger charge.

## Analysis

The three properties come from three different layers, each the cheapest layer
that can enforce it:

- **Balance** is enforced where the data lives. A deferred constraint trigger
  sees the whole transaction at commit; application code cannot forget it, and a
  direct `INSERT` that bypasses the API is rejected just the same (verified via
  `psql`, rc=3).
- **Exactly-once** is a uniqueness problem. `(sourceType, sourceId, kind)` on the
  ledger and `(source, externalEventId)` on the inbox make the *second* write
  impossible; the idempotency table adds response replay and recovery points for
  longer operations.
- **Order-independence** is a transition table, not a status pipeline. A late
  `created` is a no-op because the payment has already advanced; a `succeeded`
  that arrives first still lands because the rule's precondition set is checked
  against the current row.

The hash chain is the audit story: `verifyIntegrity()` walks `seq` order,
recomputes SHA-256 over a canonical encoding, and reports the first broken
sequence or content mismatch. It is O(n) and unindexed by design — it is a
verification job, not a hot path.

## Optimization

- **Global advisory lock for the chain** (`pg_advisory_xact_lock(9317)`): `seq`
  is assigned by the service, not a DB sequence, because the hash must be
  computable *before* insert (an append-only row cannot be back-filled). The lock
  serialises chain extension; the critical section is microseconds. The trade is
  recorded in the research memo §9: shard the chain per account if write
  throughput ever matters.
- **Claim-run-finalize** for idempotency (short lock, operation outside it),
  with a lease (`lockedAt`) and a fencing token (`lockToken`) so a worker whose
  lease expired cannot clobber the attempt that took over.

Both changes and the rejected alternative are in
`docs/performance/optimization-log.md`.

## What it proves

Correctness for money does not require a saga over the ledger: a deferred
constraint, a uniqueness key, and a transition table are each sufficient, local,
and testable by direct SQL. The interesting engineering is not the happy path —
it is making the *second* write and the *late* event impossible, and proving it
with a harness that fires 100 of them.

## Reproduce

```bash
docker compose up -d
pnpm --filter @tangerine/api dev            # or pnpm dev:api
bash scripts/test-ledger.sh
bash scripts/test-idempotency.sh            # add IDEMPOTENCY_CRASH_TEST=1 to exercise recovery
bash scripts/test-webhook-idempotency.sh
bash scripts/test-webhook-ordering.sh
bash scripts/test-out-of-order.sh
```
