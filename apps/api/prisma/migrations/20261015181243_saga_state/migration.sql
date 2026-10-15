-- CreateEnum
CREATE TYPE "SagaStatus" AS ENUM ('RUNNING', 'COMPLETED', 'COMPENSATING', 'FAILED');

-- CreateTable
CREATE TABLE "SagaState" (
    "id" TEXT NOT NULL,
    "sagaType" TEXT NOT NULL,
    "status" "SagaStatus" NOT NULL DEFAULT 'RUNNING',
    "currentStep" TEXT,
    "completedSteps" JSONB NOT NULL DEFAULT '[]',
    "compensationsRun" JSONB NOT NULL DEFAULT '[]',
    "context" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SagaState_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SagaState_sagaType_status_idx" ON "SagaState"("sagaType", "status");

-- CreateIndex
CREATE INDEX "SagaState_status_updatedAt_idx" ON "SagaState"("status", "updatedAt");
