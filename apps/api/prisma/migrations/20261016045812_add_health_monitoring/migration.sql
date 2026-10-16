-- CreateEnum
CREATE TYPE "Sex" AS ENUM ('MALE', 'FEMALE', 'OTHER', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "ObservationCategory" AS ENUM ('VITAL_SIGNS', 'LABORATORY', 'ACTIVITY', 'SLEEP', 'NUTRITION', 'SOCIAL_HISTORY', 'EXAM', 'DEVICE');

-- CreateEnum
CREATE TYPE "ClinicalEventType" AS ENUM ('CONDITION', 'ENCOUNTER', 'PROCEDURE', 'MEDICATION_ORDER', 'IMMUNIZATION', 'ALLERGY');

-- CreateEnum
CREATE TYPE "DataSource" AS ENUM ('MANUAL', 'DEVICE', 'FHIR_IMPORT', 'LAB_FEED', 'SEED');

-- CreateTable
CREATE TABLE "PatientProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "mrn" TEXT NOT NULL,
    "sex" "Sex" NOT NULL DEFAULT 'UNKNOWN',
    "birthDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PatientProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClinicalEvent" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "type" "ClinicalEventType" NOT NULL,
    "code" TEXT NOT NULL,
    "codeSystem" TEXT NOT NULL,
    "display" TEXT NOT NULL,
    "status" TEXT,
    "onsetAt" TIMESTAMP(3),
    "endedAt" TIMESTAMP(3),
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataSource" "DataSource" NOT NULL DEFAULT 'SEED',
    "sourceId" TEXT NOT NULL,
    "encounterId" TEXT,
    "payload" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClinicalEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Observation" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "category" "ObservationCategory" NOT NULL,
    "code" TEXT NOT NULL,
    "codeSystem" TEXT NOT NULL DEFAULT 'http://loinc.org',
    "display" TEXT NOT NULL,
    "valueNumeric" DOUBLE PRECISION,
    "valueString" TEXT,
    "valueCode" TEXT,
    "valueUnit" TEXT,
    "effectiveAt" TIMESTAMP(3) NOT NULL,
    "issuedAt" TIMESTAMP(3),
    "dataSource" "DataSource" NOT NULL DEFAULT 'SEED',
    "sourceId" TEXT NOT NULL,
    "deviceId" TEXT,
    "encounterId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Observation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReferenceRange" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "codeSystem" TEXT NOT NULL DEFAULT 'http://loinc.org',
    "display" TEXT NOT NULL,
    "valueUnit" TEXT NOT NULL,
    "sex" "Sex",
    "ageMinDays" INTEGER,
    "ageMaxDays" INTEGER,
    "lowValue" DOUBLE PRECISION,
    "highValue" DOUBLE PRECISION,
    "lowCritical" DOUBLE PRECISION,
    "highCritical" DOUBLE PRECISION,
    "effectiveFrom" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "effectiveTo" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReferenceRange_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PatientProfile_userId_key" ON "PatientProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "PatientProfile_mrn_key" ON "PatientProfile"("mrn");

-- CreateIndex
CREATE INDEX "PatientProfile_birthDate_idx" ON "PatientProfile"("birthDate");

-- CreateIndex
CREATE INDEX "ClinicalEvent_patientId_type_onsetAt_idx" ON "ClinicalEvent"("patientId", "type", "onsetAt");

-- CreateIndex
CREATE INDEX "ClinicalEvent_patientId_code_onsetAt_idx" ON "ClinicalEvent"("patientId", "code", "onsetAt");

-- CreateIndex
CREATE INDEX "ClinicalEvent_code_onsetAt_idx" ON "ClinicalEvent"("code", "onsetAt");

-- CreateIndex
CREATE UNIQUE INDEX "ClinicalEvent_patientId_sourceId_key" ON "ClinicalEvent"("patientId", "sourceId");

-- CreateIndex
CREATE INDEX "Observation_patientId_code_effectiveAt_idx" ON "Observation"("patientId", "code", "effectiveAt");

-- CreateIndex
CREATE INDEX "Observation_patientId_category_effectiveAt_idx" ON "Observation"("patientId", "category", "effectiveAt");

-- CreateIndex
CREATE INDEX "Observation_code_effectiveAt_idx" ON "Observation"("code", "effectiveAt");

-- CreateIndex
CREATE INDEX "Observation_effectiveAt_idx" ON "Observation" USING BRIN ("effectiveAt");

-- CreateIndex
CREATE UNIQUE INDEX "Observation_patientId_sourceId_key" ON "Observation"("patientId", "sourceId");

-- CreateIndex
CREATE INDEX "ReferenceRange_code_effectiveFrom_idx" ON "ReferenceRange"("code", "effectiveFrom");

-- CreateIndex
CREATE INDEX "ReferenceRange_code_sex_ageMinDays_ageMaxDays_idx" ON "ReferenceRange"("code", "sex", "ageMinDays", "ageMaxDays");

-- AddForeignKey
ALTER TABLE "PatientProfile" ADD CONSTRAINT "PatientProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClinicalEvent" ADD CONSTRAINT "ClinicalEvent_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Observation" ADD CONSTRAINT "Observation_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ───────────────────────────────────────────────────────────────────────────
-- Append-only enforcement for the clinical history.
--
-- Clinical events and observations are a medical record: the observed value of
-- the past never changes, corrections are new rows. A BEFORE UPDATE OR DELETE
-- trigger raises for every row regardless of the role issuing the statement.
-- This is the real guarantee — REVOKE (below) does not stop the table owner or
-- a superuser, but a row trigger does. Mirrors the double-entry ledger.
-- ───────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION clinical_reject_mutation() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION 'clinical history is append-only: % on % is not permitted',
    TG_OP, TG_TABLE_NAME
    USING ERRCODE = 'restrict_violation';
END;
$$;

CREATE TRIGGER "ClinicalEvent_append_only"
  BEFORE UPDATE OR DELETE ON "ClinicalEvent"
  FOR EACH ROW EXECUTE FUNCTION clinical_reject_mutation();

CREATE TRIGGER "Observation_append_only"
  BEFORE UPDATE OR DELETE ON "Observation"
  FOR EACH ROW EXECUTE FUNCTION clinical_reject_mutation();

-- Defense in depth: strip UPDATE/DELETE from PUBLIC. The triggers above remain
-- the authoritative guard (owners and superusers bypass grants).
REVOKE UPDATE, DELETE ON "ClinicalEvent" FROM PUBLIC;
REVOKE UPDATE, DELETE ON "Observation" FROM PUBLIC;
