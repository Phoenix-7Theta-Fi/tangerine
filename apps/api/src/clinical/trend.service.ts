import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, Sex } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ReferenceRangeService, RangeStatus } from './reference-range.service';

const DAY_MS = 86400000;

export interface BiomarkerTrend {
  code: string;
  display: string;
  unit: string | null;
  latestValue: number | null;
  latestAt: Date;
  lookbackValue: number | null;
  lookbackAt: Date | null;
  delta: number | null;
  direction: 'rising' | 'falling' | 'stable' | 'unknown';
  rangeStatus: RangeStatus;
  range: { low: number | null; high: number | null } | null;
}

interface TrendRow {
  code: string;
  display: string;
  value: number | null;
  unit: string | null;
  at: Date;
  id: string;
  lookback_value: number | null;
  lookback_at: Date | null;
  lookback_id: string | null;
}

/**
 * Biomarker trends for a patient: the latest value per code, the value at a
 * configurable lookback interval, the delta and direction of change, and the
 * value's status against the patient's applicable reference range.
 *
 * The latest and lookback rows are selected in one SQL statement with
 * `DISTINCT ON` (a Postgres window-style pick), so "latest per code" is the
 * database's answer rather than an application-side sort.
 */
@Injectable()
export class TrendService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly ranges: ReferenceRangeService,
  ) {}

  private async profile(patientId: string) {
    const profile = await this.prisma.patientProfile.findUnique({
      where: { userId: patientId },
    });
    if (!profile) {
      throw new NotFoundException(
        `No patient profile for user ${patientId} (seed the health data first)`,
      );
    }
    return profile;
  }

  async trends(
    patientId: string,
    opts: { codes?: string; lookbackDays?: number; asOf?: string },
  ): Promise<{ asOf: Date; lookbackDays: number; trends: BiomarkerTrend[] }> {
    const at = opts.asOf ? new Date(opts.asOf) : new Date();
    const lookbackDays = opts.lookbackDays ?? 90;
    const profile = await this.profile(patientId);

    const codeList = (opts.codes ?? '')
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean);
    const codeFilter = codeList.length
      ? Prisma.sql`AND code IN (${Prisma.join(codeList)})`
      : Prisma.empty;

    const rows = await this.prisma.$queryRaw<TrendRow[]>(Prisma.sql`
      WITH latest AS (
        SELECT DISTINCT ON (code)
               code, display, "valueNumeric" AS value, "valueUnit" AS unit,
               "effectiveAt" AS at, id
          FROM "Observation"
         WHERE "patientId" = ${patientId}
           AND "effectiveAt" <= ${at}
           ${codeFilter}
         ORDER BY code, "effectiveAt" DESC, "issuedAt" DESC NULLS LAST
      ),
      lookback AS (
        SELECT DISTINCT ON (code)
               code, "valueNumeric" AS value, "effectiveAt" AS at, id
          FROM "Observation"
         WHERE "patientId" = ${patientId}
           AND "effectiveAt" <= ${at} - (${lookbackDays}::int * interval '1 day')
           ${codeFilter}
         ORDER BY code, "effectiveAt" DESC
      )
      SELECT l.code, l.display, l.value, l.unit, l.at, l.id,
             lb.value AS lookback_value, lb.at AS lookback_at, lb.id AS lookback_id
        FROM latest l
        LEFT JOIN lookback lb USING (code)
       ORDER BY l.code
    `);

    const trends: BiomarkerTrend[] = [];
    for (const r of rows) {
      const ageDays = Math.floor((r.at.getTime() - profile.birthDate.getTime()) / DAY_MS);
      const range = await this.ranges.resolve({
        code: r.code,
        unit: r.unit,
        sex: (profile.sex as Sex) ?? Sex.UNKNOWN,
        ageDays,
        at: r.at,
      });
      const delta =
        r.value !== null && r.lookback_value !== null ? r.value - r.lookback_value : null;
      const direction =
        delta === null ? 'unknown' : delta > 0 ? 'rising' : delta < 0 ? 'falling' : 'stable';
      trends.push({
        code: r.code,
        display: r.display,
        unit: r.unit,
        latestValue: r.value,
        latestAt: r.at,
        lookbackValue: r.lookback_value,
        lookbackAt: r.lookback_at,
        delta,
        direction,
        rangeStatus: this.ranges.classify(r.value, range),
        range: range ? { low: range.lowValue, high: range.highValue } : null,
      });
    }
    return { asOf: at, lookbackDays, trends };
  }
}
