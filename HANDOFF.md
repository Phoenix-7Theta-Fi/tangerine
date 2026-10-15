# Handoff Document: Marketplace + Payments & Billing for Tangerine

**Document type:** Phased implementation spec with resumable checkpoints
**Target agent:** Autonomous AI coding agent
**Repository:** Tangerine monorepo (modular monolith)
**Branch:** New dedicated branch — existing `main` is read-only reference
**Testing paradigm:** Real-user behavioral simulation via Herdr terminal multiplexer
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

## Global Constraints (Apply to Every Phase)

### G1. Branch Isolation

Before any code is written, create a new branch from `main`. Every commit goes to this branch. The `main` branch must remain untouched. At the end of the project, the branch is ready for review and merge.

Use Herdr's native worktree support: `herdr worktree create --branch feature/marketplace-payments --base main` creates a git worktree checkout, opens it as a Herdr workspace, and groups it with the parent repo workspace. This gives the feature its own checkout, its own tabs, and its own panes without disturbing the main checkout.

The branch name: `feature/marketplace-payments`. All work — code, migrations, docs, test scripts — lives on this branch.

### G2. Mandatory Research Before Implementation

**Before implementing any phase, the agent must perform web research.** Training data is stale. The agent must verify:

- **Stripe API current state**: v1 vs v2 event semantics, idempotency key behavior, thin event payloads, signature verification library for Node.js.
- **PostgreSQL constraint triggers**: `DEFERRABLE INITIALLY DEFERRED` syntax and semantics in the current major version.
- **Prisma transaction patterns**: interactive transactions, isolation levels, `FOR UPDATE` raw query syntax.
- **Saga pattern implementations**: current reference implementations in Node.js/TypeScript, state machine libraries, or hand-rolled orchestrators.
- **Optimistic locking with Prisma**: `updateMany` with version predicates, `SELECT ... FOR UPDATE` via `$queryRaw`.
- **Herdr CLI**: exact syntax for `workspace create`, `tab create`, `pane run`, `pane read`, `agent start`, `agent wait`, `notification show`, `worktree create`. Run `herdr --help` and the relevant command group without a subcommand to learn current syntax. The installed binary is the authority.

**Research methodology:**

1. Search official documentation first (Stripe docs, PostgreSQL docs, Prisma docs, Herdr docs).
2. Search engineering blogs from companies that have solved the problem (Stripe, Shopify, Uber, Airbnb).
3. Search GitHub for reference implementations. Look for well-starred repositories with recent commits.
4. Cite sources in a `docs/research/` directory or in code comments where the reference directly informs a design decision.
5. If a design decision is uncertain, document the uncertainty and the chosen approach with reasoning.

**Do not guess.** If the agent is unsure about an API contract, it must search for the answer.

### G3. Herdr Terminal Orchestration

All testing and monitoring uses **Herdr tabs**, not panes within a single tab. The reasoning: panes within one tab compress into a single view and are hard to monitor. Tabs are separate views within a workspace, and the agent can create as many as needed.

**The agent has full autonomy over tab topology.** It decides how many tabs, what each tab contains, and how to organize them. It may create a workspace with:

- A `server` tab running `pnpm dev:api`
- A `db` tab running `psql` for invariant assertions
- A `redis` tab running `redis-cli monitor`
- A `logs` tab tailing API and Postgres logs
- A `metrics` tab watching Prometheus scrape output
- A `webhooks` tab running the webhook simulator
- A `load` tab running k6 or curl loops
- A `notify` tab for Herdr notification routing

**Herdr notification system:** Herdr's notification system (`herdr notification show`) delivers native system notifications with configurable sound and position. Use this to signal phase completion, blocked states, and test failures. The agent should configure notifications so the human operator is alerted when a phase completes or when a test assertion fails.

**Herdr agent lifecycle states:** Herdr recognizes agents inside panes and reports `idle`, `working`, `blocked`, `done`, `unknown`. Use `herdr agent wait` to wait for an agent to reach a specific state rather than polling or using timeouts. This is the Herdr-native replacement for `sleep` and `timeout` patterns.

**Tab creation CLI:** `herdr tab create` returns `.result.tab` and `.result.root_pane`. Read IDs from the response — do not predict them. Use the returned pane ID for subsequent `pane run` and `pane read` commands.

### G4. Real-User Behavioral Testing

**No unit tests. No mocked tests.** All verification is behavioral and end-to-end against a live API, live Postgres, and live Redis.

The testing philosophy: simulate a real user's journey through the marketplace and payment flow — browse products, add to cart, checkout, receive webhook, inspect ledger, verify order status — while **concurrently** running adversarial workloads (webhook replays, concurrent cart edits, inventory races, forced saga failures).

Monitor all concurrent processes in real-time via Herdr tabs. Use `pane read` to capture output from each tab, and `agent wait` to block on state changes rather than sleeping.

### G5. Append-Only Ledger

The `LedgerPosting` and `LedgerTransaction` tables are **append-only**. No `UPDATE`. No `DELETE`. This is non-negotiable and must be enforced at the database level via revoked privileges or a trigger that raises an exception on mutation.

### G6. No Application-Level Balance Storage

Balances are always derived via aggregate query. Never store a `balance` column. A stored balance is a cache that can drift; a derived balance cannot.

### G7. Database as Arbiter

Every correctness invariant (ledger balance, inventory non-negativity, order transition legality) must be enforced at the database level where technically feasible. Application-level checks are a convenience, not the guarantee.

---

## Phase 0: Research, Environment, and Branch Setup

**Status:** `DONE — 2026-10-15T22:59:00Z — c5b9ade`

### Dependencies

None. This is the first phase.

### Deliverables

1. **Research memo** — `docs/research/marketplace-payments-research.md` — containing:
   - Current Stripe API v2 event semantics (thin events, idempotency key behavior, signature verification for Node.js).
   - PostgreSQL constraint trigger syntax and `DEFERRABLE INITIALLY DEFERRED` semantics.
   - Prisma interactive transaction patterns and raw query syntax for `FOR UPDATE`.
   - Saga pattern reference implementations.
   - Herdr CLI command reference (exact syntax for `workspace create`, `tab create`, `pane run`, `pane read`, `agent wait`, `notification show`, `worktree create`).
   - Citations with URLs.

2. **Branch and worktree created** — `feature/marketplace-payments` from `main`.

3. **Herdr workspace and tabs created** — the agent decides topology. At minimum:
   - A tab running the API server.
   - A tab running a `psql` session for invariant assertions.
   - A tab for webhook simulation.
   - A tab for load generation.

4. **Prisma migrations scaffolded** — empty migration files for the new tables, ready for schema definition.

5. **Dependencies identified and added** — Stripe Node.js SDK, any state machine library, etc.

### Verification Steps

1. `git branch` shows `feature/marketplace-payments` is checked out.
2. `herdr workspace list` shows the new workspace.
3. `herdr tab list` shows the tabs created.
4. `pnpm --filter @tangerine/api build` passes with zero errors on the new branch.
5. The research memo exists and contains at least five cited sources.

### Checkpoint

Run `herdr notification show "Phase 0 complete" --body "Research done, branch created, tabs running" --sound done`.

Update this document: change `**Status:** \`NOT STARTED\`` to `**Status:** \`DONE — [ISO timestamp] — [commit SHA]\``.

Commit: `chore: phase 0 — research, branch setup, Herdr orchestration`.

---

## Phase 1: Double-Entry Ledger

**Status:** `DONE — 2026-10-15T17:35:53Z — 12cdbfa`

### Dependencies

Phase 0 complete.

### Research Required Before Implementation

- PostgreSQL `CREATE CONSTRAINT TRIGGER` syntax and deferred semantics.
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
   - **Deferred constraint trigger** that fires at commit time and raises an exception if `SUM(DEBIT) - SUM(CREDIT) != 0` for any transaction.
   - **Revoke UPDATE and DELETE** privileges on both tables from the application role.
   - Optional: hash chain columns (`previousHash`, `hash`).

3. **Service layer:**
   - `LedgerService.postTransaction(kind, sourceType, sourceId, postings[])` — inserts a transaction and its balanced postings in one atomic unit.
   - Idempotency: before inserting, check for an existing transaction with the same `(sourceType, sourceId, kind)`. If it exists, return it.
   - `LedgerService.getBalance(accountId)` — derived aggregate query.
   - `LedgerService.verifyIntegrity()` — walks the hash chain for an account and detects tampering.

4. **Prometheus metrics:**
   - `tangerine_ledger_transactions_total{kind}`
   - `tangerine_ledger_balance_imbalance_cents` (gauge — must always be 0).

5. **Behavioral test script** — `scripts/test-ledger.sh`:
   - Creates 100 concurrent ledger transactions via a shell loop in a Herdr tab.
   - Asserts `SUM(debits) - SUM(credits) = 0` across all postings via `psql`.
   - Asserts the deferred constraint trigger never fired (check Postgres logs).
   - Attempts an `UPDATE` on `LedgerPosting` and asserts it fails.

### Verification Steps

1. Run the behavioral test script.
2. Monitor the `psql` tab for the balance assertion.
3. Monitor the logs tab for any trigger exceptions.
4. `herdr notification show "Phase 1 complete" --body "Ledger balance invariant verified across 100 concurrent writes" --sound done`.

### Checkpoint

Update the status marker. Commit: `feat(ledger): double-entry ledger with deferred constraint trigger and hash chain`.

---

## Phase 2: Idempotency with Recovery Points

**Status:** `DONE — 2026-10-15T17:42:29Z — 0f21f57`

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
   - `IdempotencyService.execute(userId, key, requestBody, fn)` — the core handler with recovery point tracking.
   - The handler flow: upsert the idempotency row, lock it, execute `fn` with recovery point callbacks, mark COMPLETED on success or FAILED on error (preserving recovery point).
   - Concurrent duplicate handling: `SELECT ... FOR UPDATE` on the idempotency row.
   - Lease semantics: document the lease duration and the fencing token strategy.

3. **Integration with ledger:** Every ledger write goes through the idempotency service with a key derived from the source (`sourceType:sourceId:kind`).

4. **Behavioral test script** — `scripts/test-idempotency.sh`:
   - Fires the same operation 100 times concurrently from separate shell processes.
   - Asserts exactly one ledger transaction exists.
   - Asserts the response is identical across all 100 calls (cached response).
   - Kills the process mid-execution (simulate crash after Phase 2 but before Phase 3) and verifies recovery behavior on retry.

### Verification Steps

1. Run the behavioral test script.
2. Monitor the ledger tab for transaction count.
3. Monitor the API logs for recovery point transitions.
4. Notification on completion.

### Checkpoint

Update status marker. Commit: `feat(idempotency): atomic phases and recovery points for externally-triggered operations`.

---

## Phase 3: Webhook Ingestion

**Status:** `NOT STARTED`

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
   - **Order-independent state machine** for `Payment`:
     - Transition table mapping event types to allowed current statuses and target status.
     - If current status is not in the allowed set, the event is a no-op.
   - `PaymentService.applyWebhookEvent(paymentId, eventType, payload)` — applies the transition if allowed, records the change.

3. **Prometheus metrics:**
   - `tangerine_webhook_events_total{source, type, outcome}` — outcome: `processed`, `deduped`, `failed`, `invalid_signature`.

4. **Behavioral test scripts:**
   - `scripts/test-webhook-idempotency.sh` — replay the same signed webhook 100 times; assert exactly one ledger transaction and one state transition.
   - `scripts/test-webhook-ordering.sh` — send `payment_intent.succeeded` before `payment_intent.created`; assert terminal state is correct; send the late event; assert no-op.

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

**Status:** `NOT STARTED`

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
   - `SagaOrchestrator.start(sagaType, context)` — creates the saga state, begins step execution.
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

**Status:** `NOT STARTED`

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

**Status:** `NOT STARTED`

### Dependencies

All previous phases complete.

### Deliverables

1. **End-to-end purchase flow test** — `scripts/test-e2e-purchase.sh`:
   - Browse products → add to cart → checkout → receive webhook → verify order status → verify ledger balance → verify inventory decremented.

2. **Adversarial workload scripts:**
   - `scripts/test-webhook-replay.sh` — 100 replays of the same webhook.
   - `scripts/test-out-of-order.sh` — shuffled webhook delivery.
   - `scripts/test-saga-failure.sh` — force each step to fail, assert compensations.
   - `scripts/test-concurrent-ledger.sh` — 100 concurrent ledger writes, assert balance.
   - `scripts/test-inventory-exhaustion.sh` — drain inventory, assert `reserved <= quantity`.

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

**Status:** `NOT STARTED`

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
| 0 — Research & Setup | `DONE` | `c5b9ade` | 2026-10-15T22:59:00Z |
| 1 — Ledger | `DONE` | `12cdbfa` | 2026-10-15T17:35:53Z |
| 2 — Idempotency | `DONE` | `0f21f57` | 2026-10-15T17:42:29Z |
| 3 — Webhooks | `NOT STARTED` | | |
| 4 — Saga | `NOT STARTED` | | |
| 5 — Marketplace | `NOT STARTED` | | |
| 6 — Integration | `NOT STARTED` | | |
| 7 — Documentation | `NOT STARTED` | | |

---

## Reference Library

The agent should consult these during research, but must independently verify current behavior via web search before implementing.

### Idempotency

- Brandur Leach (Stripe), "Implementing Stripe-like Idempotency Keys in Postgres" — atomic phases, recovery points, lease semantics.
- Stripe API documentation, "Idempotent Requests" — v1 vs v2 semantics.
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
- Herdr worktree: `herdr worktree create --branch <name> --base main` creates a git worktree checkout, opens it as a Herdr workspace.

### Architectural Posture

- Shopify Engineering, "Deconstructing the Monolith" — modular monolith at scale.
- Klarna Engineering, "Post-mortem: Microservices migration" — distributed monolith worse than either extreme.
- Uber Engineering, "Domain-Oriented Microservice Architecture" — cost of retrofitting boundaries.

---

## Final Notes for the Agent

**You have full autonomy over code structure, naming, file organization, and implementation details.** The constraints above are about correctness, process, and architecture — not style.

**When in doubt, prefer the design that makes the invariant structurally impossible to violate** over the design that relies on application-level discipline.

**Do not skip research.** The Stripe API, PostgreSQL version, Prisma version, and Herdr CLI all have specific current behaviors that may differ from training data. Verify before implementing.

**Use Herdr notifications.** The human operator is monitoring via Herdr. When a phase completes, when a test fails, when you are blocked — send a notification. This is the communication channel.

**Leave the codebase better than you found it.** If you find a bug in existing code that affects your work, fix it and note it in the commit message.

**The branch is the deliverable.** At the end, `feature/marketplace-payments` should be ready for review and merge into `main`.

---

**End of handoff document.**
