# Tangerine

A social health platform demo: a **feed** and **realtime chat** for members,
practitioners and providers. This is not a finished product — it is a focused,
opinionated slice built to show how I design and ship backend systems: correct
data models, the right abstractions at the right time, tests, and code you can
hand to another engineer.

Onboarding, signup, payments and compliance flows are **deliberately abstracted
away** (see [What is intentionally out of scope](#what-is-intentionally-out-of-scope)).
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
| Ops     | `GET /metrics` (Prometheus: outbox lag, queue depth), `GET /health`        |

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

## Project layout

```
tangerine/
├─ apps/
│  ├─ api/                 # NestJS + Fastify + Prisma + Redis
│  │  ├─ prisma/           # schema, migrations, deterministic seed
│  │  ├─ src/
│  │  │  ├─ feed/          # hybrid fan-out read path
│  │  │  ├─ timeline/      # Redis materialized timelines
│  │  │  ├─ outbox/        # transactional outbox + relay
│  │  │  ├─ fanout/        # BullMQ worker (async fan-out)
│  │  │  ├─ queue/         # BullMQ connection/queue wiring
│  │  │  ├─ metrics/       # Prometheus exposition
│  │  │  ├─ posts/ users/ follow/
│  │  │  ├─ chat/          # service, gateway, REST
│  │  │  ├─ realtime/      # socket server handle + presence
│  │  │  └─ common/ redis/ prisma/ config/
│  │  └─ test/             # e2e
│  └─ web/                 # React + Vite (dark-only)
├─ docs/frontend-spec.md
├─ docker-compose.yml
└─ pnpm-workspace.yaml
```

## What is intentionally out of scope

Abstracted so the backend is the focus, and called out honestly rather than
hidden:

- **Auth** — no signup/session issuance; identity is an `x-user-id` header
  resolved by one guard. Swapping in JWT/session verification touches one file.
- **Onboarding, consent, verification, moderation, payments** — the compliance
  and commerce layer from the product's full feature list.
- **Media** — posts carry an optional `mediaUrl`; there is no upload pipeline.
- **Push notifications** — offline users catch up on reconnect, but there is no
  APNs/FCM integration.

## Where this would go next

- Rate limiting + idempotency keys at the API edge; a CI pipeline that runs the
  full build + test + migrate flow on every push.
- Group chat fan-out and message search.
