-- CreateEnum
CREATE TYPE "AdherenceEventType" AS ENUM ('MEDICATION_TAKEN', 'MEDICATION_SKIPPED', 'EXERCISE_LOGGED', 'MEAL_LOGGED', 'SLEEP_LOGGED');

-- CreateEnum
CREATE TYPE "ProtocolStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'PAUSED');

-- CreateEnum
CREATE TYPE "ProtocolFrequency" AS ENUM ('DAILY', 'TWICE_DAILY', 'WEEKLY', 'AS_NEEDED');

-- CreateTable
CREATE TABLE "Protocol" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "conditionCode" TEXT,
    "status" "ProtocolStatus" NOT NULL DEFAULT 'ACTIVE',
    "startAt" TIMESTAMP(3) NOT NULL,
    "endAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Protocol_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProtocolItem" (
    "id" TEXT NOT NULL,
    "protocolId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "adherenceType" "AdherenceEventType" NOT NULL,
    "frequency" "ProtocolFrequency" NOT NULL,
    "expectedPerDay" DOUBLE PRECISION NOT NULL,
    "phase" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProtocolItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProtocolMilestone" (
    "id" TEXT NOT NULL,
    "protocolId" TEXT NOT NULL,
    "orderIndex" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "phase" TEXT NOT NULL,
    "dueAt" TIMESTAMP(3) NOT NULL,
    "requiredCumulativeTaken" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProtocolMilestone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdherenceEvent" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "type" "AdherenceEventType" NOT NULL,
    "protocolItemKey" TEXT NOT NULL,
    "occurredAt" TIMESTAMP(3) NOT NULL,
    "valueNumeric" DOUBLE PRECISION,
    "note" TEXT,
    "dataSource" "DataSource" NOT NULL DEFAULT 'MANUAL',
    "sourceId" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdherenceEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Protocol_patientId_status_idx" ON "Protocol"("patientId", "status");

-- CreateIndex
CREATE INDEX "ProtocolItem_protocolId_idx" ON "ProtocolItem"("protocolId");

-- CreateIndex
CREATE UNIQUE INDEX "ProtocolItem_protocolId_key_key" ON "ProtocolItem"("protocolId", "key");

-- CreateIndex
CREATE INDEX "ProtocolMilestone_protocolId_dueAt_idx" ON "ProtocolMilestone"("protocolId", "dueAt");

-- CreateIndex
CREATE UNIQUE INDEX "ProtocolMilestone_protocolId_orderIndex_key" ON "ProtocolMilestone"("protocolId", "orderIndex");

-- CreateIndex
CREATE INDEX "AdherenceEvent_patientId_protocolItemKey_occurredAt_idx" ON "AdherenceEvent"("patientId", "protocolItemKey", "occurredAt");

-- CreateIndex
CREATE INDEX "AdherenceEvent_patientId_type_occurredAt_idx" ON "AdherenceEvent"("patientId", "type", "occurredAt");

-- CreateIndex
CREATE UNIQUE INDEX "AdherenceEvent_patientId_sourceId_key" ON "AdherenceEvent"("patientId", "sourceId");

-- AddForeignKey
ALTER TABLE "Protocol" ADD CONSTRAINT "Protocol_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProtocolItem" ADD CONSTRAINT "ProtocolItem_protocolId_fkey" FOREIGN KEY ("protocolId") REFERENCES "Protocol"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProtocolMilestone" ADD CONSTRAINT "ProtocolMilestone_protocolId_fkey" FOREIGN KEY ("protocolId") REFERENCES "Protocol"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdherenceEvent" ADD CONSTRAINT "AdherenceEvent_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ───────────────────────────────────────────────────────────────────────────
-- Append-only enforcement for adherence events. Same guarantee as the clinical
-- history: a logged action is a fact; corrections are new rows.
-- ───────────────────────────────────────────────────────────────────────────
CREATE TRIGGER "AdherenceEvent_append_only"
  BEFORE UPDATE OR DELETE ON "AdherenceEvent"
  FOR EACH ROW EXECUTE FUNCTION clinical_reject_mutation();

REVOKE UPDATE, DELETE ON "AdherenceEvent" FROM PUBLIC;
