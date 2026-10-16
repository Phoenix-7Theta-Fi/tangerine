import http from 'k6/http';
import { Trend } from 'k6/metrics';
import { artifactPath, authHeaders, identities, stamp, summarize } from './lib/common.js';
import { observationBody, patients, postIngest, unique } from './lib/health.js';

/**
 * Observation ingestion throughput.
 *
 * POST /clinical/observations is exactly-once (idempotency key) and writes the
 * row plus an outbox event in one transaction; the relay then publishes to the
 * health queue and the worker derives a trend. This measures the request path;
 * the runner samples outbox lag before/after to show whether the relay or the
 * worker falls behind the writers.
 *
 * The body is a vital sign, so no reference range is involved: this isolates the
 * write + outbox cost.
 */

const VUS = Number(__ENV.VUS || 20);
const DURATION = __ENV.DURATION || '30s';

export const options = {
  scenarios: {
    ingest: { executor: 'constant-vus', vus: VUS, duration: DURATION },
  },
  thresholds: {
    http_req_failed: ['rate<0.01'],
  },
};

const accepted = new Trend('ingest_accepted', true);

export function setup() {
  const ids = identities();
  const pool = patients(ids, Number(__ENV.PATIENTS || 20));
  if (pool.length === 0) throw new Error('no seeded pat-* patients; run pnpm db:seed');
  return { pool };
}

export default function (data) {
  const patientId = data.pool[__VU % data.pool.length];
  const src = unique('k6-obs');
  const res = postIngest(
    '/clinical/observations',
    patientId,
    observationBody(src),
    src,
  );
  if (res.status === 202) accepted.add(1);
}

export function handleSummary(data) {
  return {
    [artifactPath(`health-observation-ingestion-${stamp()}`)]: JSON.stringify(data, null, 2),
    stdout: summarize(data, ['http_reqs', 'http_req_duration', 'http_req_failed', 'ingest_accepted']),
  };
}
