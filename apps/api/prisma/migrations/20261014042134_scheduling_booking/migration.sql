-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('HELD', 'PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED', 'NO_SHOW');

-- CreateTable
CREATE TABLE "SessionType" (
    "id" TEXT NOT NULL,
    "practitionerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "durationMinutes" INTEGER NOT NULL,
    "priceCents" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SessionType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PractitionerAvailability" (
    "id" TEXT NOT NULL,
    "practitionerId" TEXT NOT NULL,
    "weekday" INTEGER NOT NULL,
    "startMinute" INTEGER NOT NULL,
    "endMinute" INTEGER NOT NULL,
    "timezone" TEXT NOT NULL DEFAULT 'UTC',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PractitionerAvailability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL,
    "practitionerId" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "sessionTypeId" TEXT NOT NULL,
    "startTime" TIMESTAMPTZ(3) NOT NULL,
    "endTime" TIMESTAMPTZ(3) NOT NULL,
    "status" "BookingStatus" NOT NULL DEFAULT 'PENDING',
    "priceCents" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "holdExpiresAt" TIMESTAMPTZ(3),
    "clientOpId" TEXT,
    "confirmedAt" TIMESTAMPTZ(3),
    "cancelledAt" TIMESTAMPTZ(3),
    "cancelReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookingOperation" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "opId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "bookingId" TEXT,
    "response" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BookingOperation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SessionType_practitionerId_active_idx" ON "SessionType"("practitionerId", "active");

-- CreateIndex
CREATE UNIQUE INDEX "SessionType_practitionerId_name_key" ON "SessionType"("practitionerId", "name");

-- CreateIndex
CREATE INDEX "PractitionerAvailability_practitionerId_weekday_idx" ON "PractitionerAvailability"("practitionerId", "weekday");

-- CreateIndex
CREATE INDEX "Booking_memberId_startTime_idx" ON "Booking"("memberId", "startTime" DESC);

-- CreateIndex
CREATE INDEX "Booking_practitionerId_startTime_idx" ON "Booking"("practitionerId", "startTime");

-- CreateIndex
CREATE INDEX "Booking_status_holdExpiresAt_idx" ON "Booking"("status", "holdExpiresAt");

-- CreateIndex
CREATE INDEX "Booking_status_startTime_idx" ON "Booking"("status", "startTime");

-- CreateIndex
CREATE UNIQUE INDEX "Booking_memberId_clientOpId_key" ON "Booking"("memberId", "clientOpId");

-- CreateIndex
CREATE INDEX "BookingOperation_createdAt_idx" ON "BookingOperation"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "BookingOperation_userId_opId_key" ON "BookingOperation"("userId", "opId");

-- AddForeignKey
ALTER TABLE "SessionType" ADD CONSTRAINT "SessionType_practitionerId_fkey" FOREIGN KEY ("practitionerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PractitionerAvailability" ADD CONSTRAINT "PractitionerAvailability_practitionerId_fkey" FOREIGN KEY ("practitionerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_practitionerId_fkey" FOREIGN KEY ("practitionerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_sessionTypeId_fkey" FOREIGN KEY ("sessionTypeId") REFERENCES "SessionType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingOperation" ADD CONSTRAINT "BookingOperation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Conflict-safety, enforced by the database rather than by application code.
--
-- A single exclusion constraint across holds AND firm bookings guarantees that
-- no two live reservations overlap on one practitioner. A race is therefore
-- impossible to lose silently: the loser's INSERT raises SQLSTATE 23P01 and the
-- API translates it to a clean 409. `btree_gist` is required to mix the
-- equality operator on "practitionerId" with the range overlap operator in one
-- GiST index.
CREATE EXTENSION IF NOT EXISTS btree_gist;

ALTER TABLE "Booking"
  ADD CONSTRAINT "Booking_no_overlap_per_practitioner"
  EXCLUDE USING gist (
    "practitionerId" WITH =,
    tstzrange("startTime", "endTime", '[)') WITH &&
  )
  WHERE (status IN ('HELD', 'PENDING', 'CONFIRMED'));

