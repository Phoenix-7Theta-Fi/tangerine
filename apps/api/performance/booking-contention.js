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
 * Booking contention — M members race for the SAME slot.
 *
 * Each iteration is one race: a single VU fires RACERS POST /bookings requests
 * concurrently (http.batch) for one slot, using RACERS distinct members. The
 * exclusion constraint must let exactly one win; everyone else must get a clean
 * 409. The thresholds encode that invariant, so a regression fails the run.
 */

const RACERS = Number(__ENV.RACERS || 10);
const VUS = Number(__ENV.VUS || 20);
const ITER = Number(__ENV.ITER || 10);
const RACES = VUS * ITER;

export const options = {
  scenarios: {
    race: {
      executor: 'per-vu-iterations',
      vus: VUS,
      iterations: ITER,
    },
  },
  // k6 defaults batchPerHost to 6; raise it so all RACERS requests for one slot
  // are genuinely in flight together (otherwise the "M-way race" is really 6-way).
  batch: RACERS,
  batchPerHost: RACERS,
  thresholds: {
    booking_success: [`count==${RACES}`],
    booking_conflict: [`count==${RACES * (RACERS - 1)}`],
    booking_unexpected: ['count==0'],
    race_duration: ['p(95)<2000'],
  },
};

const success = new Counter('booking_success');
const conflict = new Counter('booking_conflict');
const unusual = new Counter('booking_unexpected');
const raceDuration = new Trend('race_duration', true);

export function setup() {
  const ids = identities();
  const practitioner = byHandle(
    ids,
    __ENV.PRACTITIONER_HANDLE || 'dr.aruna',
  );
  const memberIds = members(ids, RACERS);
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
  if (slots.length < RACES) {
    throw new Error(`need ${RACES} open slots, got ${slots.length}`);
  }
  return {
    memberIds,
    sessionTypeId: sessionType.id,
    slots: slots.slice(0, RACES).map((s) => s.startTime),
  };
}

export default function (data) {
  const idx = (exec.vu.idInTest - 1) * ITER + exec.vu.iterationInInstance;
  const slot = data.slots[idx];
  const started = Date.now();
  const responses = http.batch(
    data.memberIds.map((userId) => [
      'POST',
      `${API}/bookings`,
      JSON.stringify({ sessionTypeId: data.sessionTypeId, startTime: slot }),
      authHeaders(userId),
    ]),
  );
  raceDuration.add(Date.now() - started);

  for (const res of responses) {
    if (res.status === 201) success.add(1);
    else if (res.status === 409) conflict.add(1);
    else unusual.add(1);
  }
}

export function handleSummary(data) {
  return {
    [artifactPath(`booking-contention-${stamp()}`)]: JSON.stringify(data, null, 2),
    stdout: summarize(data, [
      'http_reqs',
      'http_req_duration',
      'http_req_failed',
      'booking_success',
      'booking_conflict',
      'booking_unexpected',
      'race_duration',
    ]),
  };
}
