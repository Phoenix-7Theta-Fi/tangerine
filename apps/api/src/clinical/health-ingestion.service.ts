import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Prisma, Sex } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { IdempotencyService } from '../idempotency/idempotency.service';
import { MetricsService } from '../metrics/metrics.service';
import { OutboxService, HEALTH_ADHERENCE_LOGGED, HEALTH_OBSERVATION_INGESTED } from '../outbox/outbox.service';
import { ReferenceRangeService } from './reference-range.service';
import { extractFhirBundle, validateFhirBundle } from './fhir';
import type { IngestAdherenceDto, IngestObservationDto } from './dto/clinical.dto';
import type { AuthUser } from '../common/decorators/current-user.decorator';

const DAY_MS = 86400000;

export interface IngestResult {
  accepted: number;
  observations: number;
  clinicalEvents: number;
  patientId: string;
  replayed?: boolean;
}

/**
 * Ingestion pipeline. Every endpoint is exactly-once via the shared
 * IdempotencyService (client-supplied key), writes its rows and an outbox event
 * in one transaction, and validates before writing — malformed input is
 * rejected with structured errors, never partially applied.
 */
@Injectable()
export class HealthIngestionService {
  private readonly logger = new Logger(HealthIngestionService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly idempotency: IdempotencyService,
    private readonly outbox: OutboxService,
    private readonly ranges: ReferenceRangeService,
    private readonly metrics: MetricsService,
  ) {}

  // ── FHIR bundle ────────────────────────────────────────────────────────────
  async ingestFhirBundle(caller: AuthUser, bundle: unknown, key: string): Promise<IngestResult> {
    const issues = validateFhirBundle(bundle);
    if (issues.length) {
      throw new BadRequestException({
        error: 'FHIR bundle validation failed',
        details: issues,
      });
    }
    const extracted = extractFhirBundle(bundle);

    return this.idempotency.execute<IngestResult>({
      userId: caller.id,
      key,
      request: bundle,
      action: 'clinical.fhir',
      successStatus: 202,
      execute: async () => {
        const patientId = await this.resolvePatient(
          extracted.patient.mrn,
          extracted.patient.sex,
          extracted.patient.birthDate,
          extracted.patient.displayName,
        );

        // Validation layer: every laboratory observation must resolve a range
        // for the patient's demographics at its effective time.
        await this.assertLabCoverage(
          patientId,
          extracted.patient.sex,
          extracted.patient.birthDate,
          extracted.observations.filter((o) => o.isLaboratory).map((o) => ({
            code: o.code,
            unit: o.valueUnit,
            effectiveAt: o.effectiveAt,
          })),
        );

        const result = await this.prisma.$transaction(async (tx) => {
          const obs = await tx.observation.createMany({
            data: extracted.observations.map((o) => ({
              patientId,
              category: o.category,
              code: o.code,
              codeSystem: o.codeSystem,
              display: o.display,
              valueNumeric: o.valueNumeric,
              valueString: o.valueString,
              valueCode: o.valueCode,
              valueUnit: o.valueUnit,
              effectiveAt: o.effectiveAt,
              issuedAt: o.issuedAt,
              dataSource: 'FHIR_IMPORT' as const,
              sourceId: o.sourceId,
              encounterId: o.encounterId,
            })),
            skipDuplicates: true,
          });
          const ev = extracted.clinicalEvents.length
            ? await tx.clinicalEvent.createMany({
                data: extracted.clinicalEvents.map((e) => ({
                  patientId,
                  type: e.type,
                  code: e.code,
                  codeSystem: e.codeSystem,
                  display: e.display,
                  status: e.status,
                  onsetAt: e.onsetAt,
                  endedAt: e.endedAt,
                  recordedAt: e.recordedAt,
                  dataSource: 'FHIR_IMPORT' as const,
                  sourceId: e.sourceId,
                  encounterId: e.encounterId,
                })),
                skipDuplicates: true,
              })
            : { count: 0 };

          for (const o of extracted.observations) {
            await this.outbox.emit(tx, HEALTH_OBSERVATION_INGESTED, {
              patientId,
              code: o.code,
              category: o.category,
              effectiveAt: o.effectiveAt.toISOString(),
            });
          }
          return { observations: obs.count, clinicalEvents: ev.count };
        });

        for (const o of extracted.observations) {
          this.metrics.healthObservationsIngested.inc({ category: o.category, source: 'fhir' });
        }
        return {
          accepted: result.observations + result.clinicalEvents,
          observations: result.observations,
          clinicalEvents: result.clinicalEvents,
          patientId,
        };
      },
    });
  }

  // ── single observation (manual entry or device data) ───────────────────────
  async ingestObservation(caller: AuthUser, dto: IngestObservationDto, key: string): Promise<IngestResult> {
    const profile = await this.prisma.patientProfile.findUnique({ where: { userId: caller.id } });
    if (!profile) throw new NotFoundException(`No patient profile for user ${caller.id}`);
    const effectiveAt = new Date(dto.effectiveAt);

    if (dto.category === 'LABORATORY') {
      await this.assertLabCoverage(caller.id, profile.sex as Sex, profile.birthDate, [
        { code: dto.code, unit: dto.valueUnit ?? null, effectiveAt },
      ]);
    }

    return this.idempotency.execute<IngestResult>({
      userId: caller.id,
      key,
      request: dto,
      action: 'clinical.observation',
      successStatus: 202,
      execute: async () => {
        const result = await this.prisma.$transaction(async (tx) => {
          const created = await tx.observation.create({
            data: {
              patientId: caller.id,
              category: dto.category,
              code: dto.code,
              codeSystem: dto.codeSystem ?? 'http://loinc.org',
              display: dto.display ?? dto.code,
              valueNumeric: dto.valueNumeric ?? null,
              valueString: dto.valueString ?? null,
              valueCode: dto.valueCode ?? null,
              valueUnit: dto.valueUnit ?? null,
              effectiveAt,
              issuedAt: dto.issuedAt ? new Date(dto.issuedAt) : new Date(),
              dataSource: (dto.deviceId ? 'DEVICE' : 'MANUAL') as 'DEVICE' | 'MANUAL',
              sourceId: dto.sourceId ?? `manual:${caller.id}:${key}`,
              deviceId: dto.deviceId ?? null,
              encounterId: dto.encounterId ?? null,
            },
          });
          await this.outbox.emit(tx, HEALTH_OBSERVATION_INGESTED, {
            patientId: caller.id,
            code: created.code,
            category: created.category,
            effectiveAt: created.effectiveAt.toISOString(),
          });
          return created;
        });
        this.logger.debug(`ingested observation ${result.id} (${result.code}) for ${caller.id}`);
        this.metrics.healthObservationsIngested.inc({
          category: result.category,
          source: result.deviceId ? 'device' : 'manual',
        });
        return { accepted: 1, observations: 1, clinicalEvents: 0, patientId: caller.id };
      },
    });
  }

  // ── adherence event ────────────────────────────────────────────────────────
  async ingestAdherence(caller: AuthUser, dto: IngestAdherenceDto, key: string): Promise<IngestResult> {
    const occurredAt = new Date(dto.occurredAt);
    return this.idempotency.execute<IngestResult>({
      userId: caller.id,
      key,
      request: dto,
      action: 'clinical.adherence',
      successStatus: 202,
      execute: async () => {
        const created = await this.prisma.$transaction(async (tx) => {
          const row = await tx.adherenceEvent.create({
            data: {
              patientId: caller.id,
              type: dto.type,
              protocolItemKey: dto.protocolItemKey,
              occurredAt,
              valueNumeric: dto.valueNumeric ?? null,
              note: dto.note ?? null,
              dataSource: 'MANUAL',
              sourceId: dto.sourceId ?? `adherence:${caller.id}:${key}`,
            },
          });
          await this.outbox.emit(tx, HEALTH_ADHERENCE_LOGGED, {
            patientId: caller.id,
            type: row.type,
            protocolItemKey: row.protocolItemKey,
            occurredAt: row.occurredAt.toISOString(),
          });
          return row;
        });
        this.metrics.healthAdherenceEvents.inc({ type: created.type });
        return { accepted: 1, observations: 0, clinicalEvents: 0, patientId: caller.id };
      },
    });
  }

  // ── helpers ────────────────────────────────────────────────────────────────
  private async resolvePatient(
    mrn: string,
    sex: Sex,
    birthDate: Date,
    displayName: string,
  ): Promise<string> {
    const existing = await this.prisma.patientProfile.findUnique({ where: { mrn } });
    if (existing) return existing.userId;
    try {
      const user = await this.prisma.user.create({
        data: {
          handle: mrn.toLowerCase(),
          displayName,
          role: 'MEMBER',
          bio: 'Patient provisioned by FHIR ingestion.',
        },
      });
      await this.prisma.patientProfile.create({
        data: { userId: user.id, mrn, sex, birthDate },
      });
      return user.id;
    } catch (err) {
      // Concurrent ingestion of the same patient: the loser re-reads.
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
        const raced = await this.prisma.patientProfile.findUnique({ where: { mrn } });
        if (raced) return raced.userId;
      }
      throw err;
    }
  }

  private async assertLabCoverage(
    patientId: string,
    sex: Sex,
    birthDate: Date,
    labs: { code: string; unit: string | null; effectiveAt: Date }[],
  ): Promise<void> {
    const issues: { code: string; unit: string | null; effectiveAt: string }[] = [];
    for (const lab of labs) {
      const ageDays = Math.floor((lab.effectiveAt.getTime() - birthDate.getTime()) / DAY_MS);
      const range = await this.ranges.resolve({ code: lab.code, unit: lab.unit, sex, ageDays, at: lab.effectiveAt });
      if (!range) {
        issues.push({ code: lab.code, unit: lab.unit, effectiveAt: lab.effectiveAt.toISOString() });
      }
    }
    if (issues.length) {
      throw new UnprocessableEntityException({
        error: 'Laboratory observations without a matching reference range for the patient',
        patientId,
        details: issues,
      });
    }
  }
}
