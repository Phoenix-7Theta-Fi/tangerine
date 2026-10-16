import { Injectable } from '@nestjs/common';
import { Sex } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

export interface ResolvedReferenceRange {
  id: string;
  code: string;
  display: string;
  valueUnit: string;
  sex: Sex | null;
  ageMinDays: number | null;
  ageMaxDays: number | null;
  lowValue: number | null;
  highValue: number | null;
  lowCritical: number | null;
  highCritical: number | null;
}

export type RangeStatus = 'low' | 'normal' | 'high' | 'unknown';

/**
 * Resolves the applicable reference range for an observation from the
 * demographics (sex, age) of the patient *at the time of the observation*.
 *
 * The database is the arbiter of which row wins: it orders candidate rows by
 * specificity (sex-specific beats wildcard, then the narrowest age band) so the
 * choice is a single SQL statement, not application branching that could drift
 * from the catalog.
 */
@Injectable()
export class ReferenceRangeService {
  constructor(private readonly prisma: PrismaService) {}

  async resolve(params: {
    code: string;
    unit: string | null;
    sex: Sex;
    ageDays: number;
    at: Date;
  }): Promise<ResolvedReferenceRange | null> {
    const { code, unit, sex, ageDays, at } = params;
    if (!unit) return null;
    const rows = await this.prisma.$queryRaw<ResolvedReferenceRange[]>`
      SELECT id, code, display, "valueUnit", sex, "ageMinDays", "ageMaxDays",
             "lowValue", "highValue", "lowCritical", "highCritical"
        FROM "ReferenceRange"
       WHERE code = ${code}
         AND "valueUnit" = ${unit}
         AND "effectiveFrom" <= ${at}
         AND ("effectiveTo" IS NULL OR "effectiveTo" >= ${at})
         AND (sex IS NULL OR sex::text = ${sex})
         AND ("ageMinDays" IS NULL OR ${ageDays} >= "ageMinDays")
         AND ("ageMaxDays" IS NULL OR ${ageDays} <= "ageMaxDays")
       ORDER BY (sex IS NOT NULL) DESC,
                ("ageMinDays" IS NOT NULL AND "ageMaxDays" IS NOT NULL) DESC,
                (coalesce("ageMaxDays", 999999) - coalesce("ageMinDays", 0)) ASC
       LIMIT 1
    `;
    return rows[0] ?? null;
  }

  /** Classify a numeric value against a resolved range. */
  classify(value: number | null, range: ResolvedReferenceRange | null): RangeStatus {
    if (range === null || value === null) return 'unknown';
    if (range.lowCritical !== null && value < range.lowCritical) return 'low';
    if (range.highCritical !== null && value > range.highCritical) return 'high';
    if (range.lowValue !== null && value < range.lowValue) return 'low';
    if (range.highValue !== null && value > range.highValue) return 'high';
    return 'normal';
  }
}
