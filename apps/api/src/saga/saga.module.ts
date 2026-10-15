import { Module } from '@nestjs/common';
import { LedgerModule } from '../ledger/ledger.module';
import { MarketplaceModule } from '../marketplace/marketplace.module';
import { OutboxModule } from '../outbox/outbox.module';
import { CheckoutSagaService } from './checkout-saga.service';
import { PaymentGateway } from './payment.gateway';
import { SagaController } from './saga.controller';
import { SagaOrchestrator } from './saga.service';

/**
 * Saga orchestration: a durable, compensating step runner plus the concrete
 * checkout saga that composes marketplace inventory/orders, the ledger, and the
 * payment gateway.
 */
@Module({
  imports: [MarketplaceModule, LedgerModule, OutboxModule],
  controllers: [SagaController],
  providers: [SagaOrchestrator, PaymentGateway, CheckoutSagaService],
  exports: [SagaOrchestrator],
})
export class SagaModule {}
