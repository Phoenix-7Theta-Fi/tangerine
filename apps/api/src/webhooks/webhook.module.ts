import { Module } from '@nestjs/common';
import { IdempotencyModule } from '../idempotency/idempotency.module';
import { LedgerModule } from '../ledger/ledger.module';
import { PaymentService } from './payment.service';
import { WebhookController } from './webhook.controller';
import { WebhookService } from './webhook.service';

/**
 * Webhook ingestion: signature verification, transactional inbox, dispatch, and
 * the order-independent Payment state machine.
 */
@Module({
  imports: [LedgerModule, IdempotencyModule],
  controllers: [WebhookController],
  providers: [WebhookService, PaymentService],
  exports: [PaymentService, WebhookService],
})
export class WebhookModule {}
