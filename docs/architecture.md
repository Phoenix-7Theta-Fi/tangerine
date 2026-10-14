# Tangerine — Architecture

This document records the architectural decisions and trade-offs in
Tangerine. It is the long-form version of the "Stack" and "Engineering
highlights" sections of the README, written for someone reviewing the
design rather than running the app.

Tangerine is a **modular monolith**: a single deployable, clear module
boundaries, no import cycles. It is built to be split later, but there is
no service today that justifies the operational cost of a split.

---

## 1. Runtime shape

```
┌────────────────────────┐        REST (x-user-id)         ┌──────────────────────────┐
│  React + Vite + TS     │ ───────────────────────────────▶│  NestJS on Fastify       │
│  dark-only UI          │ ◀───────────────────────────────│  (modular monolith)      │
│  Feed · Chat           │        Socket.IO (realtime)     │  Prisma · ioredis        │
└────────────────────────┘                                  └────┬───────────┬────────┘
                                                               │           │
                                                       ┌───────▼──┐   ┌────▼──────┐
                                                       │ Postgres │   │   Redis   │
                                                       │  truth   │   │  derived  │
                                                       └──────────┘   └───────────┘
```

- **Postgres** is the source of truth. Every durable fact lives there.
- **Redis** holds only derivable state (materialized timelines, presence).
  A cold Redis is a non-event: the feed backfills from Postgres.
- **BullMQ** (backed by Redis) carries fan-out work that must not block the
  request path.
- **Socket.IO** with the Redis adapter carries real-time chat events and
  enables any instance to reach a socket held by another instance.

---

## 2. Stack decisions

### Why NestJS (on the Fastify adapter), not Express/Next API routes

The point of this backend is **module boundaries**: `users`, `follow`,
`posts`, `feed`, `timeline`, `chat`, `realtime`, `redis`, `prisma`, each
owning its own providers and imports. NestJS gives that structure, DI,
guards, interceptors, and a WebSocket gateway story without writing the
plumbing. Express alone scales to spaghetti; it has no answer to "where does
this provider live."

Fastify is the adapter, not Express, because the throughput ceiling matters
for a performance showcase and Fastify's router and serializer are
materially faster for the JSON-heavy read paths (`GET /feed`). The cost is
a smaller ecosystem of middleware; everything we use here is built-in or
first-party, so that cost is zero in practice.

**Trade-off accepted:** NestJS abstractions (decorators, DI) make hot-path
profiling slightly harder than hand-written handlers. Mitigation: the
hot paths (`FeedService`, `TimelineService`) are thin and avoid heavy
pipes/interceptors; we profile at the service level.

### Why Fastify over plain Node http / uWebSockets

Fastify is fast enough to stop being the bottleneck, which is a prerequisite
for measuring the things we actually care about (DB, Redis, serialization).
Going further (uWebSockets) would make the transport the story instead of
the data path, and we don't need it for the load levels targeted.

### Why Prisma, not Drizzle or raw SQL

Three reasons, in order of weight for *this* project:

1. **Migrations are first-class.** `prisma migrate dev` plus a deterministic
   `seed.ts` is reproducible infra for reviewers; Drizzle's migration story
   in this version is lighter and easier to get wrong.
2. **Type safety across the whole stack.** Generated client types flow into
   DTOs and Swagger with no hand-written row types.
3. **Prisma's transaction API maps directly onto our invariants** (post +
   outbox row in one `prisma.$transaction`; denormalized counters updated
   alongside their triggering write).

**Trade-offs accepted:**

- Heavier runtime and cold start (binary engine). For serverless/edge this
  would matter; for a long-lived API process it does not.
- The query builder occasionally produces suboptimal SQL. We verify hot
  queries with `EXPLAIN ANALYZE` (see the performance program) and drop to
  raw SQL where the planner needs help — e.g. the outbox relay's
  `FOR UPDATE SKIP LOCKED`.
- Query overhead from per-model typing. Acceptable; we batch where needed.

Prisma is a DX-first choice. A latency-first project might pick Drizzle.
That distinction is the honest answer to "would you use Drizzle?"

### Why PostgreSQL 18

Relational model fits the data: users, follows, posts, likes, comments,
conversations, messages all have foreign keys and invariants. Postgres gives
us:

- Real transactions for the outbox + counter invariants.
- `UPDATE … increment` with row locks for server-side sequence assignment.
- `GREATEST()` for monotonic read receipts in one statement.
- Indexes that can be verified with `EXPLAIN ANALYZE`.
- Durable dead-letter rows for failed fan-out.

SQLite would make local setup trivial but cannot model concurrent writers
the way we need (outbox claim, seq races), which is most of the point.

### Why Redis

Three distinct jobs, one service:

1. **Materialized timelines** (`ZSET` keyed by `timeline:{userId}`, scored by
   publish time). O(log n + k) reads instead of an expensive feed query.
2. **Presence via TTL keys**. A 60s TTL refreshed by heartbeats removes
   all disconnect bookkeeping and survives crashes/partitions.
3. **Socket.IO adapter + BullMQ backing store**. Horizontal fan-out of chat
   events and a durable, retryable job queue on the same primitive.

Redis is the one cache we'd keep if we kept only one. The cost is an
additional stateful service to operate; we keep it stateless-by-policy
(everything in Redis is derivable), so a restart loses nothing durable.

### Why BullMQ + transactional outbox, not direct enqueue

The naive version of `POST /posts` reads followers and writes their
timelines inside the request. That couples write latency to follower count
and loses fan-out if the process dies mid-loop.

This project uses the outbox pattern instead:

1. `POST /posts` writes `Post` + `OutboxEvent` in one transaction and
   returns. It never touches timelines.
2. An **outbox relay** polls pending rows and publishes to BullMQ, claiming
   with `FOR UPDATE SKIP LOCKED` so N API instances relay with no
   coordination. `jobId = eventId` makes publishing idempotent.
3. The **BullMQ worker** fans out with retries and exponential backoff.
   Fan-out is idempotent by construction (timelines are sorted sets keyed by
   post id), so at-least-once delivery is safe. Terminal failure becomes a
   durable `FAILED` row, not a lost job.

**Trade-off accepted:** ~`OUTBOX_RELAY_INTERVAL_MS` (default 500ms) added
latency between `POST /posts` and follower visibility. That is an explicit
consistency/latency trade-off; the performance program measures it as "fan-out
lag."

### Why Socket.IO over raw WebSocket / SSE

Rooms, acknowledgements, reconnection, and a horizontal-scale story are
provided rather than re-implemented. The Redis adapter handles cross-instance
delivery. The cost is extra framing overhead per message; for chat payloads
that cost is negligible and the operational savings are real. SSE would
reduce overhead but has no answer to client→server messages beyond POST.

### Why cursor (keyset) pagination, not offsets

Offsets (`OFFSET n`) make the DB skip and discard n rows; cost grows with
page depth and results shift when new rows arrive at the top ("page 2 shows
a row I already saw, or skips one"). Cursors encode a stable
`(createdAt, id)` position and translate to a range predicate the planner
can serve with the `(createdAt, id)` index. Cost is constant per page.

**Trade-off accepted:** Cursor tokens are opaque and slightly larger; clients
cannot jump to "page 5." That is the correct trade for a feed.

### Why pnpm workspaces over Turborepo/Nx

Two apps today. A build orchestrator (Turborepo) earns its keep past
~3 packages or CI cache needs. We crossed neither, and `pnpm -r` scripts
plus Nest's own builder cover the build/test flow. Revisit when a third
app or shared package appears.

### Why mocked auth (`x-user-id`)

Real auth (JWT issuance, refresh rotation, sessions, verification, consent)
is weeks of work that demonstrates security engineering, not performance
engineering. It is isolated to `auth.guard.ts` so swapping it in is a
single-file change. The perf story — fan-out, chat ordering, outbox — is
testable end-to-end without any of that.

### Why mocked media (`mediaUrl` string)

No upload pipeline, presigned URLs, or S3. Posts carry an optional URL so the
data model and hydration path stay real; the pipeline is a LocalStack
experiment (see Feature List Part 4).

### Why no Kafka

Kafka's strengths (retention, replay, multi-consumer fan-out) need event
volume to justify operational cost. Here BullMQ + Postgres outbox already
provide at-least-once delivery and a durable dead letter. Kafka becomes
justified only at Phase 5+ event volumes; until then it is over-engineering.

---

## 3. Data model decisions

See `apps/api/prisma/schema.prisma` for the full schema; the consequential
choices:

- **Denormalized counters** (`likeCount`, `commentCount`, `followerCount`,
  `followingCount`) live on the row so feed hydration is one query, not N
  aggregates. They are updated inside the transaction that changes the
  underlying fact. Risk: drift if a write forgets the counter update. Tests
  cover the cases where both are written together.
- **Timelines store pointers (post ids), not copies.** Edits, deletes and
  counter changes never rewrite millions of timelines; content is hydrated
  at read time.
- **Celebrity flag** (`isCelebrity`) is *derived* from
  `followerCount >= CELEBRITY_FOLLOWER_THRESHOLD`, recalculated on follow
  changes. The threshold is one tunable env var.
- **Server-assigned message `seq`**: monotonic per conversation, advanced
  with `UPDATE conversation SET lastSeq = lastSeq + 1` (row lock). Concurrent
  sends serialize on the row without application-level locking; no two
  clients can ever observe different ordering.
- **Idempotent sends** via `(senderId, clientMsgId)` unique. A retried send
  returns the original message; a lost idempotency race (unique violation
  on insert) is resolved by fetching the winner.
- **Read receipts as a single integer** (`lastReadSeq`) advanced with
  `GREATEST` so out-of-order acks cannot regress it. One row per member per
  conversation regardless of message volume.
- **Presence as a TTL key**: expiry is the cleanup mechanism. A dropped
  connection simply goes stale.
- **Outbox status enum** with a partial index on `(status, availableAt)` so
  the relay's poll is cheap and failed events are queryable.

---

## 4. Scaling boundaries — what breaks first

Honest list, useful for the benchmarks:

1. **Celebrity read path.** `FeedService` merges the pushed timeline with
   one query per celebrity followee. At 5/20/50 followees this is a
   hot-path N+1. Proposed fix: `ZUNIONSTORE` at feed read.
2. **Feed hydration.** `hydrateIds` can produce per-post author queries;
   risk of N+1. Candidate fixes: Prisma `include`, or a batched loader.
3. **Redis round trips.** Timeline writes are one `ZADD` per (follower, post).
   At high follower counts this is O(followers) round trips unless pipelined.
4. **Postgres pool saturation.** Pool size vs. throughput plateau; PgBouncer
   candidate.
5. **JSON serialization.** `JSON.stringify` over large feed payloads on a
   single event loop. Candidate: schema-based fast serializer.
6. **Outbox relay poll loop.** 500ms interval + 200-row batch caps relay
   throughput; find the saturation point.
7. **Socket.IO Redis adapter overhead.** Cross-instance delivery cost; find
   the scale where it matters.

Each of these is an open investigation in `Feature List.md` Part 3, not a
known bug — they are hypotheses to be measured.

---

## 5. What we would not change

- Postgres as the source of truth.
- Redis holding only derivable state.
- Outbox + idempotent workers over dual-write.
- Cursor pagination.
- Server-assigned seq + idempotent sends for chat.

These are the invariants the rest of the system leans on. Benchmarks
challenge them; they have not needed changing in design.
