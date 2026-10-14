# Tangerine — performance scripts (k6)

k6 harness for the scenarios documented in `docs/performance/`. Each scenario
is one `.js` file here plus a write-up under `docs/performance/<scenario>.md`.

Raw results land in `results/<run>/` as k6 summary JSON; charts are rendered by
`report.mjs`.

## Layout

```
performance/
├─ booking-contention.js     M members race for one slot; exactly one wins
├─ slot-lookup.js            availability − reservations as bookings grow
├─ reschedule-idempotency.js same op id twice is one move
├─ hold-expiry.js            a hold frees its slot within TTL + jitter
├─ feed-read.js              warm GET /feed throughput (existing system)
├─ seed-bookings.ts          synthetic data for slot-lookup (isolated account)
├─ run-scheduling.sh         runs the whole scheduling suite
├─ report.mjs                renders SVG charts from k6 JSON
├─ lib/common.js             shared helpers (auth, slot discovery, summary)
└─ tsconfig.json             ts-node config for the seed script
```

## Conventions

- Base URL from `BASE_URL` (default `http://localhost:3001`).
- Mock auth via `x-user-id`; ids resolved at `setup()` from
  `/api/session/identities`, so scripts survive a reseed.
- Each script exports `thresholds` encoding the invariant it tests; a regression
  fails the run.
- `booking-contention.js` sets `batchPerHost = RACERS` — k6 defaults it to 6, so
  without this a same-host "10-way race" is only 6-way.

## Run

```bash
# one scenario
VUS=20 ITER=10 RACERS=10 k6 run performance/booking-contention.js

# everything (writes a timestamped results dir)
RUN_STAMP=local bash performance/run-scheduling.sh

# charts
node performance/report.mjs performance/results/optimized \
  performance/results/slot-optimized
```

## Seed data for slot-lookup

```bash
BOOKING_COUNT=1200 SLOT_MINUTES=15 pnpm --filter @tangerine/api perf:seed-bookings
```

Creates/refreshes an isolated `@perf.practitioner` with all-day availability and
N back-to-back 15-minute bookings. It never touches demo users.
