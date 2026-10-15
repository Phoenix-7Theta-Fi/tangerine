import { Module } from '@nestjs/common';
import { IdempotencyService } from './idempotency.service';

/**
 * Generic idempotency with recovery points. Exported so any feature that
 * performs an externally-triggered side effect can wrap it in exactly-once
 * semantics (`execute`) with resumable checkpoints.
 */
@Module({
  providers: [IdempotencyService],
  exports: [IdempotencyService],
})
export class IdempotencyModule {}
