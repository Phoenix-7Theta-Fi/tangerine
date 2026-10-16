import { Trend } from 'k6/metrics';
import { artifactPath, identities, stamp, summarize } from './lib/common.js';
import { fhirBundle, patients, postIngest, unique } from './lib/health.js';

/**
 * FHIR bundle ingestion throughput.
 *
 * Each request is a full Bundle that the endpoint validates, extracts, and
 * writes (one Patient reference reused, `OBS_PER_BUNDLE` observations per
 * bundle). This is the batch-import path: more work per request than a single
 * observation, so the achievable requests/second is lower but the rows/second
 * is higher.
 */

const VUS = Number(__ENV.VUS || 10);
const DURATION = __ENV.DURATION || '30s';
const OBS_PER_BUNDLE = Number(__ENV.OBS_PER_BUNDLE || 3);

export const options = {
  scenarios: {
    bundles: { executor: 'constant-vus', vus: VUS, duration: DURATION },
  },
  thresholds: {
    http_req_failed: ['rate<0.01'],
  },
};

const obsWritten = new Trend('bundle_observations_written', true);

export function setup() {
  const ids = identities();
  const pool = patients(ids, Number(__ENV.PATIENTS || 10));
  if (pool.length === 0) throw new Error('no seeded pat-* patients; run pnpm db:seed');
  // Bundle MRNs must match an existing profile; pat-NNNN → MRN-NNNN.
  const mrns = ids
    .filter((u) => typeof u.handle === 'string' && u.handle.startsWith('pat-'))
    .slice(0, Number(__ENV.PATIENTS || 10))
    .map((u) => `MRN-${u.handle.slice(4)}`);
  return { pool, mrns };
}

export default function (data) {
  const i = __VU % data.pool.length;
  const patientId = data.pool[i];
  const key = unique('k6-bundle');
  const res = postIngest(
    '/clinical/ingest/fhir',
    patientId,
    fhirBundle(data.mrns[i], OBS_PER_BUNDLE),
    key,
  );
  if (res.status === 202) {
    obsWritten.add(res.json('observations') ?? 0);
  }
}

export function handleSummary(data) {
  return {
    [artifactPath(`health-fhir-bundle-ingestion-${stamp()}`)]: JSON.stringify(data, null, 2),
    stdout: summarize(data, [
      'http_reqs',
      'http_req_duration',
      'http_req_failed',
      'bundle_observations_written',
    ]),
  };
}
