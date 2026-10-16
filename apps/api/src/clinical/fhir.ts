import { ClinicalEventType, ObservationCategory, Sex } from '@prisma/client';

// A self-contained FHIR R4 subset reader/validator. The system accepts the
// resource subset its stores model (Patient, Observation, Condition, Encounter,
// Procedure, MedicationRequest); anything it does not model is ignored, not
// rejected. See docs/research/health-monitoring-research.md §1, §4.

export interface ValidationIssue {
  path: string;
  code: string;
  message: string;
}

export interface ExtractedPatient {
  mrn: string;
  sex: Sex;
  birthDate: Date;
  displayName: string;
}

export interface ExtractedObservation {
  sourceId: string;
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
  encounterId: string | null;
  isLaboratory: boolean;
}

export interface ExtractedClinicalEvent {
  sourceId: string;
  type: ClinicalEventType;
  code: string;
  codeSystem: string;
  display: string;
  status: string | null;
  onsetAt: Date | null;
  endedAt: Date | null;
  recordedAt: Date;
  encounterId: string | null;
}

export interface ExtractedBundle {
  patient: ExtractedPatient;
  observations: ExtractedObservation[];
  clinicalEvents: ExtractedClinicalEvent[];
}

const MRN_SYSTEM = 'urn:tangerine:mrn';

const isObj = (v: unknown): v is Record<string, any> =>
  typeof v === 'object' && v !== null;

const firstCoding = (cc: any): { code: string; system: string; display: string } => {
  const coding = cc?.coding?.[0] ?? {};
  return {
    code: coding.code ?? '',
    system: coding.system ?? '',
    display: coding.display ?? cc?.text ?? coding.code ?? '',
  };
};

const sexOf = (gender: unknown): Sex => {
  switch (String(gender).toLowerCase()) {
    case 'male':
      return Sex.MALE;
    case 'female':
      return Sex.FEMALE;
    case 'other':
      return Sex.OTHER;
    default:
      return Sex.UNKNOWN;
  }
};

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

/**
 * Structural validation of the accepted FHIR subset. Returns a list of issues
 * (empty = valid); the caller turns a non-empty list into a structured 400.
 */
export function validateFhirBundle(bundle: unknown): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const err = (path: string, code: string, message: string) =>
    issues.push({ path, code, message });

  if (!isObj(bundle)) return [{ path: '$', code: 'not-object', message: 'Body must be a JSON object' }];
  if (bundle.resourceType !== 'Bundle') err('$.resourceType', 'not-bundle', 'resourceType must be "Bundle"');
  if (bundle.type !== 'transaction' && bundle.type !== 'collection')
    err('$.type', 'bad-type', 'Bundle.type must be "transaction" or "collection"');
  if (!Array.isArray(bundle.entry) || bundle.entry.length === 0) {
    err('$.entry', 'empty', 'Bundle.entry must be a non-empty array');
    return issues; // nothing further to inspect
  }

  let patients = 0;
  bundle.entry.forEach((e: unknown, i: number) => {
    const path = `$.entry[${i}]`;
    if (!isObj(e) || !isObj(e.resource)) {
      err(path, 'bad-entry', 'entry must have a resource object');
      return;
    }
    const r = e.resource;
    if (typeof r.resourceType !== 'string') {
      err(`${path}.resource`, 'no-resourceType', 'resource.resourceType is required');
      return;
    }
    switch (r.resourceType) {
      case 'Patient': {
        patients += 1;
        const idn = Array.isArray(r.identifier)
          ? r.identifier.find((x: any) => x?.system === MRN_SYSTEM && x?.value)
          : undefined;
        if (!idn) err(`${path}.resource.identifier`, 'no-mrn', `Patient needs an identifier with system ${MRN_SYSTEM}`);
        if (!r.birthDate || Number.isNaN(Date.parse(r.birthDate)))
          err(`${path}.resource.birthDate`, 'bad-birthDate', 'Patient.birthDate must be a date');
        break;
      }
      case 'Observation': {
        if (!firstCoding(r.code).code) err(`${path}.resource.code`, 'no-code', 'Observation.code.coding[0].code is required');
        if (!r.effectiveDateTime || Number.isNaN(Date.parse(r.effectiveDateTime)))
          err(`${path}.resource.effectiveDateTime`, 'bad-effective', 'Observation.effectiveDateTime is required');
        const hasValue =
          typeof r.valueQuantity?.value === 'number' ||
          typeof r.valueString === 'string' ||
          !!r.valueCodeableConcept?.coding?.[0]?.code;
        if (!hasValue) err(`${path}.resource.value[x]`, 'no-value', 'Observation requires a valueQuantity, valueString or valueCodeableConcept');
        break;
      }
      case 'Condition':
        if (!firstCoding(r.code).code) err(`${path}.resource.code`, 'no-code', 'Condition.code.coding[0].code is required');
        break;
      case 'Procedure':
        if (!firstCoding(r.code).code) err(`${path}.resource.code`, 'no-code', 'Procedure.code.coding[0].code is required');
        break;
      case 'MedicationRequest':
        if (!firstCoding(r.medicationCodeableConcept).code)
          err(`${path}.resource.medicationCodeableConcept`, 'no-code', 'MedicationRequest.medicationCodeableConcept.coding[0].code is required');
        break;
      case 'Encounter':
        break; // class is optional in our model
      default:
        break; // unmodelled resources are ignored
    }
  });

  if (patients === 0)
    err('$.entry', 'no-patient', `Bundle must contain a Patient with an ${MRN_SYSTEM} identifier`);
  if (patients > 1)
    err('$.entry', 'multiple-patients', 'Bundle must describe exactly one patient');

  return issues;
}

/** Extract the modelled resources into internal row shapes. Assumes validation passed. */
export function extractFhirBundle(bundle: any): ExtractedBundle {
  const resources: any[] = bundle.entry.map((e: any) => e.resource);
  const patientRes = resources.find((r) => r.resourceType === 'Patient');
  const mrn = patientRes.identifier.find((x: any) => x?.system === MRN_SYSTEM).value;

  const patient: ExtractedPatient = {
    mrn,
    sex: sexOf(patientRes.gender),
    birthDate: new Date(patientRes.birthDate),
    displayName:
      patientRes.name?.[0]?.text ??
      [patientRes.name?.[0]?.given?.[0], patientRes.name?.[0]?.family].filter(Boolean).join(' ') ??
      `Patient ${mrn}`,
  };

  const observations: ExtractedObservation[] = [];
  const clinicalEvents: ExtractedClinicalEvent[] = [];

  for (const r of resources) {
    if (r.resourceType === 'Observation') {
      const catCode = r.category?.[0]?.coding?.[0]?.code ?? 'laboratory';
      const c = firstCoding(r.code);
      observations.push({
        sourceId: r.id ?? c.code + '@' + r.effectiveDateTime,
        category: FHIR_CATEGORY[catCode] ?? ObservationCategory.LABORATORY,
        code: c.code,
        codeSystem: c.system || 'http://loinc.org',
        display: c.display,
        valueNumeric: typeof r.valueQuantity?.value === 'number' ? r.valueQuantity.value : null,
        valueString: typeof r.valueString === 'string' ? r.valueString : null,
        valueCode: r.valueCodeableConcept?.coding?.[0]?.code ?? null,
        valueUnit: r.valueQuantity?.unit ?? null,
        effectiveAt: new Date(r.effectiveDateTime),
        issuedAt: r.issued ? new Date(r.issued) : null,
        encounterId: r.encounter?.reference?.split('/')[1] ?? null,
        isLaboratory: (FHIR_CATEGORY[catCode] ?? ObservationCategory.LABORATORY) === ObservationCategory.LABORATORY,
      });
    } else if (r.resourceType === 'Condition') {
      const c = firstCoding(r.code);
      clinicalEvents.push({
        sourceId: r.id,
        type: ClinicalEventType.CONDITION,
        code: c.code,
        codeSystem: c.system,
        display: c.display,
        status: r.clinicalStatus?.coding?.[0]?.code ?? r.status ?? null,
        onsetAt: r.onsetDateTime ? new Date(r.onsetDateTime) : null,
        endedAt: r.abatementDateTime ? new Date(r.abatementDateTime) : null,
        recordedAt: r.recordedDate ? new Date(r.recordedDate) : new Date(),
        encounterId: r.encounter?.reference?.split('/')[1] ?? null,
      });
    } else if (r.resourceType === 'Encounter') {
      clinicalEvents.push({
        sourceId: r.id,
        type: ClinicalEventType.ENCOUNTER,
        code: r.class?.code ?? 'AMB',
        codeSystem: r.class?.system ?? '',
        display: 'ambulatory',
        status: r.status ?? null,
        onsetAt: r.period?.start ? new Date(r.period.start) : null,
        endedAt: r.period?.end ? new Date(r.period.end) : null,
        recordedAt: r.period?.start ? new Date(r.period.start) : new Date(),
        encounterId: null,
      });
    } else if (r.resourceType === 'Procedure') {
      const c = firstCoding(r.code);
      clinicalEvents.push({
        sourceId: r.id,
        type: ClinicalEventType.PROCEDURE,
        code: c.code,
        codeSystem: c.system,
        display: c.display,
        status: r.status ?? null,
        onsetAt: r.performedDateTime ? new Date(r.performedDateTime) : null,
        endedAt: null,
        recordedAt: r.performedDateTime ? new Date(r.performedDateTime) : new Date(),
        encounterId: r.encounter?.reference?.split('/')[1] ?? null,
      });
    } else if (r.resourceType === 'MedicationRequest') {
      const c = firstCoding(r.medicationCodeableConcept);
      clinicalEvents.push({
        sourceId: r.id,
        type: ClinicalEventType.MEDICATION_ORDER,
        code: c.code,
        codeSystem: c.system,
        display: c.display,
        status: r.status ?? null,
        onsetAt: r.authoredOn ? new Date(r.authoredOn) : null,
        endedAt: null,
        recordedAt: r.authoredOn ? new Date(r.authoredOn) : new Date(),
        encounterId: null,
      });
    }
  }

  return { patient, observations, clinicalEvents };
}
