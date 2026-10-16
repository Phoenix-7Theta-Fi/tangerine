import { Injectable } from '@nestjs/common';
import { AdherenceEventType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

const DAY_MS = 86400000;
const EPS = 1e-9;
const startOfDayUtc = (ms: number) => Math.floor(ms / DAY_MS) * DAY_MS;

export interface ItemAdherence {
  key: string;
  name: string;
  adherenceType: AdherenceEventType;
  expectedPerDay: number;
  expected: number;
  taken: number;
  skipped: number;
  /** Expected slots with no row at all — distinct from `skipped`. */
  notLogged: number;
  adherenceRate: number;
  currentStreak: number;
  longestStreak: number;
}

export interface ProtocolAdherence {
  protocolId: string;
  name: string;
  items: ItemAdherence[];
  overall: { expected: number; taken: number; skipped: number; notLogged: number; adherenceRate: number };
}

/**
 * Adherence rates over a rolling window, per protocol item.
 *
 * The clinical distinction the product depends on: a day with no row is
 * **not logged** (the patient may simply not have recorded it), while an
 * explicit MEDICATION_SKIPPED row is **missed**. Both reduce the rate, but only
 * `skipped` is a positive assertion that the action did not happen, so they are
 * reported separately and never conflated.
 */
@Injectable()
export class AdherenceService {
  constructor(private readonly prisma: PrismaService) {}

  async adherence(
    patientId: string,
    opts: { protocolId?: string; windowDays?: number; asOf?: string },
  ): Promise<{ asOf: Date; windowDays: number; protocols: ProtocolAdherence[] }> {
    const at = opts.asOf ? new Date(opts.asOf) : new Date();
    const windowDays = opts.windowDays ?? 30;
    // The window is the `windowDays` calendar days ending on the day of `at`
    // (inclusive), so the streak scan and the expected count share a denominator.
    const asOfDayMs = startOfDayUtc(at.getTime());
    const from = new Date(asOfDayMs - (windowDays - 1) * DAY_MS);

    const protocols = await this.prisma.protocol.findMany({
      where: { patientId, ...(opts.protocolId ? { id: opts.protocolId } : {}) },
      include: { items: true },
      orderBy: { createdAt: 'asc' },
    });

    const keys = protocols.flatMap((p) => p.items.map((i) => i.key));
    const events = keys.length
      ? await this.prisma.adherenceEvent.findMany({
          where: { patientId, protocolItemKey: { in: keys }, occurredAt: { gte: from, lte: at } },
          select: { protocolItemKey: true, type: true, occurredAt: true },
        })
      : [];

    const out: ProtocolAdherence[] = [];
    for (const p of protocols) {
      const items: ItemAdherence[] = p.items
        .filter((i) => i.active)
        .map((item) => {
          const mine = events.filter((e) => e.protocolItemKey === item.key);
          const takenList = mine.filter((e) => e.type === item.adherenceType);
          const skipped = mine.filter((e) => e.type === AdherenceEventType.MEDICATION_SKIPPED).length;
          const expected = item.expectedPerDay * windowDays;
          const taken = takenList.length;
          const notLogged = Math.max(0, Math.round((expected - taken - skipped) * 1000) / 1000);

          // Per-day completion for streaks.
          const perDay = new Map<number, number>();
          for (const e of takenList) {
            const day = startOfDayUtc(e.occurredAt.getTime());
            perDay.set(day, (perDay.get(day) ?? 0) + 1);
          }
          const asOfDay = startOfDayUtc(at.getTime());
          const fromDay = startOfDayUtc(from.getTime());
          let longest = 0;
          let run = 0;
          for (let day = fromDay; day <= asOfDay; day += DAY_MS) {
            const complete = (perDay.get(day) ?? 0) >= item.expectedPerDay - EPS;
            run = complete ? run + 1 : 0;
            if (run > longest) longest = run;
          }          let current = 0;
          for (let day = asOfDay; day >= fromDay; day -= DAY_MS) {
            if ((perDay.get(day) ?? 0) >= item.expectedPerDay - EPS) current += 1;
            else break;
          }

          return {
            key: item.key,
            name: item.name,
            adherenceType: item.adherenceType,
            expectedPerDay: item.expectedPerDay,
            expected: round3(expected),
            taken,
            skipped,
            notLogged,
            adherenceRate: expected > 0 ? round4(taken / expected) : 0,
            currentStreak: current,
            longestStreak: longest,
          };
        });

      const sum = items.reduce(
        (a, i) => ({
          expected: a.expected + i.expected,
          taken: a.taken + i.taken,
          skipped: a.skipped + i.skipped,
          notLogged: a.notLogged + i.notLogged,
        }),
        { expected: 0, taken: 0, skipped: 0, notLogged: 0 },
      );
      out.push({
        protocolId: p.id,
        name: p.name,
        items,
        overall: {
          expected: round3(sum.expected),
          taken: sum.taken,
          skipped: sum.skipped,
          notLogged: round3(sum.notLogged),
          adherenceRate: sum.expected > 0 ? round4(sum.taken / sum.expected) : 0,
        },
      });
    }

    return { asOf: at, windowDays, protocols: out };
  }
}

const round3 = (n: number) => Math.round(n * 1000) / 1000;
const round4 = (n: number) => Math.round(n * 10000) / 10000;
