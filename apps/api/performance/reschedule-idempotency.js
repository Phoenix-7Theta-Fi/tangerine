import http from 'k6/http';
import exec from 'k6/execution';
import { Counter, Trend } from 'k6/metrics';
import {
  API,
  artifactPath,
  authHeaders,
  byHandle,
  identities,
  members,
  openSlots,
  sessionTypeFor,
  stamp,
  summarize,
} from './lib/common.js';

/**
 * Reschedule idempotency.
 *
 * Each iteration books a slot, then sends the SAME reschedule (same
 * clientOpId) twice. The second must be a no-op that returns the first result:
 * same booking id, same start time. `reschedule_replay_mismatch == 0` and
 * `reschedule_replay_ok == RACES` encode the invariant.
 */

const VUS = Number(__ENV.VUS || 10);
const ITER = Number(__ENV.ITER || 10);
const RACES = VUS * ITER;

export const options = {
  scenarios: {
    idem: { executor: 'per-vu-iterations', vus: VUS, iterations: ITER },
  },
  thresholds: {
    reschedule_replay_ok: [`count==${RACES}`],
    reschedule_replay_mismatch: ['count==0'],
    reschedule_replay_duration: ['p(95)<500'],
  },
};

const firstOk = new Counter('reschedule_first_ok');
const replayOk = new Counter('reschedule_replay_ok');
const mismatch = new Counter('reschedule_replay_mismatch');
const firstDuration = new Trend('reschedule_first_duration', true);
const replayDuration = new Trend('reschedule_replay_duration', true);

export function setup() {
  const ids = identities();
  const practitioner = byHandle(ids, __ENV.PRACTITIONER_HANDLE || 'dr.aruna');
  const memberIds = members(ids, 20);
  const sessionType = sessionTypeFor(
    memberIds[0],
    practitioner.id,
    __ENV.SESSION_TYPE || 'Initial consult',
  );
  const slots = openSlots(
    memberIds[0],
    practitioner.id,
    sessionType.id,
    Number(__ENV.FROM_DAYS || 365),
    Number(__ENV.TO_DAYS || 1200),
  );
  if (slots.length < RACES * 2) {
    throw new Error(`need ${RACES * 2} slots, got ${slots.length}`);
  }
  return {
    memberIds,
    sessionTypeId: sessionType.id,
    slots: slots.slice(0, RACES * 2).map((s) => s.startTime),
  };
}

export default function (data) {
  const idx = (exec.vu.idInTest - 1) * ITER + exec.vu.iterationInInstance;
  const member = data.memberIds[idx % data.memberIds.length];
  const slotA = data.slots[idx * 2];
  const slotB = data.slots[idx * 2 + 1];
  const opId = `resched-${idx}-${exec.vu.idInTest}`;

  const created = http.post(
    `${API}/bookings`,
    JSON.stringify({ sessionTypeId: data.sessionTypeId, startTime: slotA }),
    authHeaders(member),
  );
  if (created.status !== 201) return;
  const bookingId = created.json('id');

  let started = Date.now();
  const first = http.post(
    `${API}/bookings/${bookingId}/reschedule`,
    JSON.stringify({ startTime: slotB, clientOpId: opId }),
    authHeaders(member),
  );
  firstDuration.add(Date.now() - started);
  if (first.status === 201) firstOk.add(1);

  started = Date.now();
  const replay = http.post(
    `${API}/bookings/${bookingId}/reschedule`,
    JSON.stringify({ startTime: slotB, clientOpId: opId }),
    authHeaders(member),
  );
  replayDuration.add(Date.now() - started);

  const sameBooking = replay.json('id') === first.json('id');
  const sameStart = replay.json('startTime') === first.json('startTime');
  if (replay.status === 201 && sameBooking && sameStart) {
    replayOk.add(1);
  } else {
    mismatch.add(1);
  }
}

export function handleSummary(data) {
  return {
    [artifactPath(`reschedule-idempotency-${stamp()}`)]: JSON.stringify(data, null, 2),
    stdout: summarize(data, [
      'http_reqs',
      'http_req_duration',
      'http_req_failed',
      'reschedule_first_ok',
      'reschedule_replay_ok',
      'reschedule_replay_mismatch',
      'reschedule_first_duration',
      'reschedule_replay_duration',
    ]),
  };
}
