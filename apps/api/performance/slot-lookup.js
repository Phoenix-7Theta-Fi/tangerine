import http from 'k6/http';
import { Trend } from 'k6/metrics';
import {
  API,
  artifactPath,
  authHeaders,
  byHandle,
  identities,
  isoFromDays,
  sessionTypeFor,
  stamp,
  summarize,
} from './lib/common.js';

/**
 * Slot lookup under load.
 *
 * GET /practitioners/:id/slots expands weekly availability into candidate
 * slots, then subtracts live reservations. The number of conflicts in the
 * window is the independent variable: run this after seeding different
 * BOOKING_COUNTs with `seed-bookings.ts` and compare p95.
 */

const VUS = Number(__ENV.VUS || 10);
const DURATION = __ENV.DURATION || '30s';

export const options = {
  scenarios: {
    lookup: {
      executor: 'constant-vus',
      vus: VUS,
      duration: DURATION,
    },
  },
  thresholds: {
    http_req_failed: ['rate<0.01'],
  },
};

const conflicts = new Trend('slots_conflicts_considered', true);
const returned = new Trend('slots_returned', true);
const totalOpen = new Trend('slots_total_open', true);
const scannedDays = new Trend('slots_scanned_days', true);

export function setup() {
  const ids = identities();
  const viewer = ids.find((u) => u.role === 'MEMBER');
  const practitioner = byHandle(
    ids,
    __ENV.PRACTITIONER_HANDLE || 'perf.practitioner',
  );
  const sessionType = sessionTypeFor(
    viewer.id,
    practitioner.id,
    __ENV.SESSION_TYPE || 'Perf slot',
  );
  const fromDays = Number(__ENV.FROM_DAYS || 1);
  const toDays = Number(__ENV.TO_DAYS || 60);
  const url =
    `${API}/practitioners/${practitioner.id}/slots` +
    `?from=${isoFromDays(fromDays)}&to=${isoFromDays(toDays)}` +
    `&sessionTypeId=${sessionType.id}&maxSlots=100`;
  return { url, viewerId: viewer.id };
}

export default function (data) {
  const res = http.get(data.url, authHeaders(data.viewerId));
  if (res.status === 200) {
    const body = res.json();
    if (body && body.slots) {
      conflicts.add(body.conflictsConsidered ?? 0);
      returned.add(body.slots.length ?? 0);
      totalOpen.add(body.totalOpen ?? 0);
      scannedDays.add(body.scannedDays ?? 0);
    }
  }
}

export function handleSummary(data) {
  return {
    [artifactPath(`slot-lookup-${stamp()}`)]: JSON.stringify(data, null, 2),
    stdout: summarize(data, [
      'http_reqs',
      'http_req_duration',
      'http_req_failed',
      'slots_conflicts_considered',
      'slots_returned',
      'slots_total_open',
      'slots_scanned_days',
    ]),
  };
}
