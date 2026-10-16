/* eslint-disable no-console */
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { AdherenceEventType, ProtocolFrequency, ProtocolStatus, PrismaClient } from '@prisma/client';

// ts-node does not load .env the way the Nest app does; load it here so the
// script works both via `pnpm perf:seed-health` and standalone.
const envFile = resolve(__dirname, '../.env');
if (existsSync(envFile)) {
  for (const line of readFileSync(envFile, 'utf8').split('\n')) {
    const match = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*"?([^"\n]*)"?\s*$/);
    if (match && !process.env[match[1]]) process.env[match[1]] = match[2];
  }
}

/**
 * Synthetic data for the health scaling benchmarks.
 *
 * Two isolated scenarios, each on a freshly-named perf patient so runs never
 * collide (health rows are append-only, so a scenario must not reuse a patient):
 *
 *  - `MODE=trend TREND_OBS=N` — one patient with N vital-sign observations,
 *    used to measure trend-query latency as the observation count grows.
 *  - `MODE=adherence ADH_ITEMS=K ADH_EVENTS=E` — one patient with a protocol of
 *    K items and E adherence events in the window, used to measure adherence
 *    computation under high event volume.
 *
 * Rows are inserted with `generate_series`, so seeding hundreds of thousands of
 * observations is one statement per batch, not one insert per row.
 *
 * Prints a single JSON line with the created ids so the runner can drive the
 * measurement step.
 */
const prisma = new PrismaClient();

const MODE = process.env.MODE ?? 'trend';
const SUFFIX = process.env.PERF_SUFFIX ?? String(Date.now());
const handle = `perf-health-${SUFFIX}`;
const mrn = `MRN-PERF-${SUFFIX}`;
const CODE = process.env.PERF_CODE ?? '8867-4';

async function ensurePatient(): Promise<string> {
  const user = await prisma.user.upsert({
    where: { handle },
    update: {},
    create: {
      handle,
      displayName: `Perf Health ${SUFFIX}`,
      role: 'MEMBER',
      bio: 'Created by performance/seed-health-perf.ts',
    },
  });
  await prisma.patientProfile.upsert({
    where: { userId: user.id },
    update: {},
    create: { userId: user.id, mrn, sex: 'FEMALE', birthDate: new Date('1985-01-01') },
  });
  return user.id;
}

async function seedTrend(patientId: string): Promise<number> {
  const n = Number(process.env.TREND_OBS ?? 1000);
  const started = Date.now();
  // One row per second, most recent last; unique sourceId per row.
  await prisma.$executeRawUnsafe(
    `INSERT INTO "Observation"
       (id, "patientId", category, code, "codeSystem", display, "valueNumeric",
        "valueUnit", "effectiveAt", "dataSource", "sourceId", "createdAt")
     SELECT 'perf-obs-${SUFFIX}-' || g, $1, 'VITAL_SIGNS', $2, 'http://loinc.org',
            'Heart rate', 60 + (g % 40), 'beats/min',
            now() - (g || ' seconds')::interval, 'SEED', 'perf-src-${SUFFIX}-' || g, now()
       FROM generate_series(1, ${n}) g`,
    patientId,
    CODE,
  );
  console.log(JSON.stringify({ mode: 'trend', handle, mrn, patientId, count: n, seedMs: Date.now() - started }));
  return n;
}

async function seedAdherence(patientId: string): Promise<number> {
  const items = Number(process.env.ADH_ITEMS ?? 20);
  const events = Number(process.env.ADH_EVENTS ?? 10000);
  const windowDays = Number(process.env.ADH_DAYS ?? 30);
  const started = Date.now();

  const protocol = await prisma.protocol.create({
    data: {
      patientId,
      name: `Perf protocol ${SUFFIX}`,
      status: ProtocolStatus.ACTIVE,
      startAt: new Date(Date.now() - windowDays * 86_400_000),
    },
  });
  await prisma.protocolItem.createMany({
    data: Array.from({ length: items }, (_, i) => ({
      protocolId: protocol.id,
      key: `perf-item-${SUFFIX}-${i}`,
      name: `Perf item ${i}`,
      adherenceType: AdherenceEventType.MEDICATION_TAKEN,
      frequency: ProtocolFrequency.DAILY,
      expectedPerDay: 1,
      phase: 'maintenance',
    })),
  });
  // Spread E events across the K items and the window; unique sourceId per row.
  await prisma.$executeRawUnsafe(
    `INSERT INTO "AdherenceEvent"
       (id, "patientId", type, "protocolItemKey", "occurredAt", "dataSource", "sourceId", "createdAt")
     SELECT 'perf-adh-${SUFFIX}-' || g, $1, 'MEDICATION_TAKEN',
            'perf-item-${SUFFIX}-' || (g % ${items}),
            now() - ((g % ${windowDays}) || ' days')::interval - ((g % 86400) || ' seconds')::interval,
            'SEED', 'perf-adh-src-${SUFFIX}-' || g, now()
       FROM generate_series(1, ${events}) g`,
    patientId,
  );
  console.log(
    JSON.stringify({
      mode: 'adherence',
      handle,
      mrn,
      patientId,
      protocolId: protocol.id,
      items,
      events,
      windowDays,
      seedMs: Date.now() - started,
    }),
  );
  return events;
}

async function main() {
  const patientId = await ensurePatient();
  if (MODE === 'trend') await seedTrend(patientId);
  else if (MODE === 'adherence') await seedAdherence(patientId);
  else throw new Error(`unknown MODE=${MODE} (expected trend|adherence)`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
