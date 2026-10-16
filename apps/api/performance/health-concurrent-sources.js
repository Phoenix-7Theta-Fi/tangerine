import { Counter } from 'k6/metrics';
import { artifactPath, identities, stamp, summarize } from './lib/common.js';
import {
  adherenceBody,
  fhirBundle,
  observationBody,
  patients,
  postIngest,
  unique,
} from './lib/health.js';

/**
 * Concurrent ingestion from multiple sources.
 *
 * Three independent writers hit the pipeline at once, as they would in
 * production: a **device stream** (single observations), a **batch import**
 * (FHIR bundles), and **manual entry** (adherence events). Each iteration picks
 * its source by VU so all three run concurrently for the whole scenario. The
 * question is whether mixing them degrades any one path or the shared outbox.
 */

const VUS = Number(__ENV.VUS || 15);
const DURATION = __ENV.DURATION || '30s';

export const options = {
  scenarios: {
    mixed: { executor: 'constant-vus', vus: VUS, duration: DURATION },
  },
  thresholds: {
    http_req_failed: ['rate<0.01'],
  },
};

const device = new Counter('source_device_ok');
const bundle = new Counter('source_bundle_ok');
const manual = new Counter('source_manual_ok');

export function setup() {
  const ids = identities();
  const pool = patients(ids, Number(__ENV.PATIENTS || 20));
  if (pool.length === 0) throw new Error('no seeded pat-* patients; run pnpm db:seed');
  const mrns = ids
    .filter((u) => typeof u.handle === 'string' && u.handle.startsWith('pat-'))
    .slice(0, Number(__ENV.PATIENTS || 20))
    .map((u) => `MRN-${u.handle.slice(4)}`);
  return { pool, mrns };
}

export default function (data) {
  const i = __VU % data.pool.length;
  const patientId = data.pool[i];
  const kind = __VU % 3;

  if (kind === 0) {
    const src = unique('k6-device');
    if (postIngest('/clinical/observations', patientId, observationBody(src), src).status === 202)
      device.add(1);
  } else if (kind === 1) {
    const key = unique('k6-bundle');
    if (
      postIngest('/clinical/ingest/fhir', patientId, fhirBundle(data.mrns[i], 3), key).status === 202
    )
      bundle.add(1);
  } else {
    const src = unique('k6-manual');
    if (postIngest('/clinical/adherence-events', patientId, adherenceBody(src), src).status === 202)
      manual.add(1);
  }
}

export function handleSummary(data) {
  return {
    [artifactPath(`health-concurrent-sources-${stamp()}`)]: JSON.stringify(data, null, 2),
    stdout: summarize(data, [
      'http_reqs',
      'http_req_duration',
      'http_req_failed',
      'source_device_ok',
      'source_bundle_ok',
      'source_manual_ok',
    ]),
  };
}
