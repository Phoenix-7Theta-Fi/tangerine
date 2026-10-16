import http from 'k6/http';
import { artifactPath, API, authHeaders, stamp, summarize } from './lib/common.js';

/**
 * Adherence rate computation under high event volume.
 *
 * GET /clinical/adherence loads the patient's protocols and items, then the
 * adherence events in the window, and aggregates per item in the application
 * (including a per-day streak scan). Run it against a patient seeded with an
 * increasing (ITEMS, EVENTS) pair (`seed-health-perf.ts MODE=adherence`); the
 * event volume in the window is the independent variable.
 */

const VUS = Number(__ENV.VUS || 4);
const ITERS = Number(__ENV.ITERS || 100);
const LABEL = __ENV.LABEL || 'n';
const WINDOW_DAYS = Number(__ENV.WINDOW_DAYS || 30);

export const options = {
  scenarios: {
    adherence: { executor: 'per-vu-iterations', vus: VUS, iterations: ITERS },
  },
  thresholds: {
    http_req_failed: ['rate<0.01'],
  },
};

export function setup() {
  // The perf patient is newer than the demo switcher's 100-identity cap, so the
  // runner passes its id directly from the seed step.
  return { id: __ENV.PERF_PATIENT_ID };
}

export default function (data) {
  http.get(
    `${API}/clinical/adherence?windowDays=${WINDOW_DAYS}`,
    authHeaders(data.id),
  );
}

export function handleSummary(data) {
  return {
    [artifactPath(`health-adherence-rate-${LABEL}-${stamp()}`)]: JSON.stringify(data, null, 2),
    stdout: summarize(data, ['http_reqs', 'http_req_duration', 'http_req_failed']),
  };
}
