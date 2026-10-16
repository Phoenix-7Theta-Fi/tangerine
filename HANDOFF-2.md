# Handoff 2: Marketplace + Payments & Billing for Tangerine

**Document type:** Phased implementation spec with resumable checkpoints
**Target agent:** Autonomous AI coding agent
**Repository:** Tangerine monorepo (modular monolith)
**Branch:** New dedicated branch, forked from the current `HEAD` of the branch you are already on — **not** from `main`/`master`
**Testing paradigm:** Real-user behavioral simulation via the Herdr terminal multiplexer
**Autonomy level:** High — the agent decides code structure, naming, and implementation details. The constraints below are architectural, correctness-related, and procedural.

---

## How to Use This Document

This document is **phase-gated**. Each phase has a **Status** marker at the top. The agent must:

1. Read the entire document before starting.
2. Begin at the first phase whose status is `NOT STARTED` or `IN PROGRESS`.
3. Within a phase, complete all deliverables, run all verification steps, and update the status marker to `DONE` with a timestamp and commit SHA.
4. Only then proceed to the next phase.
5. If the session is interrupted, a fresh agent reads the status markers and resumes from the correct phase.

**Do not skip phases.** Each phase depends on the correctness of the previous one.

**Do not modify the status markers of completed phases.** Only append completion notes.

---

## Research Is Not Optional

Your training data is stale. Stripe's API has changed. PostgreSQL's constraint-trigger semantics have version-specific behavior. Prisma's transaction API has evolved. The Herdr CLI is a moving target. Before writing any code for a phase, you must search the web, read official documentation, and find reference implementations. If you find yourself "second-guessing" or "recalling roughly," **stop and search**. If a design decision rests on an API contract you have not verified in the last 24 hours of browsing, you have not finished researching. Cite your sources in `docs/research/`. The purpose of this constraint is not bureaucracy — it is that you will otherwise build on assumptions that are wrong, and the human operator will spend hours debugging what a five-minute search would have prevented.

**You need to research when any of the following are true:**

- You are about to call an external API (Stripe, Herdr) and you have not read its current docs in this session.
- You are about to write SQL that relies on version-specific behavior (constraint triggers, `SKIP LOCKED`, temporal types).
- You are about to use a library feature you have not personally verified works in this codebase.
- You find yourself writing a comment like "this should work," "I believe," or "the API probably."
- You are about to make a design decision you cannot justify with a citation or a local experiment.

**Research methodology:**

1. Search official documentation first (Stripe docs, PostgreSQL docs, Prisma docs, Herdr docs).
2. Search engineering blogs from companies that have solved the problem (Stripe, Shopify, Uber, Airbnb).
3. Search GitHub for reference implementations. Look for well-starred repositories with recent commits.
4. Cite sources in `docs/research/` or in code comments where the reference directly informs a design decision.
5. If a design decision is uncertain, document the uncertainty and the chosen approach with reasoning.

**Do not guess. Do not rely on memory for API contracts. Search.**

---

## Global Constraints (Apply to Every Phase)

### G1. Branch Isolation

Before any code is written, create a new branch from the **current `HEAD`** of the branch you are already on. **Do not branch from `main` or `master`.** The current branch contains work that `main` may not have; forking from `main` would silently drop that work and produce a diff that conflicts with the branch it was supposed to extend.

**Required steps:**

1. Run `git rev-parse --abbrev-ref HEAD` to confirm the current branch name.
2. Run `git log -1 --format="%H %s"` to capture the current `HEAD` SHA and subject.
3. Create the new branch from `HEAD`: `git checkout -b feature/marketplace-payments`.
4. Echo both the source branch name and the source SHA into the Phase 0 commit message so the fork point is visible in the log forever.

**Worktree is optional.** A plain `git checkout -b` is sufficient. Use a Herdr worktree (`herdr worktree create --branch <name> --base HEAD`) only if the human operator wants to keep the existing checkout untouched while work proceeds. The branch is the deliverable; the working directory is an implementation detail. If you do use a worktree, verify the correct `--base` flag with `herdr worktree create --help` — do not hardcode `main`.

The branch name: `feature/marketplace-payments`. All work — code, migrations, docs, test scripts — lives on this branch.

### G2. Herdr Terminal Orchestration

All testing and monitoring uses **Herdr tabs**, not panes within a single tab. Panes compress into one view and are hard to monitor; tabs are separate views within a workspace.

**The agent has full autonomy over tab topology.** It decides how many tabs, what each tab contains, and how to organize them. Typical topology might include tabs for: API server, `psql` invariant checks, `redis-cli monitor`, log tailing, Prometheus metrics, webhook simulation, load generation, and notification routing. Create as many as the work requires.

**Herdr notification system:** Use `herdr notification show` to deliver native system notifications on phase completion, blocked state, or test failure. The human operator is monitoring via Herdr; this is the communication channel.

**Herdr agent lifecycle states:** Herdr reports agents as `idle`, `working`, `blocked`, `done`, `unknown`. Use `herdr agent wait` to block on state changes rather than polling or sleeping. This is the Herdr-native replacement for `sleep`/`timeout` patterns.

**Tab creation CLI:** `herdr tab create` returns `.result.tab` and `.result.root_pane`. Read the IDs from the response — do not predict them. Use the returned pane ID for subsequent `pane run` and `pane read` commands. Verify exact syntax with `herdr tab create --help` and `herdr pane --help`.

### G3. Real-User Behavioral Testing

**No unit tests. No mocked tests.** All verification is behavioral and end-to-end against a live API, live Postgres, and live Redis.

The philosophy: simulate a real user's journey through the marketplace and payment flow — browse products, add to cart, checkout, receive webhook, inspect ledger, verify order status — while **concurrently** running adversarial workloads (webhook replays, concurrent cart edits, inventory races, forced saga failures).

Monitor all concurrent processes in real time via Herdr tabs. Use `pane read` to capture output, `agent wait` to block on state changes.

### G4. Append-Only Ledger

`LedgerPosting` and `LedgerTransaction` are **append-only**. No `UPDATE`. No `DELETE`. Enforced at the database level via revoked privileges or a trigger that raises an exception on mutation.

### G5. No Application-Level Balance Storage

Balances are always derived via aggregate query. Never store a `balance` column. A stored balance can drift; a derived balance cannot.

### G6. Database as Arbiter

Every correctness invariant (ledger balance, inventory non-negativity, order transition legality) must be enforced at the database level where technically feasible. Application-level checks are a convenience, not the guarantee.

### G7. Preserve Existing Code

The `main` branch, and any branch other than `feature/marketplace-payments`, must remain untouched. Existing modules and tables are not to be refactored or renamed. New tables are additive. Existing tables receive only nullable foreign keys where necessary.

---

## Phase 0: Research, Environment, and Branch Setup

**Status:** `DONE — 2026-10-15T17:28:29Z — c5b9ade`

> **Completion note (verified 2026-10-16):** branch `feature/marketplace-payments`
> was forked from `master` at `f27f1a6` (the HEAD at fork time — not an
> arbitrary base). Research memo `docs/research/marketplace-payments-research.md`
> carries 30 cited URLs. Herdr topology: `server` (API + injection), `db`
> (psql), `metrics` (live scrape), plus per-workload tabs created by the suite.

### Dependencies

None. This is the first phase.

### Deliverables

1. **Research memo** — `docs/research/marketplace-payments-research.md` — containing at minimum:
   - Current Stripe API v2 event semantics (thin events, idempotency key behavior, signature verification for Node.js).
   - PostgreSQL constraint-trigger syntax and `DEFERRABLE INITIALLY DEFERRED` semantics for the current version in use.
   - Prisma interactive transaction patterns and raw query syntax for `FOR UPDATE`.
   - Saga pattern reference implementations in Node.js/TypeScript.
   - Optimistic locking with Prisma (`updateMany` with version predicate).
   - Herdr CLI command reference — exact syntax for `workspace create`, `tab create`, `pane run`, `pane read`, `agent wait`, `notification show`, `worktree create`. The installed binary is the authority: run `herdr --help` and each command group without a subcommand.
   - At least five cited sources with URLs.

2. **Branch created** — `feature/marketplace-payments` forked from the current `HEAD` (not `main`). Verify and echo the source branch and source SHA in the commit message.

3. **Herdr workspace and tabs created** — the agent decides topology. Minimum: API server tab, `psql` tab, webhook simulation tab, load generation tab.

4. **Prisma migrations scaffolded** — empty migration files for the new tables.

5. **Dependencies added** — Stripe Node.js SDK, any state machine library, etc.

### Verification Steps

1. `git rev-parse --abbrev-ref HEAD` shows `feature/marketplace-payments`.
2. `git log -1 --format="%s"` on the phase-0 commit contains the source branch name and SHA it was forked from.
3. `herdr workspace list` shows the new workspace.
4. `herdr tab list` shows the created tabs.
5. `pnpm --filter @tangerine/api build` passes with zero errors on the new branch.
6. `docs/research/marketplace-payments-research.md` exists with at least five cited sources.

### Checkpoint

Run `herdr notification show "Phase 0 complete" --body "Research done, branch created, tabs running" --sound done`.

Update this document: change `**Status:** \`NOT STARTED\`` to `**Status:** \`DONE — [ISO timestamp] — [commit SHA]\``.

Commit: `chore: phase 0 — research, branch setup, Herdr orchestration`.

---

## Phase 1: Double-Entry Ledger

**Status:** `DONE — 2026-10-15T17:36:01Z — 12cdbfa`

> **Completion note (verified 2026-10-16):** `scripts/test-ledger.sh` is
> 13/13 green and now re-runnable in place (its reset also clears the
> `IdempotencyKey` rows, so a repeat run no longer replays cached responses).

### Dependencies

Phase 0 complete.

### Research Required Before Implementation

- PostgreSQL `CREATE CONSTRAINT TRIGGER` syntax and `DEFERRABLE INITIALLY DEFERRED` semantics.
- Hash chain construction for tamper detection.
- Derived balance query patterns and indexing strategy.

### Deliverables

1. **Prisma schema additions:**
   - `LedgerTransaction` — groups postings into an atomic unit.
   - `LedgerPosting` — a single debit or credit to one account.
   - `LedgerTransactionKind` enum — `CHARGE`, `REFUND`, `PAYOUT`, `PLATFORM_FEE`, `ESCROW_HOLD`, `ESCROW_RELEASE`.
   - `LedgerDirection` enum — `DEBIT`, `CREDIT`.

2. **Migration:**
   - Tables created with appropriate indexes.
   - Deferred constraint trigger firing at commit time; raises an exception if `SUM(DEBIT) - SUM(CREDIT) != 0` for any transaction.
   - `UPDATE` and `DELETE` privileges revoked on both tables from the application role.
   - Optional: hash chain columns (`previousHash`, `hash`).

3. **Service layer:**
   - `LedgerService.postTransaction(kind, sourceType, sourceId, postings[])` — inserts a transaction and its balanced postings atomically.
   - Idempotency: before inserting, check for an existing transaction with the same `(sourceType, sourceId, kind)`. If found, return it.
   - `LedgerService.getBalance(accountId)` — derived aggregate query.
   - `LedgerService.verifyIntegrity()` — walks the hash chain for an account.

4. **Prometheus metrics:**
   - `tangerine_ledger_transactions_total{kind}`
   - `tangerine_ledger_balance_imbalance_cents` (gauge, must always be 0).

5. **Behavioral test script** — `scripts/test-ledger.sh`:
   - 100 concurrent ledger transactions via a shell loop in a Herdr tab.
   - Asserts `SUM(debits) - SUM(credits) = 0` across all postings via `psql`.
   - Asserts the deferred constraint trigger never fired (Postgres logs).
   - Attempts an `UPDATE` on `LedgerPosting`; asserts it fails.

### Verification Steps

1. Run the behavioral test script.
2. Monitor the `psql` tab for the balance assertion.
3. Monitor the logs tab for trigger exceptions.
4. `herdr notification show "Phase 1 complete" --body "Ledger balance verified across 100 concurrent writes" --sound done`.

### Checkpoint

Update the status marker. Commit: `feat(ledger): double-entry ledger with deferred constraint trigger and hash chain`.

---

## Phase 2: Idempotency with Recovery Points

**Status:** `DONE — 2026-10-15T17:43:15Z — 0f21f57`

> **Completion note (verified 2026-10-16):** `scripts/test-idempotency.sh` green
> (100 concurrent duplicates collapse to one write; identical responses; crash
> recovery resumes from the recorded recovery point).

### Dependencies

Phase 1 complete (ledger is the first consumer of idempotent writes).

### Research Required Before Implementation

- Stripe's "Rocket Rides" idempotency design — atomic phases, recovery points, lease semantics.
- Stripe API idempotency key behavior — v1 vs v2, 24-hour retention, concurrent conflict handling.
- `SELECT ... FOR UPDATE` syntax in Prisma raw queries.

### Deliverables

1. **Prisma schema additions:**
   - `IdempotencyKey` — `userId`, `key`, `requestHash`, `status` (STARTED/COMPLETED/FAILED), `recoveryPoint`, `responseStatus`, `responseBody`, `lockedAt`, `expiresAt`.
   - Unique constraint on `(userId, key)`.
   - `IdempotencyStatus` enum.

2. **Service layer:**
   - `IdempotencyService.execute(userId, key, requestBody, fn)` — core handler with recovery-point tracking.
   - Handler flow: upsert the idempotency row, lock it, execute `fn` with recovery point callbacks, mark COMPLETED on success or FAILED on error (preserving recovery point).
   - Concurrent duplicate handling: `SELECT ... FOR UPDATE` on the idempotency row.
   - Lease semantics: document the lease duration and the fencing token strategy.

3. **Integration with ledger:** Every ledger write goes through the idempotency service with a key derived from the source (`sourceType:sourceId:kind`).

4. **Behavioral test script** — `scripts/test-idempotency.sh`:
   - Fires the same operation 100 times concurrently from separate shell processes.
   - Asserts exactly one ledger transaction exists.
   - Asserts the response is identical across all 100 calls.
   - Kills the process mid-execution (simulate crash after Phase 2 but before Phase 3) and verifies recovery behavior on retry.

### Verification Steps

1. Run the behavioral test script.
2. Monitor the ledger tab for transaction count.
3. Monitor API logs for recovery-point transitions.
4. Notification on completion.

### Checkpoint

Update status marker. Commit: `feat(idempotency): atomic phases and recovery points for externally-triggered operations`.

---

## Phase 3: Webhook Ingestion

**Status:** `DONE — 2026-10-15T18:01:43Z — a1ed94d`

> **Completion note (verified 2026-10-16):** `scripts/test-webhook-idempotency.sh`
> and `scripts/test-webhook-ordering.sh` green; signature verification,
> `INSERT ... ON CONFLICT DO NOTHING` dedup, and the order-independent state
> machine all hold.

### Dependencies

Phase 2 complete (webhook processing uses the idempotency service).

### Research Required Before Implementation

- Stripe webhook signature verification in Node.js — current library, `constructEvent` API, tolerance.
- Stripe v2 thin events — payload structure, idempotency on `snapshot_event_id`.
- Transactional inbox pattern — upsert on `event_id`, return 200 on conflict.
- Order-independent state machine design.

### Deliverables

1. **Prisma schema additions:**
   - `WebhookEvent` — `source`, `externalEventId`, `type`, `payload`, `status`, `receivedAt`, `processedAt`.
   - Unique constraint on `(source, externalEventId)`.
   - `WebhookEventStatus` enum (`RECEIVED`, `PROCESSED`, `FAILED`).

2. **Service layer:**
   - `WebhookService.ingest(source, rawBody, signature)` — verifies signature first, then deduplicates via `INSERT ... ON CONFLICT DO NOTHING`, then dispatches.
   - `WebhookDispatcher` — routes event types to handlers.
   - Order-independent state machine for `Payment`:
     - Transition table mapping event types to allowed current statuses and target status.
     - If current status is not in the allowed set, the event is a no-op.
   - `PaymentService.applyWebhookEvent(paymentId, eventType, payload)` — applies the transition if allowed.

3. **Prometheus metrics:**
   - `tangerine_webhook_events_total{source, type, outcome}` — outcome: `processed`, `deduped`, `failed`, `invalid_signature`.

4. **Behavioral test scripts:**
   - `scripts/test-webhook-idempotency.sh` — replay the same signed webhook 100 times; assert exactly one ledger transaction and one state transition.
   - `scripts/test-webhook-ordering.sh` — send `payment_intent.succeeded` before `payment_intent.created`; assert terminal state; send the late event; assert no-op.

### Verification Steps

1. Run both behavioral test scripts.
2. Monitor the webhook tab for request/response.
3. Monitor the ledger tab for transaction count.
4. Assert `orders_stuck_pending` metric is 0.
5. Notification on completion.

### Checkpoint

Update status marker. Commit: `feat(payments): webhook ingestion with signature verification, deduplication, and order-independent state machine`.

---

## Phase 4: Saga Orchestration for Checkout

**Status:** `DONE — 2026-10-15T18:18:07Z — 16178f4`

> **Completion note (verified 2026-10-16):** `scripts/test-saga-compensation.sh`
> (6/6) and `scripts/test-saga-failure.sh` (26/26, every step forced to fail)
> green. Failure injection is gated by `SAGA_FAILURE_INJECTION=1` and surfaced
> on `GET /api/health`; the suite fails fast if the target API lacks it.

### Dependencies

Phase 3 complete (saga uses webhook-triggered state transitions).

### Research Required Before Implementation

- Saga pattern orchestration vs choreography — when to use each.
- Compensating transaction semantics — LIFO order, idempotency of compensations.
- State machine persistence for long-running sagas.

### Deliverables

1. **Prisma schema additions:**
   - `SagaState` — `sagaType`, `status`, `currentStep`, `completedSteps` (JSONB array), `compensationsRun` (JSONB array), `context` (JSONB), `createdAt`, `updatedAt`.
   - `SagaStatus` enum (`RUNNING`, `COMPLETED`, `COMPENSATING`, `FAILED`).

2. **Orchestrator service:**
   - `SagaOrchestrator.start(sagaType, context)` — creates saga state, begins step execution.
   - Step definitions: forward action and compensation for each step.
   - On failure: run compensations in LIFO order.
   - Failure injection: a configuration flag to force a specific step to fail, for testing.

3. **Checkout saga definition:**
   - Step 1: Reserve inventory (forward: conditional UPDATE; compensation: release reservation).
   - Step 2: Charge payment (forward: Stripe PaymentIntent; compensation: refund).
   - Step 3: Write ledger (forward: insert balanced postings; compensation: reversing transaction).
   - Step 4: Confirm order (forward: UPDATE status; compensation: cancel order).
   - Step 5: Emit notification event (forward: outbox write; no compensation).

4. **Prometheus metrics:**
   - `tangerine_saga_runs_total{saga_type, status}`
   - `tangerine_saga_compensations_total{saga_type, step}`

5. **Behavioral test script** — `scripts/test-saga-compensation.sh`:
   - Configure the orchestrator to force step 3 to fail.
   - Trigger a checkout.
   - Assert: inventory released, payment refunded, order cancelled, saga status FAILED.
   - Assert compensations ran for steps 1 and 2.

### Verification Steps

1. Run the behavioral test script.
2. Monitor the saga tab for state transitions and compensation runs.
3. Monitor the inventory tab for reservation release.
4. Notification on completion.

### Checkpoint

Update status marker. Commit: `feat(saga): checkout orchestration with compensating transactions and failure injection`.

---

## Phase 5: Marketplace — Products, Inventory, Cart, Orders

**Status:** `DONE — 2026-10-15T18:11:00Z — 88146fd`

> **Completion note (verified 2026-10-16):** `test-inventory-race.sh` (100
> checkouts vs 10 units → exactly 10 succeed), `test-cart-concurrency.sh`
> (concurrent edit → 409), and `test-order-state-machine.sh` (exhaustive
> `(current, next, role)` triples) green.

### Dependencies

Phase 4 complete (checkout saga uses inventory reservation and order confirmation).

### Research Required Before Implementation

- Inventory reservation patterns — aggregate quantity contention vs row contention.
- `FOR UPDATE SKIP LOCKED` syntax and semantics for concurrent sweeper processes.
- Optimistic locking with Prisma — `updateMany` with version predicate.
- Data-driven state machine design for order lifecycle.

### Deliverables

1. **Prisma schema additions:**
   - `Product` — `practitionerId`, `name`, `description`, `priceCents`, `currency`, `category`, `active`, `isSponsored`, `conflictOfInterestNote`.
   - `InventoryItem` — `productId` (unique), `quantity`, `reserved`, `version`.
   - `Cart` — `userId` (unique), `version`.
   - `CartItem` — `cartId`, `productId`, `quantity`, `reservedUntil`.
   - `Order` — `memberId`, `status`, `totalCents`, `currency`, `paymentId`, `shippingAddress`, timestamps.
   - `OrderItem` — `orderId`, `productId`, `productName` (snapshot), `quantity`, `unitPriceCents` (snapshot).
   - `OrderStateTransition` — `orderId`, `fromStatus`, `toStatus`, `actorRole`, `actorId`, `createdAt`.
   - Enums for order status.

2. **Service layer:**
   - `InventoryService.reserve(productId, quantity)` — conditional UPDATE; returns success/failure.
   - `InventoryService.release(productId, quantity)` — compensating action.
   - `InventoryService.sweepExpired()` — background job releasing stale reservations with `FOR UPDATE SKIP LOCKED`.
   - `CartService.addItem(cartId, productId, quantity, expectedVersion)` — optimistic locking.
   - `OrderService.createFromCart(memberId, cartId)` — initiates the checkout saga.
   - `OrderService.transition(orderId, nextStatus, actorRole, actorId)` — validates against the transition table; appends to `OrderStateTransition`.

3. **Order state machine — data-driven transition table:**
   - `PENDING` → `PAID`, `CANCELLED`
   - `PAID` → `FULFILLING`, `REFUNDED`
   - `FULFILLING` → `SHIPPED`, `CANCELLED`
   - `SHIPPED` → `DELIVERED`
   - `DELIVERED` → `RETURNED`
   - `RETURNED` → `REFUNDED`
   - Terminal: `REFUNDED`, `CANCELLED`

4. **Prometheus metrics:**
   - `tangerine_inventory_reservations_total{outcome}`
   - `tangerine_cart_conflicts_total`
   - `tangerine_order_transitions_total{from, to, legal}`

5. **Behavioral test scripts:**
   - `scripts/test-inventory-race.sh` — 100 concurrent checkouts for 10 units; assert exactly 10 succeed.
   - `scripts/test-cart-concurrency.sh` — two concurrent cart edits with same version; assert one gets 409.
   - `scripts/test-order-state-machine.sh` — exhaustive transition testing for every `(current, next, role)` triple.

### Verification Steps

1. Run all three behavioral test scripts.
2. Monitor the inventory tab for reservation counts.
3. Monitor the cart tab for conflict counts.
4. Monitor the orders tab for state transitions.
5. Notification on completion.

### Checkpoint

Update status marker. Commit: `feat(marketplace): products, inventory reservation, optimistic cart locking, and order state machine`.

---

## Phase 6: Integration and Adversarial Testing

**Status:** `DONE — 2026-10-15T18:29:19Z — 4279e8d`

> **Completion note (verified 2026-10-16):** `scripts/herdr-test-suite.sh`
> reports **14/14 green** (ledger, idempotency, webhook idempotency/ordering,
> inventory race/exhaustion, cart concurrency, order state machine, saga
> compensation/failure, e2e purchase, out-of-order, concurrent ledger, webhook
> replay). Grafana dashboard carries ledger/webhook/saga/inventory/cart/order
> panels. Workloads share one database, so the suite runs them sequentially.

### Dependencies

All previous phases complete.

### Deliverables

1. **End-to-end purchase flow test** — `scripts/test-e2e-purchase.sh`:
   - Browse products → add to cart → checkout → receive webhook → verify order status → verify ledger balance → verify inventory decremented.

2. **Adversarial workload scripts:**
   - `scripts/test-webhook-replay.sh` — 100 replays of the same webhook.
   - `scripts/test-out-of-order.sh` — shuffled webhook delivery.
   - `scripts/test-saga-failure.sh` — force each step to fail; assert compensations.
   - `scripts/test-concurrent-ledger.sh` — 100 concurrent ledger writes; assert balance.
   - `scripts/test-inventory-exhaustion.sh` — drain inventory; assert `reserved <= quantity`.

3. **Monitoring dashboard update** — Grafana JSON updated with new panels for ledger, webhooks, sagas, inventory, carts, orders.

4. **Herdr orchestration script** — `scripts/herdr-test-suite.sh`:
   - Creates tabs for each concurrent workload.
   - Runs all workloads in parallel.
   - Waits for completion via `herdr agent wait`.
   - Collects results.
   - Sends notification on completion or failure.

### Verification Steps

1. Run the full test suite via the Herdr orchestration script.
2. Monitor all tabs simultaneously.
3. Assert every invariant holds.
4. Capture screenshots of the Grafana dashboard.

### Checkpoint

Update status marker. Commit: `test: end-to-end behavioral test suite with Herdr orchestration`.

---

## Phase 7: Documentation and Optimization Write-Ups

**Status:** `DONE — 2026-10-15T18:36:42Z — e007111`

> **Completion note (verified 2026-10-16):** `docs/performance/payments.md` and
> `docs/performance/marketplace.md` follow hypothesis → methodology → results →
> analysis → optimization; `optimization-log.md`, the README testing section,
> and the research memo are complete.

### Dependencies

Phase 6 complete.

### Deliverables

1. **`docs/performance/payments.md`** — hypothesis → methodology → results → analysis → optimization.
2. **`docs/performance/marketplace.md`** — same format.
3. **`docs/performance/optimization-log.md`** — append new entries (including rejected approaches).
4. **`README.md`** update — new API endpoints, new testing instructions, new metrics.
5. **`docs/research/marketplace-payments-research.md`** — final research memo with all citations.

### Verification Steps

1. Review all documentation for completeness.
2. Ensure every claim has a measurement or citation.
3. Ensure every invariant has a behavioral test.
4. Notification on completion.

### Checkpoint

Update status marker. Commit: `docs: performance write-ups and API documentation for marketplace and payments`.

---

## Phase Status Summary (for Resumability)

| Phase | Status | Commit SHA | Timestamp |
|---|---|---|---|
| 0 — Research & Setup | `DONE` | `c5b9ade` | 2026-10-15T17:28:29Z |
| 1 — Ledger | `DONE` | `12cdbfa` | 2026-10-15T17:36:01Z |
| 2 — Idempotency | `DONE` | `0f21f57` | 2026-10-15T17:43:15Z |
| 3 — Webhooks | `DONE` | `a1ed94d` | 2026-10-15T18:01:43Z |
| 4 — Saga | `DONE` | `16178f4` | 2026-10-15T18:18:07Z |
| 5 — Marketplace | `DONE` | `88146fd` | 2026-10-15T18:11:00Z |
| 6 — Integration | `DONE` | `4279e8d` | 2026-10-15T18:29:19Z |
| 7 — Documentation | `DONE` | `e007111` | 2026-10-15T18:36:42Z |

### Reconciliation note (2026-10-16)

The eight phase commits above already lived on this branch (`HANDOFF.md` was
the driving document). This `HANDOFF-2.md` pass re-derived the requirements,
then **verified** each phase end-to-end against a live API + Postgres + Redis
and closed three gaps found in the process:

1. `apps/api/package.json` now runs `prisma generate` before `nest build`
   (`prebuild`), so a stale generated client can no longer break the build.
2. `scripts/test-ledger.sh` resets `IdempotencyKey` too, making it re-runnable
   in place (previously a second run replayed cached responses).
3. `scripts/herdr-test-suite.sh` fails fast with instructions when the target
   API lacks `SAGA_FAILURE_INJECTION=1` (now advertised on `GET /api/health`),
   replacing a silent 12/14.

Full behavioral suite re-run on 2026-10-16: **14/14 green.**

---

## Reference Library

Consult these during research, but verify current behavior via web search before implementing.

### Idempotency

- Brandur Leach (Stripe), "Implementing Stripe-like Idempotency Keys in Postgres" — atomic phases, recovery points, lease semantics.
- Stripe API docs, "Idempotent Requests" — v1 vs v2 semantics.
- IETF httpapi WG draft — `Idempotency-Key` HTTP header standardization.

### Double-Entry Ledger

- Formance, "How Not to Build a Ledger" — anti-patterns and the correct append-only model.
- Modern Treasury, "Accounting for Developers" — double-entry for engineers, lock versions, reconciliation.
- PostgreSQL docs, "CREATE CONSTRAINT TRIGGER" — deferred semantics.
- `aleksastajic/banking-ledger-api` — reference implementation with hash chain.

### Webhooks

- Stripe docs, "Webhooks Best Practices" — signature verification, idempotency, order-independence.
- Stripe docs, "Migrate from snapshot events to thin events" — v2 event design.
- `icaroholding/aex`, ADR 0022 — transactional inbox + idempotency key.

### Saga Pattern

- AWS Samples, "Saga pattern" — choreography vs orchestration, compensation semantics.
- Microsoft, "Reference 6: A Saga on Sagas" — original patterns, LIFO compensation.
- Chris Richardson, "Microservices Patterns" — Chapter 4 covers sagas in depth.

### Inventory & Concurrency

- IBM Sterling Order Management, "Optimistic Lock Avoidance" — hot-SKU handling.
- Redis docs, "WATCH/MULTI/EXEC" — optimistic locking for the fast-path Redis reservation check.

### Herdr

- `herdr --help` and `herdr <command-group>` — the installed binary is the authority for command syntax.
- Herdr concepts: workspaces, tabs, panes, agents, sessions.
- Herdr agent automation: `workspace create`, `tab create`, `pane run`, `pane read`, `agent wait`, `notification show`.
- Herdr worktree: `herdr worktree create --branch <name> --base HEAD` (verify flag with `--help`).

### Architectural Posture

- Shopify Engineering, "Deconstructing the Monolith" — modular monolith at scale.
- Klarna Engineering, "Post-mortem: Microservices migration" — distributed monolith worse than either extreme.
- Uber Engineering, "Domain-Oriented Microservice Architecture" — cost of retrofitting boundaries.

---

## Final Notes for the Agent

**You have full autonomy over code structure, naming, file organization, and implementation details.** The constraints above are about correctness, process, and architecture — not style.

**When in doubt, prefer the design that makes the invariant structurally impossible to violate** over the design that relies on application-level discipline.

**Research before you code.** The Stripe API, PostgreSQL version, Prisma version, and Herdr CLI all have specific current behaviors that may differ from training data. Verify before implementing. If you cannot find an authoritative source, ask the human operator via `herdr notification show`.

**Use Herdr notifications.** The human operator is monitoring via Herdr. When a phase completes, when a test fails, when you are blocked — send a notification. This is the communication channel.

**Leave the codebase better than you found it.** If you find a bug in existing code that affects your work, fix it and note it in the commit message.

**The branch is the deliverable.** At the end, `feature/marketplace-payments` — forked from the current `HEAD`, not `main` — should be ready for review and merge.

---

**End of handoff document.**
