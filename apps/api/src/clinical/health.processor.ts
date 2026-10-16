import { Logger } from '@nestjs/common';
import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import type { Job } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';
import { MetricsService } from '../metrics/metrics.service';
import { TrendService } from './trend.service';
import { OutboxService, HEALTH_ADHERENCE_LOGGED, HEALTH_OBSERVATION_INGESTED, HEALTH_RANGE_ALERT } from '../outbox/outbox.service';
import { HEALTH_QUEUE } from '../queue/queue.module';

interface HealthJobData {
  eventId: string;
  payload: {
    patientId: string;
    code?: string;
    category?: string;
    effectiveAt?: string;
    type?: string;
    protocolItemKey?: string;
    [k: string]: unknown;
  };
}

/**
 * Consumes health ingestion work off the queue, decoupled from the API request.
 *
 * On a new observation it derives the patient's trend for the observation's
 * code and checks the latest value's reference-range status. When a value falls
 * outside range it emits a notification event (durably, through the same
 * outbox), which this worker then drains as the delivery sink. Derivation is a
 * pure read against the append-only store, so at-least-once delivery is safe.
 */
@Processor(HEALTH_QUEUE)
export class HealthProcessor extends WorkerHost {
  private readonly logger = new Logger(HealthProcessor.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly trends: TrendService,
    private readonly outbox: OutboxService,
    private readonly metrics: MetricsService,
  ) {
    super();
  }

  async process(job: Job<HealthJobData>): Promise<void> {
    if (job.name === HEALTH_OBSERVATION_INGESTED) {
      await this.onObservation(job.data.payload);
    } else if (job.name === HEALTH_ADHERENCE_LOGGED) {
      // Adherence writes are already the record; the worker only acknowledges
      // them so downstream consumers can be added without touching ingestion.
      this.logger.debug(
        `adherence ${job.data.payload.type} (${job.data.payload.protocolItemKey}) for ${job.data.payload.patientId}`,
      );
    } else if (job.name === HEALTH_RANGE_ALERT) {
      // The notification sink: a real deployment pushes to the patient here.
      this.logger.warn(
        `range alert for ${job.data.payload.patientId}: ${JSON.stringify(job.data.payload)}`,
      );
    }
    await this.mark(job.data.eventId, 'PROCESSED');
  }

  private async onObservation(payload: HealthJobData['payload']): Promise<void> {
    const { patientId, code } = payload;
    if (!code) return;
    const { trends } = await this.trends.trends(patientId, { codes: code });
    const trend = trends.find((t) => t.code === code);
    if (!trend) return;
    this.logger.debug(
      `derived ${code} for ${patientId}: latest=${trend.latestValue} status=${trend.rangeStatus} dir=${trend.direction}`,
    );
    if (trend.rangeStatus === 'low' || trend.rangeStatus === 'high') {
      await this.prisma.$transaction((tx) =>
        this.outbox.emit(tx, HEALTH_RANGE_ALERT, {
          patientId,
          code,
          display: trend.display,
          value: trend.latestValue,
          unit: trend.unit,
          status: trend.rangeStatus,
          range: trend.range,
          effectiveAt: trend.latestAt.toISOString(),
        }),
      );
      this.metrics.healthRangeAlerts.inc({ code, status: trend.rangeStatus });
    }
  }

  @OnWorkerEvent('failed')
  async onFailed(job: Job<HealthJobData>, err: Error): Promise<void> {
    const maxAttempts = job.opts.attempts ?? 1;
    if (job.attemptsMade >= maxAttempts) {
      this.logger.error(`health job ${job.name} permanently failed: ${err.message}`);
      await this.mark(job.data.eventId, 'FAILED', err.message);
    }
  }

  private async mark(eventId: string, status: 'PROCESSED' | 'FAILED', lastError?: string): Promise<void> {
    await this.prisma.outboxEvent
      .update({
        where: { id: eventId },
        data: { status, processedAt: new Date(), ...(lastError ? { lastError } : {}) },
      })
      .catch(() => undefined);
  }
}
