import { Module } from '@nestjs/common';
import { AuthGuard } from '../common/guards/auth.guard';
import { IdempotencyModule } from '../idempotency/idempotency.module';
import { OutboxModule } from '../outbox/outbox.module';
import { ClinicalController } from './clinical.controller';
import { AdherenceService } from './adherence.service';
import { ProtocolService } from './protocol.service';
import { ReferenceRangeService } from './reference-range.service';
import { TrendService } from './trend.service';
import { HealthIngestionService } from './health-ingestion.service';
import { HealthProcessor } from './health.processor';

/**
 * Health monitoring.
 *
 * Reads: derivation layer over the append-only clinical event, observation and
 * adherence stores — everything returned (trends, adherence rates, protocol
 * progress, range status) is computed on read; nothing derived is stored.
 *
 * Writes: the ingestion pipeline. Endpoints are exactly-once (shared
 * IdempotencyService), validate before writing, and commit their rows together
 * with an outbox event in one transaction. The HealthProcessor drains those
 * events off the health queue to derive trends and emit range alerts.
 */
@Module({
  imports: [IdempotencyModule, OutboxModule],
  controllers: [ClinicalController],
  providers: [
    TrendService,
    AdherenceService,
    ProtocolService,
    ReferenceRangeService,
    HealthIngestionService,
    HealthProcessor,
    AuthGuard,
  ],
  exports: [TrendService, AdherenceService, ProtocolService, ReferenceRangeService],
})
export class ClinicalModule {}
