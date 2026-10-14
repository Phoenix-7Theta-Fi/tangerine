# Tangerine — Capability & Performance Roadmap

This is not a product roadmap. It is a capability roadmap for a
**performance engineering showcase**.

Tangerine exists to demonstrate how a senior backend engineer designs,
measures, and optimizes a non-trivial distributed system. The deliverable
is not "a finished product." The deliverable is **evidence** —
benchmarks, dashboards, optimization logs, and a defensible architecture
story.

Every feature below is included because it introduces a real
distributed-systems problem worth measuring: contention, idempotency,
ordering, delivery guarantees, or consistency under load. Features that
do not extend the performance story are deliberately excluded — and
called out as such rather than quietly ignored.

---

## Status legend

| Symbol | Meaning |
|--------|---------|
| ✅ | Built and working |
| 🔬 | Built and benchmarked (documented in `docs/performance/`) |
| 🚧 | In progress |
| 🎯 | Planned next |
| 🧪 | Planned, framed as a performance experiment |
| ⛔ | Deliberately out of scope (with reasoning) |

---

## Part 1 — What exists today

### Core domain
- ✅ **Users, practitioners, providers** with roles, profiles, headlines, regions
- ✅ **Follow graph** with denormalized follower/following counts
- ✅ **Posts, likes, comments** with denormalized counters
- ✅ **Celebrity flag** derived from follower threshold

### Feed
- ✅ **Hybrid fan-out** — push for normal authors, pull for celebrities
- ✅ **Redis materialized timelines** (ZSET of post ids scored by publish time)
- ✅ **Bounded timeline length** with automatic trimming
- ✅ **Keyset (cursor) pagination** on `(createdAt, id)`
- ✅ **Cold-cache backfill** from Postgres so the feed is never empty

### Async pipeline
- ✅ **Transactional outbox** — post + event commit in one transaction
- ✅ **Outbox relay** with `FOR UPDATE SKIP LOCKED` (multi-instance safe)
- ✅ **BullMQ fan-out worker** with exponential backoff and dead-letter handling
- ✅ **Idempotent publishing** via `jobId = eventId`

### Chat
- ✅ **Server-assigned sequence numbers** (atomic `UPDATE … increment`)
- ✅ **Idempotent sends** via `clientMsgId` unique per sender
- ✅ **Store-and-forward** — messages persist before socket push
- ✅ **Read receipts as cursors** (`lastReadSeq` with `GREATEST` monotonic update)
- ✅ **Presence via Redis TTL** (heartbeat-refreshed keys)
- ✅ **Socket.IO with Redis adapter** for horizontal scale

### Operations
- ✅ **Prometheus metrics** — outbox lag, queue depth by state
- ✅ **Health endpoint** (db + redis checks)
- ✅ **Structured error envelope** and Prisma-to-HTTP error translation
- ✅ **Swagger docs** at `/docs`

---

## Part 2 — Deliberately out of scope

Each of these is a conscious decision, not an oversight. They are
abstractions that keep the focus on the performance story.

- ⛔ **Real authentication & onboarding** — mocked with an `x-user-id`
  header resolved by one guard. Swapping in real auth would touch one
  file (`auth.guard.ts`). JWT issuance and session rotation are not
  interesting performance problems at this project's scale.
- ⛔ **Email delivery** — a delivery channel, not a distributed-systems
  problem. If notification fan-out is benchmarked, email can be modeled
  as just another channel behind the same interface.
- ⛔ **Native mobile app** — mobile clients consume the same API. The
  performance story lives on the server, not in the UI framework.
- ⛔ **Consent, verification, moderation, compliance flows** — real
  health-platform requirements, but orthogonal to the fan-out, chat,
  scheduling, and payment problems this project measures.
- ⛔ **Multi-region deployment** — interesting at scale, but the current
  performance story is complete within a single region. Data residency
  would be a future experiment, not a feature.
- ⛔ **AI-assisted clinical interpretation** — requires clinical review
  and regulatory sign-off. Out of scope for a performance portfolio.

If any of these ever gets built, it will be because it *tests something*
the current system doesn't — not because a roadmap said so.

---

## Part 3 — Core platform capabilities

The features that define the system. Each is a prerequisite for the
performance experiments in Part 4.

### Scheduling & booking
- ✅ **`SessionType` catalog** — initial consult, follow-up, coaching, class,
  each with a duration and price
- ✅ **`PractitionerAvailability`** — recurring weekly slots with timezone
  awareness
- ✅ **`Booking` model** — `{ practitionerId, memberId, sessionTypeId,
  startTime, endTime, status }`
- ✅ **Slot lookup** — compute open slots from availability minus existing
  bookings, paginated by date range
- 🔬 **Conflict-safe booking** — reject overlapping bookings atomically
  (Postgres `EXCLUDE` constraint with `tstzrange`); never check-then-insert
- 🔬 **Reschedule & cancel** — with policy rules (e.g., 24-hour notice),
  idempotent on a client-provided operation id
- 🔬 **Hold / waitlist** — a soft reservation with an expiry job, so two
  members can be queued for one slot without double-booking (expiring hold is
  benchmarked; an explicit waitlist queue is deferred)
- ✅ **Booking confirmation** — emits an event through the existing outbox,
  consumed by the notifications pipeline

### Push notifications
- 🎯 **`Device` model** — `{ userId, platform, token, lastSeenAt, revokedAt }`
- 🎯 **`Notification` model** — `{ userId, type, payload, channel, readAt,
  deliveredAt, dedupeKey }`
- 🎯 **`NotificationPreference`** — per-user, per-channel opt-in/out
- 🎯 **Fan-out worker** — consumes notification events from the outbox,
  resolves recipients, batches by user, dispatches per device
- 🎯 **Delivery adapter interface** — one implementation for APNs/FCM
  (mocked), one for in-app, so the pipeline is testable without real
  provider credentials
- 🎯 **Deduplication** — unique index on `(userId, dedupeKey)`; a retry
  cannot produce a duplicate notification
- 🎯 **Digest batching** — collapse N likes on one post within a window
  into a single notification

### Payments & billing
- 🎯 **Stripe integration (test mode)** — checkout sessions, payment
  intents, refunds
- 🎯 **Webhook handler** — signature verification, idempotency on
  `event.id`, out-of-order event tolerance
- 🎯 **`Payment` model** — `{ id, bookingId?, orderId?, amount, currency,
  status, stripePaymentIntentId }`
- 🎯 **Double-entry ledger** — every money movement produces two rows
  (debit + credit), immutable once written
- 🎯 **`Payout` model** — practitioner payouts with a KYC status field
- 🎯 **Invoice / receipt generation** — PDF, stored in S3 (LocalStack),
  downloadable by the payer
- 🎯 **Refund & dispute handling** — state machine driven by webhook events
- 🎯 **Superbill export** — CSV/PDF for reimbursement

### Marketplace
- 🎯 **`Product` catalog** — supplements, devices, at-home tests,
  equipment, with a `practitionerId` for storefronts
- 🎯 **`Cart` and `CartItem`** — one active cart per user, serialized by
  an optimistic-concurrency version field
- 🎯 **`Order` model** with a state machine: `PENDING → PAID →
  FULFILLING → SHIPPED → DELIVERED → CANCELLED / REFUNDED`
- 🎯 **Inventory** — `InventoryItem` with a `reserved` counter; checkout
  reserves atomically and releases on failure or timeout
- 🎯 **Product-protocol linkage** — add a product to cart from a protocol
  item in one click
- 🎯 **Verified-purchase reviews** — only buyers can review, enforced by
  a join against the buyer's orders
- 🎯 **Disclosure fields** — every practitioner recommendation carries an
  `isSponsored` flag and a conflict-of-interest note

### Notifications (in-app)
- 🎯 **Bell + drawer UI** in the web app
- 🎯 **`GET /notifications`** with keyset pagination
- 🎯 **`POST /notifications/:id/read`** and mark-all-read
- 🎯 **Unread count** — cached in Redis, invalidated on write

---

## Part 4 — The performance program

This is the actual roadmap. A "feature" is now defined as a measured,
documented capability with a benchmark. Every entry below produces a
writeup in `docs/performance/`.

### Instrumentation (foundation)
- ✅ **Prometheus + Grafana** wired locally via `docker-compose.yml`
- ✅ **k6 test harness** in `apps/api/performance/`
- 🎯 **Node.js profiling setup** (`--prof`, `clinic.js`, or `0x`)
- ✅ **Postgres query stats** via `pg_stat_statements`
- 🎯 **Redis slowlog** and memory profiling
- 🎯 **OpenTelemetry tracing** — one span per request, one trace per
  outbox event, so a slow feed read can be traced end-to-end

### Benchmark scenarios — Feed & fan-out
- 🎯 **Feed read throughput** — req/s and p99 on `GET /feed` under
  sustained concurrent load
- 🎯 **Post write under read load** — verify the async pipeline never
  blocks the read path
- 🎯 **Fan-out lag** — time from `POST /posts` return to follower feed
  visibility under sustained write load
- 🎯 **Celebrity pull cost** — measure read latency as a user follows
  1, 5, 20, 50 celebrities; find the point where the per-celebrity query
  loop dominates
- 🎯 **Cold-cache recovery** — wipe timelines mid-load, measure backfill
  latency and error rate
- 🎯 **Outbox relay throughput** — find the event volume where the relay
  saturates; measure the lag derivative

### Benchmark scenarios — Chat
- 🎯 **Chat contention** — N concurrent senders on one conversation;
  prove `seq` uniqueness and ordering hold
- 🎯 **Read-receipt monotonicity under racing acks** — prove `GREATEST`
  never regresses
- 🎯 **Presence at scale** — many concurrent socket connections, TTL
  expiry, Redis key count growth
- 🎯 **Socket.IO Redis adapter overhead** — measure delivery latency with
  and without the adapter at different connection counts

### Benchmark scenarios — Scheduling
- 🔬 **Booking contention** — M members race for the same slot; exactly
  one must win, and the API must return a clean 409 to the others
- 🔬 **Slot lookup under load** — measure the cost of computing open
  slots as the number of existing bookings grows
- 🔬 **Reschedule idempotency** — send the same reschedule twice; assert
  the second is a no-op
- 🔬 **Hold expiry accuracy** — prove a hold releases the slot within
  the expected window even under scheduler jitter

### Benchmark scenarios — Payments
- 🎯 **Webhook idempotency** — replay the same Stripe webhook 100 times;
  assert exactly one ledger entry
- 🎯 **Out-of-order webhooks** — deliver `payment_intent.succeeded`
  before `checkout.session.completed`; assert the state machine
  converges to the same final state
- 🎯 **Ledger integrity under concurrent writes** — N concurrent writes
  to the same account; assert sum(debits) == sum(credits) always
- 🎯 **Refund flood** — many refunds on one order; assert ledger stays
  balanced and the state machine rejects invalid transitions

### Benchmark scenarios — Marketplace
- 🎯 **Inventory race** — M concurrent checkouts for the last item;
  exactly one must reserve successfully
- 🎯 **Cart concurrency** — two clients modifying the same cart;
  assert optimistic versioning prevents lost updates
- 🎯 **Order state transitions under load** — drive an order through its
  full lifecycle concurrently; assert no illegal transitions occur
- 🎯 **Catalog read throughput** — measure `GET /products` with filters
  and pagination

### Benchmark scenarios — Notifications
- 🎯 **Fan-out throughput** — one event with 10,000 recipients;
  measure time-to-last-delivery and queue saturation point
- 🎯 **Device fan-out amplification** — one notification to a user with
  5 devices; prove dedupe prevents duplicate dispatch on retry
- 🎯 **Digest batching** — 500 like events on one post within 60s;
  assert exactly one digest notification is sent
- 🎯 **Delivery adapter failure** — simulate an APNs outage; verify
  retries with backoff and eventual dead-letter

### Optimization investigations
Each hypothesis gets tested, measured, and either confirmed (with a
before/after) or rejected (also a valid finding).

- 🧪 **Feed hydration N+1** — does `hydrateIds` produce per-post author
  queries? Fix with Prisma `include` or a batched loader.
- 🧪 **Redis pipelining** — are timeline writes batched? Measure the
  round-trip reduction.
- 🔬 **Postgres connection pool saturation** — find the pool size where
  throughput plateaus; test PgBouncer. (Measured: contention saturated the
  default pool and produced 5xx with p99≈10 s; requiring a single advisory lock
  per contended slot eliminated the failures — see the optimization log. Retry
  alone was measured and rejected: the GiST exclusion index can livelock.)
- 🧪 **JSON serialization cost** — profile `JSON.stringify` on large feed
  payloads; test `fast-json-stringify` with a schema.
- 🧪 **Cursor pagination efficiency** — verify with `EXPLAIN ANALYZE`
  that the `(createdAt, id)` index is actually used.
- 🧪 **Celebrity pull optimization** — replace the per-celebrity query
  loop with a single `ZUNIONSTORE` across all celebrity outboxes.
- 🧪 **Hot-key rate limiter** — benchmark a sliding-window limiter under
  high concurrency; find the sharding threshold.
- 🧪 **Webhook processing throughput** — find the rate at which the
  payment state machine can ingest events before lag climbs.

### Deliverables
- ✅ `docs/performance/README.md` — methodology, machine specs, summary table
- ✅ One file per scenario in the standard format
  (hypothesis → methodology → results → analysis → optimization → results → what it proves)
- ✅ `docs/performance/optimization-log.md` — chronological before/after
- ✅ Grafana dashboard screenshots in the README
- 🎯 k6 HTML reports (via `pitwall-k6`) hosted on GitHub Pages

---

## Part 5 — Cloud emulation

- 🧪 **LocalStack for S3** — avatars, media, lab PDFs, invoice PDFs.
  Presigned-URL upload flow with its own throughput benchmark.
- 🧪 **LocalStack for SQS** — run the same fan-out benchmarks against
  SQS as an alternative to BullMQ and compare latency, cost model, and
  operational complexity
- 🧪 **LocalStack for Secrets Manager** — replace env vars with a real
  secrets fetch path
- 🧪 **Terraform plan (not applied)** — show the AWS footprint this would
  run on; demonstrates infrastructure-as-code literacy without a bill

---

## Part 6 — How "done" is defined

For a performance showcase, "done" means:

1. **Built** — the capability works, with tests covering the invariants
   (idempotency, ordering, monotonicity, ledger balance).
2. **Measured** — a k6 scenario exists, has a documented baseline, and
   produces reproducible numbers on a known machine.
3. **Analyzed** — the bottleneck is identified, not guessed. Profiling
   output or `EXPLAIN ANALYZE` is included.
4. **Optimized** — a change is made, and the before/after is recorded.
5. **Written up** — a short document explains the hypothesis, the
   result, and what it proves.

A feature that is built but not benchmarked is **not done** by this
project's standard. It is a prerequisite for the next benchmark.

---

## Part 7 — Explicitly not on this roadmap

For clarity, these are excluded even though they would appear on a
product roadmap:

- Email delivery pipelines
- Native mobile apps
- Multi-region deployment and data residency
- AI-assisted clinical interpretation
- Full compliance workflows (consent, verification, moderation)
- Organization / enterprise admin (SSO, roster management)
- Insurance billing integrations
- FHIR / EHR interoperability

These belong to a product roadmap, not a performance one. If the goal
of this project ever changes from "show what I can measure" to "ship a
product," this list becomes the starting point.

---

## The one-sentence summary

Tangerine is a working distributed system, and this file is the
checklist for turning it into a *demonstrated* one — measured,
analyzed, optimized, and written up.
