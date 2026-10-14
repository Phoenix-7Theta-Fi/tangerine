/* eslint-disable no-console */
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { BookingStatus, PrismaClient, Role } from '@prisma/client';

// ts-node does not load .env the way the Nest app does; load it here so the
// script works both via `pnpm perf:seed-bookings` and standalone.
const envFile = resolve(__dirname, '../.env');
if (existsSync(envFile)) {
  for (const line of readFileSync(envFile, 'utf8').split('\n')) {
    const match = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*"?([^"\n]*)"?\s*$/);
    if (match && !process.env[match[1]]) process.env[match[1]] = match[2];
  }
}


/**
 * Synthetic data for the `slot-lookup` benchmark.
 *
 * Creates an isolated practitioner and packs N non-overlapping CONFIRMED
 * bookings back-to-back from `START_DAYS` in the future. Slot lookup reads
 * every conflicting reservation in the queried window and scans them per
 * candidate slot, so this isolates the cost of "more existing bookings" from
 * everything else. It never touches the demo practitioners.
 *
 *   BOOKING_COUNT=2000 SLOT_MINUTES=30 pnpm perf:seed-bookings
 */
const prisma = new PrismaClient();

const HANDLE = process.env.PERF_PRACTITIONER_HANDLE ?? 'perf.practitioner';
const COUNT = Number(process.env.BOOKING_COUNT ?? 1000);
const SLOT_MINUTES = Number(process.env.SLOT_MINUTES ?? 30);
const START_DAYS = Number(process.env.START_DAYS ?? 1);

async function main() {
  const practitioner = await prisma.user.upsert({
    where: { handle: HANDLE },
    update: { role: Role.PRACTITIONER },
    create: {
      handle: HANDLE,
      displayName: 'Perf Practitioner',
      role: Role.PRACTITIONER,
      headline: 'synthetic benchmark account',
      bio: 'Created by performance/seed-bookings.ts',
    },
  });

  const member = await prisma.user.findFirstOrThrow({
    where: { role: Role.MEMBER },
    orderBy: { createdAt: 'asc' },
  });

  let sessionType = await prisma.sessionType.findFirst({
    where: { practitionerId: practitioner.id, name: 'Perf slot' },
  });
  if (!sessionType) {
    sessionType = await prisma.sessionType.create({
      data: {
        practitionerId: practitioner.id,
        name: 'Perf slot',
        durationMinutes: SLOT_MINUTES,
        priceCents: 1000,
        currency: 'USD',
      },
    });
  }

  await prisma.practitionerAvailability.deleteMany({
    where: { practitionerId: practitioner.id },
  });
  await prisma.practitionerAvailability.createMany({
    data: Array.from({ length: 7 }, (_, weekday) => ({
      practitionerId: practitioner.id,
      weekday,
      startMinute: 0,
      endMinute: 1440,
      timezone: 'UTC',
    })),
  });

  await prisma.booking.deleteMany({ where: { practitionerId: practitioner.id } });

  const base = Date.now() + START_DAYS * 86_400_000;
  const step = SLOT_MINUTES * 60_000;
  const rows = Array.from({ length: COUNT }, (_, i) => {
    const start = new Date(base + i * step);
    const end = new Date(start.getTime() + step);
    return {
      practitionerId: practitioner.id,
      memberId: member.id,
      sessionTypeId: sessionType!.id,
      startTime: start,
      endTime: end,
      status: BookingStatus.CONFIRMED,
      priceCents: sessionType!.priceCents,
      currency: sessionType!.currency,
      confirmedAt: new Date(),
    };
  });

  // Chunked so the whole insert set never sits in one transaction.
  for (let i = 0; i < rows.length; i += 1000) {
    await prisma.booking.createMany({
      data: rows.slice(i, i + 1000),
      skipDuplicates: true,
    });
  }

  const spanDays = Math.ceil((COUNT * SLOT_MINUTES) / 1440);
  console.log(
    JSON.stringify(
      {
        practitionerId: practitioner.id,
        practitionerHandle: HANDLE,
        sessionTypeId: sessionType.id,
        sessionTypeName: 'Perf slot',
        bookingCount: COUNT,
        slotMinutes: SLOT_MINUTES,
        startDays: START_DAYS,
        spanDays,
        window: {
          fromDays: START_DAYS,
          toDays: START_DAYS + spanDays + 1,
        },
      },
      null,
      2,
    ),
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
