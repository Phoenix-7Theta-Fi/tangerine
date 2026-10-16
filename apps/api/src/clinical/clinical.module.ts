import { Module } from '@nestjs/common';
import { AuthGuard } from '../common/guards/auth.guard';
import { ClinicalController } from './clinical.controller';
import { AdherenceService } from './adherence.service';
import { ProtocolService } from './protocol.service';
import { ReferenceRangeService } from './reference-range.service';
import { TrendService } from './trend.service';

/**
 * Health monitoring — derivation layer. Read-only endpoints over the
 * append-only clinical event, observation and adherence stores. Everything
 * returned (trends, adherence rates, protocol progress, range status) is
 * derived on read; nothing derived is stored.
 */
@Module({
  controllers: [ClinicalController],
  providers: [TrendService, AdherenceService, ProtocolService, ReferenceRangeService, AuthGuard],
  exports: [TrendService, AdherenceService, ProtocolService, ReferenceRangeService],
})
export class ClinicalModule {}
