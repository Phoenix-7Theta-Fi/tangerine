import { Module } from '@nestjs/common';
import { LedgerController } from './ledger.controller';
import { LedgerService } from './ledger.service';

/**
 * Double-entry ledger. Append-only at the database level; balances derived;
 * every mutation idempotent on its source and chained by SHA-256 hash.
 */
@Module({
  controllers: [LedgerController],
  providers: [LedgerService],
  exports: [LedgerService],
})
export class LedgerModule {}
