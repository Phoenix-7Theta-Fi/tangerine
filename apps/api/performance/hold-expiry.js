import http from 'k6/http';
import exec from 'k6/execution';
import { Counter, Trend } from 'k6/metrics';
import { sleep } from 'k6';
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
 * Hold expiry accuracy.
 *
 * A hold is created with a TTL in seconds. A rival then polls the same slot
 * with real booking attempts; the first 201 is the moment the slot was freed.
 * `hold_release_latency` is measured from hold creation, and
 * `hold_release_latency_past_ttl` from the TTL deadline, so the overshoot (TTL
 * + sweep interval + jitter) is visible rather than assumed.
 */

const VUS = Number(__ENV.VUS || 8);
const ITER = Number(__ENV.ITER || 6);
const RACES = VUS * ITER;
const TTL = Number(__ENV.HOLD_TTL_SECONDS || 5);
const POLL_MS = Number(__ENV.POLL_MS || 200);

export const options = {
  scenarios: {
    expiry: { executor: 'per-vu-iterations', vus: VUS, iterations: ITER },
  },
  thresholds: {
    hold_claimed: [`count==${RACES}`],
    hold_claim_failed: ['count==0'],
    hold_release_latency: [`p(95)<${TTL * 1000 + 5000}`],
  },
};

const created = new Counter('hold_created');
const claimed = new Counter('hold_claimed');
const claimFailed = new Counter('hold_claim_failed');
const claimAttempts = new Counter('hold_claim_attempts');
const releaseLatency = new Trend('hold_release_latency', true);
const overshoot = new Trend('hold_release_latency_past_ttl', true);

export function setup() {
  const ids = identities();
  const practitioner = byHandle(ids, __ENV.PRACTITIONER_HANDLE || 'dr.aruna');
  const memberIds = members(ids, RACES + 1);
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
    throw new Error(`need ${RACES} slots, got ${slots.length}`);
  }
  return {
    sessionTypeId: sessionType.id,
    holder: memberIds[0],
    rival: memberIds[1],
    slots: slots.slice(0, RACES).map((s) => s.startTime),
  };
}

export default function (data) {
  const idx = (exec.vu.idInTest - 1) * ITER + exec.vu.iterationInInstance;
  const slot = data.slots[idx];

  const holdStart = Date.now();
  const hold = http.post(
    `${API}/holds`,
    JSON.stringify({
      sessionTypeId: data.sessionTypeId,
      startTime: slot,
      ttlSeconds: TTL,
    }),
    authHeaders(data.holder),
  );
  if (hold.status !== 201) {
    claimFailed.add(1);
    return;
  }
  created.add(1);
  const deadline = holdStart + TTL * 1000;

  const timeoutAt = holdStart + TTL * 1000 + 10_000;
  while (Date.now() < timeoutAt) {
    claimAttempts.add(1);
    const res = http.post(
      `${API}/bookings`,
      JSON.stringify({ sessionTypeId: data.sessionTypeId, startTime: slot }),
      authHeaders(data.rival),
    );
    if (res.status === 201) {
      const now = Date.now();
      releaseLatency.add(now - holdStart);
      overshoot.add(Math.max(0, now - deadline));
      claimed.add(1);
      return;
    }
    sleep(POLL_MS / 1000);
  }
  claimFailed.add(1);
}

export function handleSummary(data) {
  return {
    [artifactPath(`hold-expiry-${stamp()}`)]: JSON.stringify(data, null, 2),
    stdout: summarize(data, [
      'http_reqs',
      'http_req_duration',
      'http_req_failed',
      'hold_created',
      'hold_claimed',
      'hold_claim_failed',
      'hold_claim_attempts',
      'hold_release_latency',
      'hold_release_latency_past_ttl',
    ]),
  };
}
