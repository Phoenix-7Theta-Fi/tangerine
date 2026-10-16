import { readFileSync } from 'node:fs';
import { gunzipSync } from 'node:zlib';
import { join } from 'node:path';

// Shape of apps/api/prisma/synthetic/health-population.json(.gz), produced by
// generate-health-seed.mjs. FHIR resources are kept loosely typed on purpose —
// the seeder maps the fields it needs (see docs/research/… §4).
export interface FhirBundleEntry {
  fullUrl: string;
  resource: { resourceType: string; id: string; [k: string]: unknown };
  request: { method: string; url: string };
}

export interface FhirBundle {
  resourceType: 'Bundle';
  type: 'transaction';
  id: string;
  timestamp: string;
  entry: FhirBundleEntry[];
}

export interface SyntheticPatient {
  patientId: string;
  mrn: string;
  sex: 'male' | 'female';
  birthDate: string;
  conditions: string[];
  bundle: FhirBundle;
}

export interface ReferenceRangeRow {
  code: string;
  display: string;
  unit: string;
  sex: 'MALE' | 'FEMALE' | null;
  ageMinDays: number | null;
  ageMaxDays: number | null;
  lowValue: number | null;
  highValue: number | null;
}

export interface HealthPopulation {
  meta: {
    generator: string;
    version: string;
    seed: number;
    generatedAt: string;
    patientCount: number;
    referenceRangeCount: number;
    resourceCounts: Record<string, number>;
  };
  referenceRanges: ReferenceRangeRow[];
  patients: SyntheticPatient[];
}

export const HEALTH_POPULATION_PATH = join(__dirname, 'health-population.json.gz');

export function loadHealthPopulation(path: string = HEALTH_POPULATION_PATH): HealthPopulation {
  const raw = readFileSync(path);
  const json = path.endsWith('.gz') ? gunzipSync(raw).toString('utf8') : raw.toString('utf8');
  return JSON.parse(json) as HealthPopulation;
}
