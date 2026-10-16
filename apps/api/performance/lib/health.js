import http from 'k6/http';
import { API, authHeaders } from './common.js';

/**
 * Health-monitoring benchmark helpers.
 *
 * Ingestion is exactly-once: every request must carry a unique `idempotency-key`
 * (and a unique `sourceId`), otherwise it is a replay and writes nothing — which
 * is correct behaviour but useless as a throughput measurement. These helpers
 * mint those unique values from the k6 VU/iteration so each request is a fresh
 * write.
 */

/** The seeded synthetic patients (handle `pat-XXXX`), which have PatientProfiles. */
export function patients(ids, take = 10) {
  return ids
    .filter((u) => typeof u.handle === 'string' && u.handle.startsWith('pat-'))
    .slice(0, take)
    .map((u) => u.id);
}

let seq = 0;
export function unique(prefix) {
  seq += 1;
  return `${prefix}-${__VU}-${__ITER}-${seq}-${Date.now()}`;
}

/** A vitals observation body (no reference range required). */
export function observationBody(sourceId) {
  return {
    category: 'VITAL_SIGNS',
    code: '8867-4',
    codeSystem: 'http://loinc.org',
    display: 'Heart rate',
    valueNumeric: 60 + Math.floor(Math.random() * 40),
    valueUnit: 'beats/min',
    effectiveAt: new Date().toISOString(),
    sourceId,
  };
}

export function adherenceBody(sourceId) {
  return {
    type: 'MEDICATION_TAKEN',
    protocolItemKey: 'perf-med-am',
    occurredAt: new Date().toISOString(),
    sourceId,
  };
}

/**
 * A minimal, vitals-only FHIR R4 Bundle. It names an existing seeded patient
 * (so the ingestion reuses that profile rather than provisioning a new one) and
 * carries `n` unique observations. Vitals need no reference range, so the
 * bundle is range-independent.
 */
export function fhirBundle(mrn, n) {
  const entry = [
    {
      resource: {
        resourceType: 'Patient',
        identifier: [{ system: 'urn:tangerine:mrn', value: mrn }],
        gender: 'female',
        birthDate: '1985-01-01',
      },
    },
  ];
  for (let i = 0; i < n; i++) {
    entry.push({
      resource: {
        resourceType: 'Observation',
        id: unique('k6-obs'),
        status: 'final',
        category: [{ coding: [{ code: 'vital-signs' }] }],
        code: {
          coding: [
            { system: 'http://loinc.org', code: '8867-4', display: 'Heart rate' },
          ],
        },
        effectiveDateTime: new Date().toISOString(),
        valueQuantity: { value: 60 + Math.floor(Math.random() * 40), unit: 'beats/min' },
      },
    });
  }
  return { resourceType: 'Bundle', type: 'collection', entry };
}

export function postIngest(path, patientId, body, key) {
  return http.post(`${API}${path}`, JSON.stringify(body), {
    headers: {
      ...authHeaders(patientId).headers,
      'idempotency-key': key,
    },
  });
}
