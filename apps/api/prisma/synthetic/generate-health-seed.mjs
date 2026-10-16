#!/usr/bin/env node
// Synthea-shaped synthetic patient generator (offline, deterministic).
//
// Emits apps/api/prisma/synthetic/health-population.json: a versioned seed
// bundle of FHIR R4 transaction Bundles (one per patient) plus the
// reference-range catalog. Determinism is the point: a fixed seed and a fixed
// "now" produce byte-identical output, so the committed bundle is reproducible.
//
// Design reference: Synthea (https://github.com/synthetichealth/synthea) emits
// per-patient FHIR R4 bundles containing Patient, Encounter, Condition,
// Observation, Procedure and MedicationRequest. This generator mirrors that
// resource set (see docs/research/health-monitoring-research.md §4) so the same
// bundles could be produced by Synthea unchanged.
//
// Usage:
//   node apps/api/prisma/synthetic/generate-health-seed.mjs [outPath]
// Env:
//   SEED         PRNG seed (default 20261016)
//   PATIENTS     patient count (default 100)
//
import { writeFileSync, mkdirSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const SEED = Number(process.env.SEED ?? 20261016);
const PATIENTS = Number(process.env.PATIENTS ?? 100);
// Fixed generation instant so output is reproducible.
const NOW = Date.parse('2026-10-16T12:00:00Z');
const DAY_MS = 86400000;

// ── deterministic PRNG (mulberry32) ─────────────────────────────────────────
function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rng = mulberry32(SEED);
const rand = () => rng();
const randInt = (lo, hi) => lo + Math.floor(rng() * (hi - lo + 1));
const pick = (arr) => arr[Math.floor(rng() * arr.length)];
const round = (v, d = 0) => {
  const f = 10 ** d;
  return Math.round(v * f) / f;
};
const iso = (ms) => new Date(ms).toISOString();
const addDays = (ms, d) => ms + d * DAY_MS;
const dateOnly = (ms) => new Date(ms).toISOString().slice(0, 10);

// ── code systems ────────────────────────────────────────────────────────────
const LOINC = 'http://loinc.org';
const UCUM = 'http://unitsofmeasure.org';
const ICD10 = 'http://hl7.org/fhir/sid/icd-10-cm';
const SNOMED = 'http://snomed.info/sct';
const RXNORM = 'http://www.nlm.nih.gov/research/umls/rxnorm';
const OBS_CATEGORY = 'http://terminology.hl7.org/CodeSystem/observation-category';
const COND_CLINICAL = 'http://terminology.hl7.org/CodeSystem/condition-clinical';
const COND_VER = 'http://terminology.hl7.org/CodeSystem/condition-ver-status';
const ACT_CODE = 'http://terminology.hl7.org/CodeSystem/v3-ActCode';

// Age bands, in days. null = unbounded.
const BAND = {
  neonate: [0, 364],
  child: [365, 6570],
  adult: [6571, null],
  any: [null, null],
};

// Reference-range catalog. `sex` null = any. Multiple rows per code are
// resolved by specificity (sex match > narrower age band), see
// resolveRange() below and docs/research/health-monitoring-research.md §3.
const RANGE_ROWS = [
  // vitals
  ['8867-4', 'Heart rate', '/min', null, ...BAND.neonate, 100, 160],
  ['8867-4', 'Heart rate', '/min', null, ...BAND.child, 70, 120],
  ['8867-4', 'Heart rate', '/min', null, ...BAND.adult, 60, 100],
  ['9279-1', 'Respiratory rate', '/min', null, ...BAND.child, 18, 30],
  ['9279-1', 'Respiratory rate', '/min', null, ...BAND.adult, 12, 20],
  ['8310-5', 'Body temperature', 'Cel', null, ...BAND.any, 36.1, 37.8],
  ['8480-6', 'Systolic blood pressure', 'mm[Hg]', null, ...BAND.child, 90, 120],
  ['8480-6', 'Systolic blood pressure', 'mm[Hg]', null, ...BAND.adult, 90, 130],
  ['8462-4', 'Diastolic blood pressure', 'mm[Hg]', null, ...BAND.child, 50, 80],
  ['8462-4', 'Diastolic blood pressure', 'mm[Hg]', null, ...BAND.adult, 60, 80],
  ['2708-6', 'Oxygen saturation', '%', null, ...BAND.any, 95, 100],
  ['39156-5', 'Body mass index', 'kg/m2', null, ...BAND.adult, 18.5, 24.9],
  ['39156-5', 'Body mass index', 'kg/m2', null, ...BAND.any, 14, 30],
  // labs
  ['4548-4', 'Hemoglobin A1c', '%', null, ...BAND.any, 4.0, 5.6],
  ['2339-0', 'Glucose', 'mg/dL', null, ...BAND.any, 70, 100],
  ['2093-3', 'Total cholesterol', 'mg/dL', null, ...BAND.any, 125, 200],
  ['2085-9', 'HDL cholesterol', 'mg/dL', 'MALE', ...BAND.any, 40, 90],
  ['2085-9', 'HDL cholesterol', 'mg/dL', 'FEMALE', ...BAND.any, 50, 100],
  ['2085-9', 'HDL cholesterol', 'mg/dL', null, ...BAND.any, 40, 100],
  ['13457-7', 'LDL cholesterol', 'mg/dL', null, ...BAND.any, 0, 100],
  ['2571-8', 'Triglycerides', 'mg/dL', null, ...BAND.any, 0, 150],
  ['2160-0', 'Creatinine', 'mg/dL', 'MALE', ...BAND.adult, 0.7, 1.3],
  ['2160-0', 'Creatinine', 'mg/dL', 'FEMALE', ...BAND.adult, 0.6, 1.1],
  ['2160-0', 'Creatinine', 'mg/dL', null, ...BAND.any, 0.5, 1.3],
  ['33914-3', 'eGFR', 'mL/min/{1.73_m2}', null, ...BAND.any, 90, 200],
  ['718-7', 'Hemoglobin', 'g/dL', 'MALE', ...BAND.adult, 13.5, 17.5],
  ['718-7', 'Hemoglobin', 'g/dL', 'FEMALE', ...BAND.adult, 12.0, 15.5],
  ['718-7', 'Hemoglobin', 'g/dL', null, ...BAND.any, 10.0, 17.5],
  ['6690-2', 'Leukocytes', '10*3/uL', null, ...BAND.any, 4.5, 11.0],
  ['777-3', 'Platelets', '10*3/uL', null, ...BAND.any, 150, 400],
  ['3016-3', 'Thyrotropin', 'mIU/L', null, ...BAND.any, 0.4, 4.0],
  ['2951-2', 'Sodium', 'mmol/L', null, ...BAND.any, 135, 145],
  ['2823-3', 'Potassium', 'mmol/L', null, ...BAND.any, 3.5, 5.1],
  ['1742-6', 'Alanine aminotransferase', 'U/L', 'MALE', ...BAND.any, 7, 55],
  ['1742-6', 'Alanine aminotransferase', 'U/L', 'FEMALE', ...BAND.any, 7, 45],
  ['1742-6', 'Alanine aminotransferase', 'U/L', null, ...BAND.any, 7, 55],
  ['1920-8', 'Aspartate aminotransferase', 'U/L', null, ...BAND.any, 8, 48],
].map((r) => ({
  code: r[0], display: r[1], unit: r[2], sex: r[3],
  ageMinDays: r[4], ageMaxDays: r[5], lowValue: r[6], highValue: r[7],
}));

// specificity: sex-specific (+2) and bounded-age (+1) beat wildcards; a
// narrower age span beats a wider one.
function resolveRange(code, unit, sex, ageDays) {
  const candidates = RANGE_ROWS.filter(
    (r) =>
      r.code === code &&
      r.unit === unit &&
      (r.sex === null || r.sex === sex) &&
      (r.ageMinDays === null || ageDays >= r.ageMinDays) &&
      (r.ageMaxDays === null || ageDays <= r.ageMaxDays),
  );
  candidates.sort((a, b) => {
    const specA = (a.sex ? 2 : 0) + (a.ageMinDays !== null && a.ageMaxDays !== null ? 1 : 0);
    const specB = (b.sex ? 2 : 0) + (b.ageMinDays !== null && b.ageMaxDays !== null ? 1 : 0);
    if (specA !== specB) return specB - specA;
    const spanA = (a.ageMaxDays ?? 1e9) - (a.ageMinDays ?? 0);
    const spanB = (b.ageMaxDays ?? 1e9) - (b.ageMinDays ?? 0);
    return spanA - spanB;
  });
  return candidates[0] ?? null;
}

// ── clinical vocabularies ───────────────────────────────────────────────────
const CONDITIONS = [
  { code: 'E11.9', display: 'Type 2 diabetes mellitus without complications', weight: 3, meds: [['860975', 'Metformin 500 MG'], ['896209', 'Glipizide 5 MG']] },
  { code: 'I10', display: 'Essential (primary) hypertension', weight: 4, meds: [['314076', 'Lisinopril 10 MG'], ['866924', 'Amlodipine 5 MG']] },
  { code: 'E78.5', display: 'Hyperlipidemia, unspecified', weight: 4, meds: [['617312', 'Atorvastatin 20 MG'], ['904475', 'Simvastatin 20 MG']] },
  { code: 'E66.9', display: 'Obesity, unspecified', weight: 2, meds: [] },
  { code: 'J45.909', display: 'Unspecified asthma, uncomplicated', weight: 2, meds: [['746763', 'Albuterol 90 MCG inhaler']] },
  { code: 'E03.9', display: 'Hypothyroidism, unspecified', weight: 2, meds: [['966224', 'Levothyroxine 50 MCG']] },
  { code: 'N18.3', display: 'Chronic kidney disease, stage 3', weight: 1, meds: [['314076', 'Lisinopril 10 MG']] },
  { code: 'M81.0', display: 'Age-related osteoporosis', weight: 1, meds: [['904420', 'Alendronate 70 MG']] },
];
const PROCEDURES = [
  { code: '428191000124101', display: 'Influenza vaccination' },
  { code: '118171000119103', display: 'Blood draw' },
  { code: '386472008', display: 'Electrocardiogram' },
  { code: '225358003', display: 'Wound care management' },
];
const ENCOUNTER_TYPES = [
  { code: '185349003', display: 'Encounter for check up' },
  { code: '390906007', display: 'Follow-up encounter' },
  { code: '50849002', display: 'Emergency room admission' },
];

// ── observation factories ───────────────────────────────────────────────────
// Each returns { code, unit, value } for a given patient context.
const VITALS = [
  { code: '8867-4', display: 'Heart rate', unit: '/min', gen: (c) => randInt(58, 108) - (c.atLete ? 8 : 0) },
  { code: '9279-1', display: 'Respiratory rate', unit: '/min', gen: () => randInt(11, 22) },
  { code: '8310-5', display: 'Body temperature', unit: 'Cel', gen: () => round(36.0 + rng() * 1.9, 1) },
  { code: '8480-6', display: 'Systolic blood pressure', unit: 'mm[Hg]', gen: (c) => randInt(96, 148) + (c.hypertensive ? 14 : 0) },
  { code: '8462-4', display: 'Diastolic blood pressure', unit: 'mm[Hg]', gen: (c) => randInt(56, 92) + (c.hypertensive ? 8 : 0) },
  { code: '2708-6', display: 'Oxygen saturation', unit: '%', gen: () => randInt(94, 100) },
];
const LABS = [
  { code: '4548-4', display: 'Hemoglobin A1c', unit: '%', gen: (c, i, n) => (c.diabetic ? round(9.4 - (7.4 - 6.4) * (i / Math.max(1, n - 1)) + (rng() - 0.5) * 0.4, 1) : round(4.6 + rng() * 0.9, 1)) },
  { code: '2339-0', display: 'Glucose', unit: 'mg/dL', gen: (c) => (c.diabetic ? randInt(110, 185) : randInt(74, 102)) },
  { code: '2093-3', display: 'Total cholesterol', unit: 'mg/dL', gen: (c) => randInt(150, 235) + (c.hyperlipidemic ? 25 : 0) },
  { code: '2085-9', display: 'HDL cholesterol', unit: 'mg/dL', gen: () => randInt(36, 78) },
  { code: '13457-7', display: 'LDL cholesterol', unit: 'mg/dL', gen: (c) => randInt(78, 170) + (c.hyperlipidemic ? 20 : 0) },
  { code: '2571-8', display: 'Triglycerides', unit: 'mg/dL', gen: (c) => randInt(70, 220) + (c.hyperlipidemic ? 40 : 0) },
  { code: '2160-0', display: 'Creatinine', unit: 'mg/dL', gen: (c) => round((c.ckd ? 1.6 : 0.7) + rng() * 0.5, 2) },
  { code: '33914-3', display: 'eGFR', unit: 'mL/min/{1.73_m2}', gen: (c) => (c.ckd ? randInt(38, 58) : randInt(92, 125)) },
  { code: '718-7', display: 'Hemoglobin', unit: 'g/dL', gen: (c) => round((c.sex === 'female' ? 12.4 : 14.0) + (rng() - 0.5) * 2.4, 1) },
  { code: '6690-2', display: 'Leukocytes', unit: '10*3/uL', gen: () => round(4.6 + rng() * 6.2, 1) },
  { code: '777-3', display: 'Platelets', unit: '10*3/uL', gen: () => randInt(160, 390) },
  { code: '3016-3', display: 'Thyrotropin', unit: 'mIU/L', gen: (c) => (c.hypothyroid ? round(4.4 + rng() * 2.2, 2) : round(0.5 + rng() * 3.2, 2)) },
  { code: '2951-2', display: 'Sodium', unit: 'mmol/L', gen: () => randInt(135, 145) },
  { code: '2823-3', display: 'Potassium', unit: 'mmol/L', gen: () => round(3.5 + rng() * 1.5, 1) },
  { code: '1742-6', display: 'Alanine aminotransferase', unit: 'U/L', gen: () => randInt(11, 58) },
  { code: '1920-8', display: 'Aspartate aminotransferase', unit: 'U/L', gen: () => randInt(12, 46) },
];

let fullUrlSeq = 0;
const fullUrl = (id) => `urn:uuid:${id.toLowerCase().replace(/[^a-z0-9]/g, '')}-${(fullUrlSeq++).toString(16)}`;

function obsResource(patientId, o, effectiveMs, issuedMs, category) {
  const res = {
    resourceType: 'Observation',
    id: o.id,
    status: 'final',
    category: [{ coding: [{ system: OBS_CATEGORY, code: category, display: category === 'vital-signs' ? 'Vital Signs' : 'Laboratory' }] }],
    code: { coding: [{ system: LOINC, code: o.code, display: o.display }], text: o.display },
    subject: { reference: `Patient/${patientId}` },
    effectiveDateTime: iso(effectiveMs),
    issued: iso(issuedMs),
    valueQuantity: { value: o.value, unit: o.unit, system: UCUM, code: o.unit },
  };
  if (o.range) {
    res.referenceRange = [
      {
        low: o.range.lowValue != null ? { value: o.range.lowValue, unit: o.unit } : undefined,
        high: o.range.highValue != null ? { value: o.range.highValue, unit: o.unit } : undefined,
        text: `${o.range.lowValue ?? ''}-${o.range.highValue ?? ''} ${o.unit}`.trim(),
      },
    ];
  }
  return res;
}

function entry(resource, method = 'POST', url = resource.resourceType) {
  return { fullUrl: fullUrl(resource.id), resource, request: { method, url } };
}

// ── patient generation ──────────────────────────────────────────────────────
const FIRST = ['Alex', 'Jordan', 'Sam', 'Taylor', 'Casey', 'Riley', 'Morgan', 'Avery', 'Quinn', 'Rowan', 'Drew', 'Parker', 'Skyler', 'Emerson', 'Finley', 'Hayden', 'Reese', 'Sage', 'Blake', 'Cameron'];
const LAST = ['Nguyen', 'Okafor', 'Rossi', 'Haddad', 'Kim', 'Silva', 'Novak', 'Bauer', 'Costa', 'Mensah', 'Ivanov', 'Tanaka', 'Lopez', 'Ahmed', 'Petrov', 'Dubois', 'Andersson', 'Yamamoto', 'Kaur', 'Mbeki'];

function makePatient(i) {
  const id = `PAT-${String(i).padStart(4, '0')}`;
  const sex = rand() < 0.5 ? 'male' : 'female';
  // First 6 patients are paediatric (incl. a neonate, to exercise age bands).
  const ageDays = i <= 1 ? 20 : i === 2 ? 200 : i === 3 ? 1460 : i === 4 ? 2920 : i === 5 ? 4745 : i === 6 ? 5840 : randInt(20 * 365, 85 * 365);
  const birthMs = addDays(NOW, -ageDays);
  const given = pick(FIRST);
  const family = pick(LAST);

  const conditions = [];
  const nCond = ageDays < 6570 ? randInt(0, 1) : randInt(1, 3);
  const chosen = new Set();
  for (let c = 0; c < nCond; c++) {
    const cond = pick(CONDITIONS);
    if (chosen.has(cond.code)) continue;
    chosen.add(cond.code);
    conditions.push(cond);
  }
  const ctx = {
    sex,
    ageDays,
    diabetic: chosen.has('E11.9'),
    hypertensive: chosen.has('I10'),
    hyperlipidemic: chosen.has('E78.5'),
    ckd: chosen.has('N18.3'),
    hypothyroid: chosen.has('E03.9'),
    atLete: rand() < 0.2,
  };

  const entries = [];

  // Patient
  const patientRes = {
    resourceType: 'Patient',
    id,
    identifier: [{ system: 'urn:tangerine:mrn', value: `MRN-${String(i).padStart(4, '0')}` }],
    name: [{ family, given: [given] }],
    gender: sex,
    birthDate: dateOnly(birthMs),
  };
  entries.push(entry(patientRes));

  // Encounters (2-4)
  const nEnc = randInt(2, 4);
  const encounterIds = [];
  for (let e = 0; e < nEnc; e++) {
    const encId = `ENC-${id}-${e + 1}`;
    encounterIds.push(encId);
    const started = addDays(NOW, -randInt(30, 700));
    const type = pick(ENCOUNTER_TYPES);
    entries.push(
      entry({
        resourceType: 'Encounter',
        id: encId,
        status: 'finished',
        class: { system: ACT_CODE, code: 'AMB', display: 'ambulatory' },
        type: [{ coding: [{ system: SNOMED, code: type.code, display: type.display }], text: type.display }],
        subject: { reference: `Patient/${id}` },
        period: { start: iso(started), end: iso(started + 45 * 60000) },
      }),
    );
  }

  // Conditions, linked to the first encounter
  const conditionIds = [];
  conditions.forEach((cond, ci) => {
    const condId = `COND-${id}-${ci + 1}`;
    conditionIds.push({ id: condId, code: cond.code });
    const onset = addDays(NOW, -randInt(60, 900));
    entries.push(
      entry({
        resourceType: 'Condition',
        id: condId,
        clinicalStatus: { coding: [{ system: COND_CLINICAL, code: 'active' }] },
        verificationStatus: { coding: [{ system: COND_VER, code: 'confirmed' }] },
        category: [{ coding: [{ system: SNOMED, code: 'encounter-diagnosis', display: 'Encounter Diagnosis' }] }],
        code: { coding: [{ system: ICD10, code: cond.code, display: cond.display }], text: cond.display },
        subject: { reference: `Patient/${id}` },
        encounter: { reference: `Encounter/${encounterIds[0]}` },
        onsetDateTime: iso(onset),
        recordedDate: iso(onset + randInt(0, 5) * DAY_MS),
      }),
    );
  });

  // Medication orders: every med references a condition it treats (the
  // referential-integrity invariant asserted in Phase 5).
  let medSeq = 0;
  for (const cond of conditions) {
    for (const [rx, name] of cond.meds) {
      if (rand() < 0.35) continue; // not everyone is on every therapy
      medSeq += 1;
      const condRef = conditionIds.find((c) => c.code === cond.code);
      entries.push(
        entry({
          resourceType: 'MedicationRequest',
          id: `MED-${id}-${medSeq}`,
          status: 'active',
          intent: 'order',
          medicationCodeableConcept: { coding: [{ system: RXNORM, code: rx, display: name }], text: name },
          subject: { reference: `Patient/${id}` },
          authoredOn: iso(addDays(NOW, -randInt(20, 800))),
          reasonReference: condRef ? [{ reference: `Condition/${condRef.id}` }] : [],
        }),
      );
    }
  }

  // Procedures (0-2)
  const nProc = randInt(0, 2);
  for (let p = 0; p < nProc; p++) {
    const proc = pick(PROCEDURES);
    entries.push(
      entry({
        resourceType: 'Procedure',
        id: `PROC-${id}-${p + 1}`,
        status: 'completed',
        code: { coding: [{ system: SNOMED, code: proc.code, display: proc.display }], text: proc.display },
        subject: { reference: `Patient/${id}` },
        encounter: { reference: `Encounter/${encounterIds[p % encounterIds.length]}` },
        performedDateTime: iso(addDays(NOW, -randInt(10, 600))),
      }),
    );
  }

  // Observations: vitals every ~60 days, labs every ~100 days (longitudinal).
  const vitalPoints = 3;
  for (let t = 0; t < vitalPoints; t++) {
    const eff = addDays(NOW, -t * 60);
    for (const v of VITALS) {
      const value = v.gen(ctx);
      const range = resolveRange(v.code, v.unit, sex, Math.floor((eff - birthMs) / DAY_MS));
      entries.push(
        entry(
          obsResource(id, { id: `OBS-${id}-V-${t}-${v.code}`, code: v.code, display: v.display, unit: v.unit, value, range }, eff, eff + randInt(0, 120) * 60000, 'vital-signs'),
        ),
      );
    }
  }

  const labCodes = ageDays < 365 ? LABS.filter((l) => ['718-7', '6690-2', '777-3', '2951-2', '2823-3'].includes(l.code)) : LABS;
  const labPoints = ageDays < 365 ? 1 : 2;
  for (let t = 0; t < labPoints; t++) {
    const eff = addDays(NOW, -t * 100 - randInt(0, 10));
    labCodes.forEach((l, idx) => {
      const value = l.gen(ctx, t, labPoints);
      const range = resolveRange(l.code, l.unit, sex, Math.floor((eff - birthMs) / DAY_MS));
      if (!range) throw new Error(`no reference range for ${l.code} ${l.unit} (sex=${sex}, ageDays=${Math.floor((eff - birthMs) / DAY_MS)})`);
      entries.push(
        entry(
          obsResource(id, { id: `OBS-${id}-L-${t}-${idx}-${l.code}`, code: l.code, display: l.display, unit: l.unit, value, range }, eff, eff + randInt(0, 60) * 60000, 'laboratory'),
        ),
      );
    });
  }

  // Device activity/sleep for the last 7 days.
  for (let d = 0; d < 7; d++) {
    const eff = addDays(NOW, -d) - 8 * 3600000;
    const steps = randInt(ctx.atLete ? 7000 : 1800, ctx.atLete ? 16000 : 11000);
    const sleep = round(5.4 + rng() * 3.2, 1);
    for (const [code, display, unit, value] of [
      ['55423-8', 'Number of steps (pedometer)', '{steps}', steps],
      ['93832-4', 'Sleep duration', 'h', sleep],
    ]) {
      entries.push(
        entry(
          obsResource(id, { id: `OBS-${id}-D-${d}-${code}`, code, display, unit, value, range: null }, eff, eff + 3 * 3600000, 'activity'),
        ),
      );
    }
  }

  return {
    patientId: id,
    mrn: `MRN-${String(i).padStart(4, '0')}`,
    sex,
    birthDate: dateOnly(birthMs),
    conditions: conditions.map((c) => c.code),
    bundle: {
      resourceType: 'Bundle',
      type: 'transaction',
      id: `bundle-${id}`,
      timestamp: iso(NOW),
      entry: entries,
    },
  };
}

const patients = [];
for (let i = 1; i <= PATIENTS; i++) patients.push(makePatient(i));

// ── invariant validation ────────────────────────────────────────────────────
// These mirror the referential-integrity assertions exercised in Phase 5, so a
// drifted generator fails here rather than at test time.
function validate(patients) {
  const problems = [];
  for (const p of patients) {
    const byType = (t) => p.bundle.entry.filter((e) => e.resource.resourceType === t).map((e) => e.resource);
    const patientIds = new Set(byType('Patient').map((r) => `Patient/${r.id}`));
    const conditionIds = new Set(byType('Condition').map((r) => `Condition/${r.id}`));
    for (const o of byType('Observation')) {
      if (!patientIds.has(o.subject?.reference)) problems.push(`${p.patientId}: observation ${o.id} bad subject`);
      const isLab = o.category?.[0]?.coding?.[0]?.code === 'laboratory';
      if (isLab) {
        const code = o.code.coding[0].code;
        const unit = o.valueQuantity.unit;
        const ageDays = Math.floor((Date.parse(o.effectiveDateTime) - Date.parse(p.birthDate)) / DAY_MS);
        if (!resolveRange(code, unit, p.sex, ageDays)) problems.push(`${p.patientId}: lab ${o.id} (${code}) has no reference range`);
      }
    }
    for (const m of byType('MedicationRequest')) {
      if (!patientIds.has(m.subject?.reference)) problems.push(`${p.patientId}: med ${m.id} bad subject`);
      if (!m.reasonReference?.length) problems.push(`${p.patientId}: med ${m.id} has no condition`);
      for (const rr of m.reasonReference ?? []) if (!conditionIds.has(rr.reference)) problems.push(`${p.patientId}: med ${m.id} dangling ${rr.reference}`);
    }
    for (const e of byType('Encounter')) if (!patientIds.has(e.subject?.reference)) problems.push(`${p.patientId}: encounter ${e.id} bad subject`);
    for (const c of byType('Condition')) if (!patientIds.has(c.subject?.reference)) problems.push(`${p.patientId}: condition ${c.id} bad subject`);
    for (const pr of byType('Procedure')) if (!patientIds.has(pr.subject?.reference)) problems.push(`${p.patientId}: procedure ${pr.id} bad subject`);
  }
  if (problems.length) throw new Error(`generator invariants violated:\n  ${problems.slice(0, 20).join('\n  ')}${problems.length > 20 ? `\n  … ${problems.length - 20} more` : ''}`);
}
validate(patients);

// ── manifest + write ────────────────────────────────────────────────────────
const countEntries = (p) => p.bundle.entry.reduce((acc, e) => {
  acc[e.resource.resourceType] = (acc[e.resource.resourceType] ?? 0) + 1;
  return acc;
}, {});
const totals = {};
for (const p of patients) {
  const c = countEntries(p);
  for (const [k, v] of Object.entries(c)) totals[k] = (totals[k] ?? 0) + v;
}

const out = {
  meta: {
    generator: 'tangerine-synthea-shaped',
    version: '1.0.0',
    seed: SEED,
    generatedAt: iso(NOW),
    patientCount: patients.length,
    referenceRangeCount: RANGE_ROWS.length,
    resourceCounts: totals,
  },
  referenceRanges: RANGE_ROWS,
  patients,
};

const here = dirname(fileURLToPath(import.meta.url));
const outPath = process.argv[2] ?? `${here}/health-population.json.gz`;
mkdirSync(dirname(outPath), { recursive: true });
const json = JSON.stringify(out) + '\n';
// Regenerating with the same SEED/PATIENTS yields byte-identical bytes: the
// payload is deterministic and gzipSync's header mtime is fixed at 0.
if (outPath.endsWith('.gz')) writeFileSync(outPath, gzipSync(json, { level: 9 }));
else writeFileSync(outPath, json);
console.log(`wrote ${outPath}: ${patients.length} patients, ${JSON.stringify(totals)}`);
