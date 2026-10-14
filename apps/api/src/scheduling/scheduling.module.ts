import { Module } from '@nestjs/common';
import { OutboxModule } from '../outbox/outbox.module';
import { SchedulingController } from './scheduling.controller';
import { SchedulingService } from './scheduling.service';
import { HoldSweeperService } from './hold-sweeper.service';

/**
 * Scheduling & booking.
 *
 * The interesting distributed-systems problems live here: a conflict-safe
 * booking under concurrency (Postgres exclusion constraint, not
 * check-then-insert), idempotent reschedule/cancel on a client op id, and an
 * expiring soft hold that must release a slot reliably despite scheduler jitter.
 */
@Module({
  imports: [OutboxModule],
  controllers: [SchedulingController],
  providers: [SchedulingService, HoldSweeperService],
  exports: [SchedulingService],
})
export class SchedulingModule {}
