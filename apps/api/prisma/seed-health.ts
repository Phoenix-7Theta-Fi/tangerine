/* eslint-disable no-console */
// Health-monitoring seed: loads the Phase 0 synthetic bundle into the clinical
// event store, the observation store and the reference-range catalog.
//
// Run AFTER the main seed (`prisma db seed`), since the main seed clears the
// User table and this seed attaches patient Users. It is idempotent: every row
// carries a deterministic key and is inserted with skipDuplicates, so running
// it twice inserts nothing new. Set HEALTH_SEED_RESET=1 to TRUNCATE the health
// tables first (never the User table).
//
//   pnpm --filter @tangerine/api prisma:seed-health
import {
  PrismaClient,
  Sex,
  DataSource,
  ClinicalEventType,
  ObservationCategory,
} from '@prisma/client';
import {
  loadHealthPopulation,
  type ReferenceRangeRow,
  type SyntheticPatient,
} from './synthetic/load-health-seed';

const prisma = new PrismaClient();

const FHIR_CATEGORY: Record<string, ObservationCategory> = {
  'vital-signs': ObservationCategory.VITAL_SIGNS,
  laboratory: ObservationCategory.LABORATORY,
  activity: ObservationCategory.ACTIVITY,
  sleep: ObservationCategory.SLEEP,
  nutrition: ObservationCategory.NUTRITION,
  'social-history': ObservationCategory.SOCIAL_HISTORY,
  exam: ObservationCategory.EXAM,
  device: ObservationCategory.DEVICE,
};

const EVENT_TYPE: Record<string, ClinicalEventType> = {
  Condition: ClinicalEventType.CONDITION,
  Encounter: ClinicalEventType.ENCOUNTER,
  Procedure: ClinicalEventType.PROCEDURE,
  MedicationRequest: ClinicalEventType.MEDICATION_ORDER,
  Immunization: ClinicalEventType.IMMUNIZATION,
  AllergyIntolerance: ClinicalEventType.ALLERGY,
};

const sexEnum = (s: string): Sex => (s === 'male' ? Sex.MALE : s === 'female' ? Sex.FEMALE : Sex.UNKNOWN);
const DAY_MS = 86400000;

// Same specificity rule as the generator: sex-specific beats wildcard, then the
// narrowest age band. Used both to seed and to validate coverage.
function resolveRange(
  ranges: ReferenceRangeRow[],
  code: string,
  unit: string,
  sex: 'MALE' | 'FEMALE',
  ageDays: number,
): ReferenceRangeRow | null {
  const candidates = ranges.filter(
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

interface ClinicalEventRow {
  patientId: string;
  type: ClinicalEventType;
  code: string;
  codeSystem: string;
  display: string;
  status: string | null;
  onsetAt: Date | null;
  endedAt: Date | null;
  recordedAt: Date;
  dataSource: DataSource;
  sourceId: string;
  encounterId: string | null;
}

interface ObservationRow {
  patientId: string;
  category: ObservationCategory;
  code: string;
  codeSystem: string;
  display: string;
  valueNumeric: number | null;
  valueString: string | null;
  valueCode: string | null;
  valueUnit: string | null;
  effectiveAt: Date;
  issuedAt: Date | null;
  dataSource: DataSource;
  sourceId: string;
  encounterId: string | null;
}

const firstCode = (cc: any): { code: string; system: string; display: string } => {
  const coding = cc?.coding?.[0] ?? {};
  return { code: coding.code ?? '', system: coding.system ?? '', display: coding.display ?? cc?.text ?? coding.code ?? '' };
};

function mapClinicalEvents(patientId: string, patient: SyntheticPatient, events: ClinicalEventRow[]) {
  for (const e of patient.bundle.entry) {
    const type = EVENT_TYPE[e.resource.resourceType];
    if (!type) continue;
    const r = e.resource as any;
    if (type === ClinicalEventType.CONDITION) {
      const c = firstCode(r.code);
      events.push({
        patientId, type, code: c.code, codeSystem: c.system, display: c.display,
        status: r.clinicalStatus?.coding?.[0]?.code ?? r.status ?? null,
        onsetAt: r.onsetDateTime ? new Date(r.onsetDateTime) : null,
        endedAt: r.abatementDateTime ? new Date(r.abatementDateTime) : null,
        recordedAt: r.recordedDate ? new Date(r.recordedDate) : new Date(),
        dataSource: DataSource.SEED, sourceId: r.id,
        encounterId: r.encounter?.reference?.split('/')[1] ?? null,
      });
    } else if (type === ClinicalEventType.ENCOUNTER) {
      events.push({
        patientId, type, code: r.class?.code ?? 'AMB', codeSystem: r.class?.system ?? '', display: 'ambulatory',
        status: r.status ?? null,
        onsetAt: r.period?.start ? new Date(r.period.start) : null,
        endedAt: r.period?.end ? new Date(r.period.end) : null,
        recordedAt: r.period?.start ? new Date(r.period.start) : new Date(),
        dataSource: DataSource.SEED, sourceId: r.id, encounterId: null,
      });
    } else if (type === ClinicalEventType.PROCEDURE) {
      const c = firstCode(r.code);
      events.push({
        patientId, type, code: c.code, codeSystem: c.system, display: c.display,
        status: r.status ?? null,
        onsetAt: r.performedDateTime ? new Date(r.performedDateTime) : null,
        endedAt: null,
        recordedAt: r.performedDateTime ? new Date(r.performedDateTime) : new Date(),
        dataSource: DataSource.SEED, sourceId: r.id,
        encounterId: r.encounter?.reference?.split('/')[1] ?? null,
      });
    } else if (type === ClinicalEventType.MEDICATION_ORDER) {
      const c = firstCode(r.medicationCodeableConcept);
      events.push({
        patientId, type, code: c.code, codeSystem: c.system, display: c.display,
        status: r.status ?? null,
        onsetAt: r.authoredOn ? new Date(r.authoredOn) : null,
        endedAt: null,
        recordedAt: r.authoredOn ? new Date(r.authoredOn) : new Date(),
        dataSource: DataSource.SEED, sourceId: r.id, encounterId: null,
      });
    }
  }
}

function mapObservations(patientId: string, patient: SyntheticPatient, obs: ObservationRow[]) {
  for (const e of patient.bundle.entry) {
    if (e.resource.resourceType !== 'Observation') continue;
    const r = e.resource as any;
    const c = firstCode(r.code);
    const catCode = r.category?.[0]?.coding?.[0]?.code ?? 'laboratory';
    const category = FHIR_CATEGORY[catCode] ?? ObservationCategory.LABORATORY;
    const q = r.valueQuantity;
    obs.push({
      patientId,
      category,
      code: c.code,
      codeSystem: c.system || 'http://loinc.org',
      display: c.display,
      valueNumeric: typeof q?.value === 'number' ? q.value : null,
      valueString: typeof r.valueString === 'string' ? r.valueString : null,
      valueCode: r.valueCodeableConcept?.coding?.[0]?.code ?? null,
      valueUnit: q?.unit ?? null,
      effectiveAt: new Date(r.effectiveDateTime),
      issuedAt: r.issued ? new Date(r.issued) : null,
      dataSource: DataSource.SEED,
      sourceId: r.id,
      encounterId: r.encounter?.reference?.split('/')[1] ?? null,
    });
  }
}

async function main() {
  const population = loadHealthPopulation();
  const { meta, referenceRanges, patients } = population;
  console.log(
    `Loaded synthetic bundle: gen ${meta.generator} v${meta.version} seed ${meta.seed}, ` +
      `${patients.length} patients, ${meta.resourceCounts.Observation ?? 0} observations`,
  );

  if (process.env.HEALTH_SEED_RESET === '1') {
    console.log('HEALTH_SEED_RESET=1 — truncating health tables (TRUNCATE bypasses row triggers)...');
    await prisma.$executeRawUnsafe(
      'TRUNCATE "Observation", "ClinicalEvent", "ReferenceRange" RESTART IDENTITY CASCADE;',
    );
  }

  // ── reference ranges (deterministic ids => idempotent) ────────────────────
  const rangeRows = referenceRanges.map((r) => ({
    id: `rr|${r.code}|${r.unit}|${r.sex ?? 'any'}|${r.ageMinDays ?? 'x'}|${r.ageMaxDays ?? 'x'}`,
    code: r.code,
    codeSystem: 'http://loinc.org',
    display: r.display,
    valueUnit: r.unit,
    sex: r.sex === null ? null : (r.sex as Sex),
    ageMinDays: r.ageMinDays,
    ageMaxDays: r.ageMaxDays,
    lowValue: r.lowValue,
    highValue: r.highValue,
    // Population ranges are valid historically, not just from seed time: set the
    // window well before any seeded observation so resolution at
    // observation-time finds them.
    effectiveFrom: new Date('2000-01-01T00:00:00Z'),
  }));
  const ranges = await prisma.referenceRange.createMany({ data: rangeRows, skipDuplicates: true });
  console.log(`ReferenceRange: ${ranges.count} inserted (${rangeRows.length - ranges.count} already present)`);

  // ── patients: profile + users ─────────────────────────────────────────────
  const allEvents: ClinicalEventRow[] = [];
  const allObs: ObservationRow[] = [];
  let createdUsers = 0;
  let coverageChecked = 0;

  for (const p of patients) {
    const handle = p.patientId.toLowerCase();
    const existing = await prisma.user.findUnique({ where: { handle } });
    const user =
      existing ??
      (await prisma.user.create({
        data: {
          handle,
          displayName: `Synthetic Patient ${p.patientId.slice(4)}`,
          role: 'MEMBER',
          bio: 'Synthetic patient record for health-monitoring development.',
        },
      }));
    if (!existing) createdUsers += 1;

    await prisma.patientProfile.upsert({
      where: { userId: user.id },
      create: { userId: user.id, mrn: p.mrn, sex: sexEnum(p.sex), birthDate: new Date(p.birthDate) },
      update: { mrn: p.mrn, sex: sexEnum(p.sex), birthDate: new Date(p.birthDate) },
    });

    // Coverage assertion: every laboratory observation must resolve a range for
    // this patient's demographics at the observation's effective time.
    const labSex: 'MALE' | 'FEMALE' = p.sex === 'male' ? 'MALE' : 'FEMALE';
    for (const e of p.bundle.entry) {
      if (e.resource.resourceType !== 'Observation') continue;
      const r = e.resource as any;
      if ((r.category?.[0]?.coding?.[0]?.code ?? '') !== 'laboratory') continue;
      const ageDays = Math.floor((Date.parse(r.effectiveDateTime) - Date.parse(p.birthDate)) / DAY_MS);
      const rr = resolveRange(referenceRanges, r.code.coding[0].code, r.valueQuantity.unit, labSex, ageDays);
      if (!rr) {
        throw new Error(
          `no reference range for lab ${r.code.coding[0].code} (${r.valueQuantity.unit}) ` +
            `sex=${p.sex} ageDays=${ageDays} patient=${p.patientId}`,
        );
      }
      coverageChecked += 1;
    }

    mapClinicalEvents(user.id, p, allEvents);
    mapObservations(user.id, p, allObs);
  }
  console.log(`Users: ${createdUsers} created (${patients.length - createdUsers} already present); lab coverage checked: ${coverageChecked}`);

  // ── bulk insert (idempotent on (patientId, sourceId)) ─────────────────────
  const CHUNK = 5000;
  let eventsInserted = 0;
  for (let i = 0; i < allEvents.length; i += CHUNK) {
    const res = await prisma.clinicalEvent.createMany({ data: allEvents.slice(i, i + CHUNK), skipDuplicates: true });
    eventsInserted += res.count;
  }
  let obsInserted = 0;
  for (let i = 0; i < allObs.length; i += CHUNK) {
    const res = await prisma.observation.createMany({ data: allObs.slice(i, i + CHUNK), skipDuplicates: true });
    obsInserted += res.count;
  }
  console.log(`ClinicalEvent: ${eventsInserted}/${allEvents.length} inserted`);
  console.log(`Observation:   ${obsInserted}/${allObs.length} inserted`);

  const [obsTotal, evTotal, rangesTotal] = await Promise.all([
    prisma.observation.count(),
    prisma.clinicalEvent.count(),
    prisma.referenceRange.count(),
  ]);
  console.log(`Totals now — Observation=${obsTotal} ClinicalEvent=${evTotal} ReferenceRange=${rangesTotal}`);
  if (obsTotal !== (meta.resourceCounts.Observation ?? 0)) {
    console.warn(
      `note: Observation table holds ${obsTotal} rows vs bundle's ${meta.resourceCounts.Observation} ` +
        `(other suites may have added rows; re-runs are idempotent)`,
    );
  }
  console.log('\nHealth seed complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
