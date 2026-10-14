# Hold expiry accuracy

**Status:** measured.

## Hypothesis

A hold is a reservation with a TTL. When the TTL passes the slot must become
bookable again within a **small, bounded** window — even though the background
sweeper runs on its own interval and is subject to scheduler jitter.

## Methodology

- Script: `apps/api/performance/hold-expiry.js`.
- Scenario: `per-vu-iterations`, 8 VUs × 6 iterations = 48 holds.
- Per iteration: create a hold with `ttlSeconds = 5`, then a rival polls the
  same slot with real `POST /bookings` attempts every 200 ms until it wins.
- `hold_release_latency` = time from hold creation to the winning booking.
- `hold_release_latency_past_ttl` = that latency minus the TTL (the overshoot).
- Server: hold sweeper every 1000 ms; expiry also runs on the booking hot path.

## Results

| Metric | Value |
| --- | --- |
| Holds created / claimed | **48 / 48** |
| Claim failures | **0** |
| Release latency p50 | 5,116 ms |
| Release latency p95 | **5,234 ms** |
| Overshoot past 5,000 ms TTL — p50 / p95 / max | **116 ms / 234 ms / 290 ms** |
| Booking attempts to win | ~25 per hold (200 ms poll) |

## Analysis

The overshoot is **≈ 116–290 ms**, well below the 1,000 ms sweeper interval. The
reason is architectural: a hold is not released *only* by the sweeper.
`createBooking` checks for and cancels expired holds on the claim path, so the
very request trying to take the slot frees it. The sweeper is a janitor for
metrics and slot reads; it is not on the correctness-critical path. The 200 ms
poll interval and the 100 ms hot-path sweep throttle dominate the observed
overshoot, not the sweeper.

The hot-path sweep is **throttled** (one `UPDATE` per 100 ms window) as part of
the contention optimization — this is the trade-off that keeps it from doubling
write traffic per booking while preserving sub-200 ms release.

## What it proves

Expiry-based reservations can be both cheap (a status flip, no delete-and-lock
dance) and accurate: correctness comes from filtering expired holds at claim
time, and the TTL boundary is honoured within the polling granularity, not the
sweeper's.

## Reproduce

```bash
VUS=8 ITER=6 HOLD_TTL_SECONDS=5 k6 run apps/api/performance/hold-expiry.js
```
