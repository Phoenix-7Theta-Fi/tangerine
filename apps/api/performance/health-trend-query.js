import http from 'k6/http';
import { artifactPath, API, authHeaders, stamp, summarize } from './lib/common.js';

/**
 * Trend query latency as the observation count grows.
 *
 * GET /clinical/trends picks the latest value per code with `DISTINCT ON` over
 * the `(patientId, code, effectiveAt)` index, then resolves a reference range
 * per code. Run it against a patient seeded with an increasing TREND_OBS count
 * (`seed-health-perf.ts MODE=trend`) and compare the percentiles: the index
 * makes "latest per code" a bounded lookup, so latency should stay flat while
 * the row count multiplies.
 */

const VUS = Number(__ENV.VUS || 4);
const ITERS = Number(__ENV.ITERS || 200);
const LABEL = __ENV.LABEL || 'n';
const CODE = __ENV.PERF_CODE || '8867-4';

export const options = {
  scenarios: {
    trends: { executor: 'per-vu-iterations', vus: VUS, iterations: ITERS },
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
    `${API}/clinical/trends?lookbackDays=90&codes=${CODE}`,
    authHeaders(data.id),
  );
}

export function handleSummary(data) {
  return {
    [artifactPath(`health-trend-query-${LABEL}-${stamp()}`)]: JSON.stringify(data, null, 2),
    stdout: summarize(data, ['http_reqs', 'http_req_duration', 'http_req_failed']),
  };
}
