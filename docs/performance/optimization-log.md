# Optimization log

Chronological record of measured before/after changes. Each entry states the
hypothesis, the change, and the measured effect. Rejected hypotheses are kept
too — a negative result is still evidence.

Environment and load parameters are in `docs/performance/README.md`. Raw k6
artifacts live in `apps/api/performance/results/<run>/`.

---

## 2026-10-14 — Booking contention exposes connection-pool + transaction saturation

**Scenario:** `booking-contention` — 200 races, 10 members per slot, 20 VUs
(`POST /api/bookings`).

### Observation (before)

Under a 10-way same-slot race the exclusion constraint correctly produced one
winner and clean `409`s, **but 230 of 2,000 responses were neither 201 nor
409** — they were `500`s. Server logs showed two error classes:

```
PostgresError { code: "40P01", message: "deadlock detected" }
Transaction already closed: ... The timeout for this transaction was 5000 ms,
however 6004 ms passed since the start of the transaction.
```

`http_req_duration` p99 was pinned at **≈ 10.06 s** — the Prisma **pool
timeout** — which is the tell: requests were queueing for a DB connection, not
waiting on the slot itself.

| Metric | Before |
| --- | --- |
| Races | 200 |
| Winners | 198 (expected 200) |
| Conflicts (409) | 1,572 |
| Unexpected (`5xx`) | **230** |
| p50 | 1,680 ms |
| p99 | **10,061 ms** |

### Hypothesis

Three compounding causes, all on the write path:

1. **Pool starvation.** Prisma's default pool is `2×physical cores + 1 ≈ 17`
   connections. 2,000 near-simultaneous requests far exceed that; requests wait
   past the 10 s pool timeout and fail.
2. **Per-request hold sweep.** Every booking ran `expireStaleHolds()` — an extra
   `UPDATE` — before its `INSERT`, doubling write traffic under load.
3. **Interactive-transaction deadline.** The insert + outbox write run in a
   Prisma interactive transaction with a 5 s budget. When a row waits on the
   GiST exclusion index (or on a pooled connection), the budget elapses and
   Prisma throws `P2028`. Concurrent range inserts also deadlock (`40P01`).

### Changes tried

Kept from the start:

- `DATABASE_URL`: `connection_limit=40&pool_timeout=20` (see `.env.example`).
- Throttled the hot-path hold sweep to one `UPDATE` per 100 ms window
  (`expireHoldsThrottled`); the 1 s background sweeper is the floor, and expired
  holds are already excluded from slot reads.

Two candidate fixes were then measured head-to-head:

- **Attempt 1 (rejected):** bounded retry with jitter on transient
  `40P01`/`40001`/`P2028`/`P2034` (`23P01` never retried) plus a 15 s
  interactive-transaction budget.
- **Attempt 2 (accepted):** a transaction-scoped advisory lock per contended
  slot, before the insert.

### Attempt 1 — retry + bigger pool (rejected)

First fix attempt: raise the Prisma pool (`connection_limit=40&pool_timeout=20`),
give interactive transactions a 15 s budget, and retry transient
`40P01`/`40001`/`P2028`/`P2034` with jitter (`23P01` never retried).

| Metric | Baseline | Attempt 1 (retry) | Attempt 2 (advisory lock) |
| --- | --- | --- | --- |
| Winners | 198 | 195 | **200** |
| Conflicts (409) | 1,572 | 1,597 | **1,800** |
| Unexpected (`5xx`) | 230 | 208 | **0** |
| p50 | 1,680 ms | 3,046 ms | 339 ms |
| p95 | — | — | 496 ms |
| p99 / max | 10,061 ms | 47,879 ms | **1,582 ms (max)** |
| Race p95 | — | 49,058 ms | **886 ms** |
| Wall time | ~47 s | ~313 s | **4.7 s** |

Retry made it **much worse**. That is not a tuning miss — it is a documented
PostgreSQL property. Concurrent inserts into a **GiST exclusion index** can
deadlock, and [BUG #15026 / the pgsql mailing list](https://www.postgresql.org/message-id/69d128a8524692d0610ae3118580c859.squirrel%40mail.pinkwin.com)
notes that while two sessions may resolve, *"with three sessions competing"* a
retry loop may never terminate. My 10-way race has ten. Retries multiplied the
offered load against an index already in a deadlock cycle.

### Attempt 2 — serialize the critical section (accepted)

The same mailing list gives the remedy: *"introduce an exclusive lock on some
other entity just before doing the INSERT."* Implemented as a
transaction-scoped **advisory lock keyed by `(practitionerId, startTime)`**
(`pg_advisory_xact_lock(4242, hashtext(key))`, wrapped in a subquery because
Prisma cannot deserialize a `void` column).

- Contenders for **one slot** queue in a deterministic order on one lock: the
  first commits, the rest then hit the exclusion constraint and get a clean
  `409`. No deadlock cycle, no retry storm.
- Different slots use different keys and run fully in parallel.
- The **exclusion constraint is still the correctness backstop** — the lock only
  removes the deadlock; correctness is unchanged.

The harness was also corrected: k6's `batchPerHost` defaults to **6**, so a
same-host "10-way race" was only 6-way. `batchPerHost = RACERS` is now set.

**Result: 200/200 races with exactly one winner, 1,800 clean `409`s, 0 `5xx`,
race p95 1.0 s, whole run in 4.5 s.** All thresholds pass. The `VUS=10 RACERS=6`
profile likewise yields exactly one winner per race with zero unexpected
responses.

### What it proves

1. The exclusion constraint is the right way to make double-booking
   unrepresentable — every source in the references agrees, and no run ever
   double-booked.
2. But a GiST exclusion index has a **concurrency failure mode** that must be
   designed around, not retried through. The fix is one advisory lock on the
   contended resource, and it is dramatically better than retrying.
3. A benchmark is only trustworthy if the harness models what it claims: the
   `batchPerHost` default silently weakened the race until it was corrected.
4. The port pool-size change from Attempt 1 is kept (it is correct for
   connection saturation generally) but it was **not** the fix for this
   problem, and it is documented as such.

---

## 2026-10-14 — Slot lookup: the bottleneck was the timezone parse, not the conflict scan

**Scenario:** `slot-lookup` — fixed 14-day window, `maxSlots=100`, 10 VUs, as the
number of live reservations in the window grows (0 / 400 / 800 / 1200).

The implementation fetches every live reservation in the window and, for each
candidate slot, scans them for an overlap (`Array.some`) — naively
`O(candidates × conflicts)`. That was the hypothesis.

**Before**, the numbers were almost flat and high:

| Live reservations | p50 | p95 |
| --- | --- | --- |
| 0 | 216 ms | 306 ms |
| 400 | 214 ms | 385 ms |
| 800 | 232 ms | 396 ms |
| 1200 | 231 ms | 409 ms |

p50 did not move with conflicts, so the conflict scan was **not** the cost. The
flat ~215 ms floor was slot *generation*: expanding availability into 1,344
candidate slots called `Intl.DateTimeFormat.formatToParts` once per slot to
resolve the DST-correct UTC offset.

`EXPLAIN (ANALYZE, BUFFERS)` confirmed the DB side is trivial: the conflict
query is a bitmap index scan on `Booking_practitionerId_startTime_idx`, 1,200
rows in **3.6 ms**.

**Change:** sample the zone offset **once per local day** and reuse it
(`dayOffsetIfStable` + `utcFromLocal`), falling back to the exact two-pass
conversion only on a DST-transition day (unit-tested against
`zonedTimeToUtc`).

**After:**

| Live reservations | p50 | p95 | p95 improvement |
| --- | --- | --- | --- |
| 0 | **59 ms** | **77 ms** | 4.0× |
| 400 | **69 ms** | **118 ms** | 3.3× |
| 800 | **83 ms** | **132 ms** | 3.0× |
| 1200 | **92 ms** | **144 ms** | 2.8× |

Removing the constant made the true variable visible: latency now rises with
conflicts (75 → 141 ms p95), so the overlap scan is a real, if secondary, cost —
exactly the case the spec anticipated. The next optimization (push the overlap
subtraction into SQL) is now *justified* by the data, and recorded as the
follow-up rather than assumed.

### What it proves

Profile before optimizing. The expensive-looking code (`O(candidates ×
conflicts)`) was not the bottleneck; an unremarkable `Intl` call per slot was.
A 4× win came from caching one value per day, not from rewriting the algorithm.


---

## 2026-10-15 — Payments & marketplace: invariants in the database, one deliberate rejection

**Scenarios:** `test-ledger`, `test-idempotency`, `test-webhook-idempotency`,
`test-inventory-race`, `test-cart-concurrency`, `test-order-state-machine`,
`test-saga-compensation`, `test-saga-failure` (behavioral harnesses; see
`docs/performance/payments.md` and `docs/performance/marketplace.md`).

### Observation

Every scenario held its invariant on the first correct design, so there is no
before/after *tuning* here the way there is for booking contention. The value is
in three design decisions that are easy to get subtly wrong, and one approach
that was deliberately **rejected** rather than tried and discarded.

Measured (single host, shared with Postgres):

| Scenario | Result |
| --- | --- |
| Ledger, 100 concurrent balanced writes | 100 accepted, imbalance 0, 0 trigger exceptions, 1.58 s |
| Idempotency, 100 concurrent identical | 1 ledger tx, 1 distinct response, 99 replays |
| Webhook, 100 replays | 1 inbox row, 1 transition, 1 ledger tx |
| Inventory race, 100 vs 10 units | exactly 10 winners, 0.27 s |
| Cart, 2 edits same version | 1 × 201, 1 × 409 |
| Order state machine | 192 triples, 0 mismatches |

### Decision 1 — balance is a deferred constraint trigger

`CREATE CONSTRAINT TRIGGER ... DEFERRABLE INITIALLY DEFERRED` fires at `COMMIT`,
after all legs of a transaction are inserted. A direct `INSERT` that bypasses the
API — all postings, then `COMMIT` — is rejected with
`ledger transaction ... is unbalanced by N cents`, rc=3. Correctness does not
depend on the service validating first.

### Decision 2 — the ledger chain lock is global and serialising

`seq` is assigned by the service under `pg_advisory_xact_lock(9317)`, not by a
DB sequence, because the SHA-256 hash must be computable **before** the row is
inserted (append-only rows cannot be back-filled). This caps ledger writes at
one-at-a-time extension. Accepted because the critical section is microseconds
and chain integrity is worth more; documented as the first thing to shard
(per-account `(accountId, seq)`) if throughput ever matters. It is also recorded
in the research memo §9.

### Decision 3 (rejected before it was built) — holding the idempotency row lock across the operation

The naive idempotency implementation holds `SELECT ... FOR UPDATE` on the key's
row for the **whole** operation. Under a 100-way stampede on one key this
deadlocks the connection pool, and it is arithmetic, not luck:

- The predicate is on a single row, so exactly one caller can proceed; the other
  99 block on that row lock.
- Each blocked caller **holds a pooled connection** while waiting. With
  `connection_limit=40`, all 40 connections are held by lock-waiters and none is
  free.
- The one caller that holds the lock now needs a *second* connection (the
  ledger write runs in its own transaction) and cannot get one → pool timeout.

The accepted design is **claim-run-finalize**: a short claim transaction takes
the lock, decides (cached / wait / run) and commits; the operation then runs
**outside** any held lock; a final short update marks it `COMPLETED`. Duplicates
poll a non-locking read until the winner records its response. A lease
(`lockedAt`) plus a fencing token (`lockToken`) makes takeover safe, so a worker
whose lease expired cannot overwrite the attempt that replaced it.

This is the same lesson as booking contention in a different costume: the
database's row lock is the right arbiter, but **how long you hold it** is a
design choice with a failure mode of its own.

### Full suite

`scripts/herdr-test-suite.sh` runs all 14 workloads and reports:

```
passed=14 failed=0 total=14
```

The workloads share one database and reset the tables they assert on, so the
suite runs them **sequentially** (one Herdr tab per workload for output
isolation); `PARALLEL=1` is available for disjoint-data setups. Two metric
assertions were made **delta-based** rather than absolute so the suite is
re-runnable against one long-lived server (counters are cumulative).

---

## 2026-10-16 — Health ingestion: index-flat trends, a worker ceiling, and a quadratic adherence filter

**Scenario:** health monitoring — see `docs/performance/health-monitoring.md`.
Artifacts: `results/health-final/` (before) and `results/health-after/`
(adherence re-run).

### Observation (before)

Trend reads were flat (~8 ms p95 from 1k to 500k rows) — expected, because the
recent window is a bounded backward walk of
`Observation_patientId_code_effectiveAt_idx` (9 buffers, 0.088 ms; EXPLAIN in
the write-up). Not a problem to solve.

Adherence, however, grew superlinearly:

| (items, events) | p95 | avg |
| --- | --- | --- |
| 20, 10,000 | 325 ms | 208 ms |
| 50, 25,000 | 1,028 ms | 634 ms |
| 100, 50,000 | 2,549 ms | 1,606 ms |

Doubling both inputs roughly tripled latency.

Ingestion accepted 137 req/s (4,118 reqs/30 s, 0 `5xx`) and the outbox drained in
1.79 s — but across the run the accumulated backlog reached ~11k and drained at
~100 events/s.

### Hypothesis

1. Adherence is **O(items × events)**: `AdherenceService` fetched the window's
   events once and then ran `events.filter(e => e.protocolItemKey === item.key)`
   *inside the per-item loop*.
2. The pipeline's sustained ceiling is the **single `HealthProcessor` consumer**,
   because it derives the trend (an extra read) for every observation before
   marking the outbox row processed — so it consumes slower than the write path
   produces.

### Change

Bucketed the window's events by `protocolItemKey` in one pass and had each item
read its bucket (`apps/api/src/clinical/adherence.service.ts`). Semantics
unchanged: taken / skipped / not-logged / streaks still read the same per-item
event list.

### Result (after)

| (items, events) | avg before | avg after | p95 before | p95 after |
| --- | --- | --- | --- | --- |
| 20, 10,000 | 208 ms | **179 ms** | 325 ms | **283 ms** |
| 50, 25,000 | 634 ms | **492 ms** | 1,028 ms | **667 ms** |
| 100, 50,000 | 1,606 ms | **905 ms** | 2,549 ms | **1,311 ms** |

1.77× throughput at the largest config; the remaining cost is linear in the
returned window rows — the floor for a derived-on-read endpoint.

### Diagnosed, not changed — worker throughput is the sustained ceiling

The ingestion request path accepts ~137 req/s but the worker drains ~100
events/s, so sustained ingestion above the drain rate grows the outbox
unboundedly. The lever is **consumer concurrency** (BullMQ `Worker` concurrency,
or sharding `health.observation.ingested` across workers), which is a deployment
knob rather than a code defect; the scenario's purpose was to locate the ceiling.
Recorded here as the recommended next change if sustained ingest rates increase.
