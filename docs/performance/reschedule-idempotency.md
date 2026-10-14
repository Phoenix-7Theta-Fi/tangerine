# Reschedule idempotency

**Status:** measured.

## Hypothesis

Sending the same reschedule twice with the same client `opId` must move the
booking **once**. The second request should return the first result — same
booking, same start time — and must not touch the database's write path again.

## Methodology

- Script: `apps/api/performance/reschedule-idempotency.js`.
- Scenario: `per-vu-iterations`, 10 VUs × 10 iterations = 100 reschedules.
- Per iteration: create a booking in slot A, reschedule to slot B with
  `clientOpId = resched-<n>`, then repeat the identical request.
- Dataset: deterministic seed; slots chosen 40–200 days out.

## Results

| Metric | Value |
| --- | --- |
| Reschedules performed | 100 |
| First calls OK | **100** |
| Idempotent replays OK | **100** |
| Replay mismatches | **0** |
| First-call latency p50 / p95 | 13 ms / 24 ms |
| Replay latency p50 / p95 | **15 ms / 29 ms** |

## Analysis

`withIdempotency` records the first request's result in `BookingOperation`
keyed by `(userId, opId)`; a retry finds the row and returns the stored response
(`reschedule_replay_ok` counts only responses whose booking id *and* start time
match the first call — 100/100). The replay does no slot validation, no conflict
check, and no write: it is a single indexed `SELECT`, and its p95 is bounded at
**29 ms**.

Concurrency note (covered by `test/scheduling.e2e-spec.ts`): if two identical
requests arrive at once, the unique `(userId, opId)` insert lets one win and the
other waits briefly for the winner's recorded response rather than repeating the
side effect.

## What it proves

Client-supplied operation ids make retries safe at the API boundary, and the
cost of a duplicate is bounded by one primary-key lookup — which is exactly what
a mobile client needs on a flaky network.

## Reproduce

```bash
VUS=10 ITER=10 k6 run apps/api/performance/reschedule-idempotency.js
```
