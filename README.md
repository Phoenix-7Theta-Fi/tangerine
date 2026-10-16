# Tangerine

A social health platform demo: a **feed** and **realtime chat** for members,
practitioners and providers. This is not a finished product — it is a focused,
opinionated slice built to show how I design and ship backend systems: correct
data models, the right abstractions at the right time, tests, and code you can
hand to another engineer.

Onboarding, signup and compliance flows are **deliberately abstracted away**
(see [What is intentionally out of scope](#what-is-intentionally-out-of-scope));
payments and the marketplace are now in scope (see [Engineering
highlights](#engineering-highlights)).
Identity is mocked with a user switcher so the interesting problems — feed
fan-out and realtime messaging — stay front and centre.

```
┌────────────────────────┐        REST (x-user-id)         ┌──────────────────────────┐
│  React + Vite + TS      │ ───────────────────────────────▶│  NestJS on Fastify       │
│  dark-only UI           │ ◀───────────────────────────────│  (modular monolith)      │
│  Feed · Chat            │        Socket.IO (realtime)     │  Prisma · ioredis        │
└────────────────────────┘                                  └───────────┬──────────────┘
                                                                        │
                                                     ┌──────────────────┴──────────────────┐
                                                     │                                     │
                                              ┌──────▼──────┐                      ┌───────▼───────┐
                                              │ PostgreSQL  │  source of truth     │    Redis      │  derived: timelines,
                                              │  (Prisma)   │                      │               │  presence, pub/sub
                                              └─────────────┘                      └───────────────┘
```

## Stack

| Layer      | Choice                              | Why                                                             |
| ---------- | ----------------------------------- | --------------------------------------------------------------- |
| Frontend   | React 18 + Vite + TypeScript        | Fast, typed, no framework overhead for two screens              |
| Backend    | **NestJS** on the **Fastify** adapter | Real application architecture (modules, DI, guards, gateways) with Fastify's throughput underneath |
| Database   | PostgreSQL 18 + **Prisma**          | Relational source of truth; typed client and real migrations    |
| Cache/RT   | Redis 7 + ioredis + Socket.IO adapter | Materialized timelines, presence TTLs, cross-instance fan-out |
| Realtime   | Socket.IO gateways                  | Rooms, acks, and a Redis adapter for horizontal scale          |
| Infra      | Docker Compose, pnpm workspaces     | One command to start everything; clean monorepo boundaries      |

Stack decisions, trade-offs and scaling limits are documented in
[docs/architecture.md](docs/architecture.md).

## Quick start

```bash
# 1. Postgres + Redis
docker compose up -d

# 2. Install (pnpm workspace)
pnpm install

# 3. Schema + demo data
pnpm db:migrate
pnpm db:seed

# 4. Run the API (http://localhost:3001, docs at /docs) and the web app (http://localhost:5173)
pnpm dev:api
pnpm dev:web
```

The API reads `apps/api/.env` (see `.env.example`). The web app reads
`VITE_API_URL` and defaults to `http://localhost:3001`.

## Engineering highlights

These are the parts worth reading. Each is a deliberate answer to a real
system-design problem, not decoration.

### Feed — hybrid fan-out with keyset pagination

The read-to-write ratio on a feed is ~100:1, so the default is to precompute
reads. But pure fan-out-on-write collapses the moment one author has a huge
following: a single post becomes millions of cache writes ("the celebrity
problem").

- **Push for normal authors** — `TimelineService.fanoutPost` inserts a post
  *pointer* into every follower's Redis sorted set (`timeline:{userId}`), scored
  by publish time, trimmed to a bounded length. Reads are one `ZREVRANGE`.
- **Pull for celebrities** — authors whose `followerCount` crosses a threshold
  are flagged `isCelebrity`; their posts are **not** pushed. At read time
  `FeedService` merges the pushed timeline with a bounded pull of each celebrity
  followee's outbox. The threshold is a single tunable (`CELEBRITY_FOLLOWER_THRESHOLD`).
- **Pointers, not copies** — timelines store post ids, so edits/deletes and
  counter changes never rewrite millions of timelines; content is hydrated at
  read time.
- **Graceful degradation** — a cold cache (or a brand-new follow) falls back to
  a bounded read-time backfill from Postgres, so the feed is never empty.
- **Keyset (cursor) pagination, never offsets** — offsets break when new posts
  arrive at the top. Cursors encode a stable `(createdAt, id)` position.

Try it: the seed flags two practitioners as celebrities. Post as one of them and
watch the post appear in a follower's feed via the *pull* path (the timeline
cache never receives it).

### Async fan-out — transactional outbox + worker

Fan-out is unbounded in follower count, so it must never sit in the request path.
Rather than the classic dual-write bug (write the post, *then* enqueue — and lose
the enqueue if the process dies), the post and its fan-out intent commit **in one
transaction**:

1. `POST /posts` writes the `Post` **and** an `OutboxEvent` in the same Prisma
   transaction, then returns. It never touches follower timelines.
2. An **outbox relay** polls pending rows and publishes them to a **BullMQ**
   queue. It claims rows with `FOR UPDATE SKIP LOCKED`, so any number of API
   instances relay concurrently with no coordination, and `jobId = eventId`
   makes publishing idempotent across crashes.
3. A **BullMQ worker** performs the fan-out with exponential-backoff retries.
   Fan-out is idempotent by construction (a timeline is a sorted set keyed by post
   id), so at-least-once delivery is safe. After the final attempt the event is
   marked `FAILED` — a durable dead-letter row, not a lost job.

`GET /api/metrics` exposes the two numbers you actually alert on: **outbox lag**
(age of the oldest pending event) and **queue depth** by state.

### Chat — ordering and idempotency are the server's job

- **Server-assigned sequence.** Each conversation has a monotonic `lastSeq`,
  advanced with an atomic `UPDATE … increment` (a row lock). Concurrent sends
  can never collide on `seq` without application-level locking, and every
  participant sees the same order — client clocks are never trusted.
- **Idempotent sends.** A `clientMsgId` unique per sender is the retry key. A
  duplicate send returns the original message instead of inserting a second one;
  a lost idempotency race is resolved by returning the winner.
- **Store-and-forward.** Messages are persisted first; a client that was offline
  catches up via `GET /conversations/:id/messages?cursor=<seq>`. The WebSocket
  push is an optimization, the pull is the guarantee.
- **Read receipts as a cursor.** One integer per member per conversation
  (`lastReadSeq`), advanced with `GREATEST` so out-of-order acks never regress it.
- **Presence via TTL.** A Redis key with a 60s TTL refreshed by heartbeats. A
  dropped connection simply expires — no disconnect bookkeeping, robust to
  crashes and network partitions.
- **Scale-out.** The Socket.IO Redis adapter lets any API instance deliver an
  event to a socket held by another instance.

### Scheduling & booking — the database arbitrates contention

A booking race is a correctness problem disguised as a performance problem. The
obvious implementation — read the calendar, check for an overlap, insert — is a
check-then-insert race that silently double-books under concurrency. Tangerine
makes the **database** the arbiter:

- **One exclusion constraint owns the invariant.** A single PostgreSQL `EXCLUDE
  USING gist` constraint over `(practitionerId, tstzrange(startTime, endTime))`
  covers both firm bookings *and* soft holds, so no two live reservations can
  overlap. The loser of a race gets SQLSTATE `23P01`, which the API translates
  to a clean `409` — never application-level locking.
- **Holds are bookings with an expiry**, not a second table. That is the whole
  reason a hold can block a booking atomically: they share one exclusion index.
  A hold is released by flipping its status, which instantly frees the slot.
- **Idempotent mutations.** `reschedule` and `cancel` take a client `opId`; the
  first request records its result in an idempotency ledger keyed by
  `(userId, opId)`, and a retry returns the recorded result instead of moving
  the booking twice.
- **Contention is serialized on the contended slot, not retried.** A GiST
  exclusion index deadlocks under a multi-way race (a documented PostgreSQL
  limitation), so booking takes a transaction-scoped **advisory lock keyed by
  `(practitioner, startTime)`** before the insert. The constraint stays as the
  backstop; the lock removes the deadlock. Benchmark: 200/200 races with exactly
  one winner and zero `5xx` (baseline: 230 `5xx`).
- **Timezone-aware slots.** Availability is stored as the practitioner's local
  wall clock plus an IANA zone; slot lookup expands it to UTC instants (DST and
  all) and subtracts live reservations, with an optional `maxSlots` cap.
- **Confirmation rides the outbox.** A confirmed booking emits
  `booking.confirmed` through the same transactional outbox as post fan-out, so
  the notification pipeline can consume it durably.

The benchmarks in `docs/performance/` prove the invariants under load — and
expose what actually breaks first (the connection pool, not the constraint).

### Payments — money invariants live in the database

Payments are a correctness problem, so the invariants are pushed as far down as
they can go and the API is a thin layer on top:

- **Double-entry ledger, enforced by Postgres.** `LedgerTransaction` groups
  postings; a **deferred constraint trigger** raises at `COMMIT` unless
  `SUM(DEBIT) − SUM(CREDIT) = 0`, so even a direct `INSERT` that bypasses the API
  is rejected. Row triggers plus `REVOKE UPDATE, DELETE` make both tables
  **append-only**. Balances are always *derived* by aggregation — a stored
  balance is a cache that can drift; a sum cannot.
- **Tamper-evident hash chain.** Each transaction carries `previousHash` and a
  SHA-256 over a canonical encoding of its legs, extended under a
  transaction-scoped advisory lock so `seq` is gap-free. `GET /api/ledger/verify`
  walks the chain and reports the first broken link.
- **Exactly-once writes.** A generic `IdempotencyService` (claim → run → finalize,
  with a lease and a fencing token) records the response keyed by
  `(userId, key)`; a retry replays it, and a **recovery point** lets a retry after
  a crash resume rather than restart. A reused key with a different body is a
  `409`.
- **At-least-once webhooks, handled once.** `POST /api/webhooks/stripe`
  verifies the signature over the **raw body**, deduplicates through a
  transactional inbox (`WebhookEvent`, unique on `source + eventId`), and applies
  an **order-independent** payment state machine — a late `created` after
  `succeeded` is a no-op, and `succeeded` before `created` still lands.

Behavioral proof (`docs/performance/payments.md`): 100 concurrent balanced
writes leave imbalance `0` with zero trigger exceptions; 100 concurrent
duplicate requests produce one ledger transaction and one replayed response; 100
webhook replays produce one inbox row, one transition, and one ledger entry.

### Marketplace — contention, each problem at its own layer

- **Inventory is a hot-row count.** Reservation is one conditional `UPDATE`
  (`WHERE quantity - reserved >= n`), so the predicate and the increment are
  atomic under the row lock and `reserved ≤ quantity` is unrepresentable to
  break. 100 checkouts for 10 units yield **exactly 10 winners**.
- **Cart uses optimistic locking.** Every edit presents the version it read;
  `UPDATE ... WHERE version = ?` matching zero rows *is* the conflict, surfaced as
  `409`.
- **Orders are a data-driven state machine.** A transition table maps each status
  to its legal successors; illegal moves are rejected and counted, and every
  applied change is appended to `OrderStateTransition`.
- **Checkout is an orchestrated saga.** `reserve → charge → ledger → confirm →
  notify`, with **LIFO compensations** (release, refund, reversing entry) and an
  `onFailure` hook that cancels an unconfirmed order. Step progress is persisted
  in `SagaState`, and failures are injectable for testing.

Behavioral proof (`docs/performance/marketplace.md`): the inventory race, the
cart conflict, all 192 order-transition triples, and forcing each saga step to
fail (asserting the exact compensation set).

### Backend craft

- Modular monolith with clear boundaries (`users`, `follow`, `posts`, `feed`,
  `timeline`, `chat`, `realtime`, `redis`, `prisma`) and no import cycles —
  fan-out lives in its own module precisely so the feed can depend on posts
  without a cycle.
- **Prisma transactions** keep denormalized counters consistent with the writes
  that change them.
- Global validation pipe, a single error-envelope filter, and translation of
  Prisma errors to correct HTTP codes.
- Swagger generated from DTOs at `/docs`.

## API surface

All routes are under `/api` and authenticate with the mock `x-user-id` header.
Full, interactive docs at `http://localhost:3001/docs`.

| Area    | Endpoints                                                                 |
| ------- | ------------------------------------------------------------------------- |
| Session | `GET /session/identities` (demo-only, unauthenticated)                    |
| Users   | `GET /users`, `GET /users/me`, `GET /users/:id`, `POST/DELETE /users/:id/follow` |
| Posts   | `POST /posts`, `GET/DELETE /posts/:id`, `POST/DELETE /posts/:id/like`, `GET/POST /posts/:id/comments`, `GET /users/:id/posts` |
| Feed    | `GET /feed?limit&cursor`                                                   |
| Chat    | `GET /conversations`, `POST /conversations/direct`, `GET/POST /conversations/:id/messages`, `POST /conversations/:id/read` |
| Scheduling | `GET/POST /session-types`, `GET/PUT /practitioners/me/availability`, `GET /practitioners/:id/slots`, `POST/GET /bookings`, `POST /bookings/:id/reschedule`, `POST /bookings/:id/cancel`, `POST /holds`, `DELETE /holds/:id` |
| Ledger  | `POST/GET /ledger/transactions`, `GET /ledger/accounts/:accountId/balance`, `GET /ledger/verify` |
| Webhooks | `POST /webhooks/stripe` (signature-verified, `stripe-signature` header; no `x-user-id`) |
| Marketplace | `GET/POST /marketplace/products`, `POST /marketplace/inventory/:productId/reserve`, `POST /marketplace/inventory/:productId/release`, `GET /marketplace/cart`, `POST /marketplace/cart/items`, `POST /marketplace/orders`, `GET /marketplace/orders/:id`, `POST /marketplace/orders/:id/transition` |
| Sagas   | `POST /sagas/checkout`, `GET /sagas`, `GET /sagas/:id` |
| Ops     | `GET /metrics` (Prometheus: outbox lag, queue depth, booking outcomes, ledger/webhook/saga/inventory/order counters, Node runtime), `GET /health`        |

### Socket events

Client → server: `conversation:join`, `message:send`, `message:read`, `typing`,
`presence:heartbeat`. Server → client: `message:new`, `read:update`,
`typing:update`, `presence:update`.

## Data model

Postgres is the source of truth; Redis only ever holds derivable state
(timelines, presence), which is why a cold Redis is a non-event rather than a
data-loss incident.

```
User ─┬─< Post ─┬─< Like
      │         └─< Comment
      ├─< Follow (follower/following)
      ├─< ConversationMember >─ Conversation ─< Message
      └─< Message
```

## Testing

```bash
pnpm test          # unit tests (no infra needed)
pnpm test:e2e      # end-to-end against real Postgres + Redis
```

- Unit tests cover the invariants that are easy to get wrong: the cursor
  round-trip, chat idempotency, server sequencing, and the
  unique-constraint-race resolution.
- The e2e suite drives the real app: guard rejection, feed pagination without
  duplicate ids across pages, fan-out reaching a follower's feed, and the
  send/list chat flow.

### Behavioral / adversarial suite

The payments and marketplace invariants are proved by **behavioral** scripts
(`scripts/*.sh`) run against the live API and Postgres — no mocks. They fire the
adversarial case and assert the invariant, not the happy path: 100 concurrent
ledger writes, 100 duplicate requests, 100 webhook replays, 100 checkouts for 10
units, forced saga failures at every step.

```bash
# Start the API with failure injection enabled (required by the saga workloads),
# then run the whole suite against it.
SAGA_FAILURE_INJECTION=1 pnpm --filter @tangerine/api start:prod &
bash scripts/herdr-test-suite.sh     # all 14 workloads; 14/14 green
```

`herdr-test-suite.sh` runs each workload in its own Herdr tab (sequentially —
they share one database) and sends a completion notification. It fails fast
with instructions if the API it targets is not reachable or was started
without `SAGA_FAILURE_INJECTION=1` (the injection flag is reported by
`GET /api/health`). The individual harnesses are indexed in
`docs/performance/payments.md` and `docs/performance/marketplace.md`.

## Performance program

This project's deliverable is evidence, not features. `docs/performance/`
contains the methodology, machine spec, and one write-up per measured scenario
(hypothesis → methodology → results → analysis → optimization → what it proves).

- **Instrumentation**: Prometheus + Grafana (provisioned, `docker compose up -d`),
  `pg_stat_statements`, rich `/api/metrics` (outbox lag, queue depth, booking
  outcomes, event-loop lag, heap), and a k6 harness in `apps/api/performance/`.
- **Scheduling scenarios**: booking contention, slot lookup under load,
  reschedule idempotency, hold-expiry accuracy.
- **Payments scenarios**: ledger balance under 100 concurrent writes, idempotent
  writes with crash recovery, webhook replay and order-independence.
- **Marketplace scenarios**: inventory race (100 vs 10 units), cart conflict,
  exhaustive order-state transitions, checkout-saga compensation.
- **Existing-system scenario**: warm feed read throughput.

```bash
pnpm infra:up                       # postgres + redis + prometheus + grafana
pnpm db:seed
pnpm --filter @tangerine/api perf:seed-bookings   # synthetic slot-lookup data
RUN_STAMP=local bash apps/api/performance/run-scheduling.sh
node apps/api/performance/report.mjs apps/api/performance/results/local
```

Grafana: <http://localhost:3000/d/tangerine-api> · Prometheus: <http://localhost:9090>

## Project layout

```
tangerine/
├─ apps/
│  ├─ api/                 # NestJS + Fastify + Prisma + Redis
│  │  ├─ prisma/           # schema, migrations, deterministic seed
│  │  ├─ performance/      # k6 harness, seed + report scripts
│  │  ├─ src/
│  │  │  ├─ feed/          # hybrid fan-out read path
│  │  │  ├─ timeline/      # Redis materialized timelines
│  │  │  ├─ outbox/        # transactional outbox + relay
│  │  │  ├─ fanout/        # BullMQ worker (async fan-out)
│  │  │  ├─ queue/         # BullMQ connection/queue wiring
│  │  │  ├─ scheduling/    # conflict-safe booking, holds, idempotency
│  │  │  ├─ ledger/        # double-entry ledger, deferred constraint, hash chain
│  │  │  ├─ idempotency/   # exactly-once writes with recovery points
│  │  │  ├─ webhooks/      # signature verify, inbox dedup, payment state machine
│  │  │  ├─ marketplace/   # products, inventory, cart, orders
│  │  │  ├─ saga/          # checkout orchestration + LIFO compensations
│  │  │  ├─ metrics/       # Prometheus registry + HTTP instrumentation
│  │  │  ├─ posts/ users/ follow/
│  │  │  ├─ chat/          # service, gateway, REST
│  │  │  ├─ realtime/      # socket server handle + presence
│  │  │  └─ common/ redis/ prisma/ config/
│  │  └─ test/             # e2e (including scheduling invariants)
│  └─ web/                 # React + Vite (dark-only)
├─ infra/                  # Prometheus scrape config + Grafana provisioning
├─ docs/performance/       # benchmark write-ups + optimization log
├─ docker-compose.yml
└─ pnpm-workspace.yaml
```

## What is intentionally out of scope

Abstracted so the backend is the focus, and called out honestly rather than
hidden:

- **Auth** — no signup/session issuance; identity is an `x-user-id` header
  resolved by one guard. Swapping in JWT/session verification touches one file.
- **Onboarding, consent, verification, moderation** — the compliance layer from
  the product's full feature list.
- **Live Stripe calls** — the payment gateway is a local, offline stand-in that
  records a `Payment` row and charges/refunds it. The `PaymentGateway` interface
  is the seam; swapping in the Stripe SDK (create/refund a PaymentIntent) touches
  one class. Webhook *verification* is real (`constructEvent` over the raw body).
- **Media** — posts carry an optional `mediaUrl`; there is no upload pipeline.
- **Push notifications** — offline users catch up on reconnect, but there is no
  APNs/FCM integration.

## Where this would go next

- Rate limiting + idempotency keys at the API edge; a CI pipeline that runs the
  full build + test + migrate flow on every push.
- Group chat fan-out and message search.
