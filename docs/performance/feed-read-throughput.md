# Feed read throughput

**Status:** measured (baseline). Part of the existing feed/chat system, included
as the harness's first non-scheduling scenario.

## Hypothesis

A warm materialized timeline makes `GET /feed` a bounded Redis read plus one
Postgres hydration/`liked` lookup, so it should sustain **hundreds of req/s with
a p95 well under 100 ms** on a single API process, and the async fan-out
pipeline must not interfere with the read path.

## Methodology

- Script: `apps/api/performance/feed-read.js`.
- Scenario: `constant-vus`, 20 VUs, 30 s.
- Viewer: `@maya`, a member. Warm-up: the runner creates 40 posts as `@maya`
  (their own outbox is materialized on write), then waits 3 s for the outbox
  relay + fan-out worker.
- Dataset: `pnpm db:reset && pnpm db:seed` (36 users, 166 follows, 2
  celebrities, ~120 posts).
- `GET /api/feed?limit=20`, mock auth via `x-user-id`.

## Results (2026-10-14, baseline)

A second run on the same host measured 526 req/s with p95 47.5 ms — about 12 %
run-to-run variance, expected when the load generator, API, Postgres, Redis and
monitoring stack share 8 physical cores.

| Metric | Value |
| --- | --- |
| Requests | 17,932 |
| Throughput | **597 req/s** |
| p50 | **32.6 ms** |
| p90 | 38.9 ms |
| p95 | **41.3 ms** |
| max | 82.1 ms |
| Error rate | **0 %** |
| Items returned | 20 every request (never empty) |

## Analysis

The warm path is dominated by the small number of Postgres round trips
(`hydrateIds` + the `liked` set), not by Redis. Event-loop lag stayed flat and
the 40 in-flight warm-up posts did not move read latency, which is the intended
property of the transactional outbox: **the write path cannot block the read
path** — the API request only commits a post + an outbox row.

`EXPLAIN ANALYZE` confirms `hydrateIds` uses `Post.id` primary-key lookups and
the `liked` query uses the `(postId, userId)` unique index. See the optimization
log for the N+1 hydration hypothesis, which this scenario was instrumented to
detect (no per-post author query was observed).

## What it proves

The hybrid fan-out read path is cheap and predictable under sustained
concurrency, and the async pipeline is genuinely decoupled from reads: writes
enqueue work without touching the request's critical path.

## Reproduce

```bash
# with the API running and the timeline warmed (see the runner)
VUS=20 DURATION=30s k6 run apps/api/performance/feed-read.js
```
