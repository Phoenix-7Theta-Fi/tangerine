import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { OrderStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { InventoryService } from '../marketplace/inventory.service';
import { OrderService } from '../marketplace/order.service';
import { LedgerService } from '../ledger/ledger.service';
import { OutboxService } from '../outbox/outbox.service';
import { PaymentGateway } from './payment.gateway';
import {
  SagaDefinition,
  SagaOrchestrator,
  SagaRun,
} from './saga.service';

export const CHECKOUT_SAGA = 'checkout';

export interface CheckoutContext {
  orderId: string;
  memberId: string;
  items: { productId: string; quantity: number }[];
  amountCents: number;
  currency: string;
  /** Set by the charge step; needed by its compensation. */
  externalPaymentId?: string;
  /** Test-only: reject this step's forward action (see SagaOrchestrator). */
  forceFailStep?: string;
}

/**
 * The checkout saga.
 *
 * Forward: reserve → charge → ledger → confirm → notify.
 * Compensation (LIFO): release → refund → reversing ledger entry; the confirm
 * step compensates by refunding the order. If checkout fails before the order
 * is confirmed, `onFailure` cancels the still-PENDING order.
 */
@Injectable()
export class CheckoutSagaService implements OnModuleInit {
  constructor(
    private readonly prisma: PrismaService,
    private readonly orchestrator: SagaOrchestrator,
    private readonly inventory: InventoryService,
    private readonly orders: OrderService,
    private readonly ledger: LedgerService,
    private readonly gateway: PaymentGateway,
    private readonly outbox: OutboxService,
  ) {}

  onModuleInit(): void {
    this.orchestrator.register<CheckoutContext>(this.definition());
  }

  async checkout(
    memberId: string,
    orderId: string,
    forceFailStep?: string,
  ): Promise<SagaRun> {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });
    if (!order) throw new NotFoundException('Order not found');
    if (order.memberId !== memberId) {
      throw new ForbiddenException('Not your order');
    }

    const context: CheckoutContext = {
      orderId,
      memberId,
      items: order.items.map((i) => ({
        productId: i.productId,
        quantity: i.quantity,
      })),
      amountCents: order.totalCents,
      currency: order.currency,
      forceFailStep,
    };
    return this.orchestrator.start(CHECKOUT_SAGA, context);
  }

  private definition(): SagaDefinition<CheckoutContext> {
    return {
      type: CHECKOUT_SAGA,
      steps: [
        {
          name: 'reserve-inventory',
          forward: async (ctx) => {
            for (const item of ctx.items) {
              const ok = await this.inventory.reserve(
                item.productId,
                item.quantity,
              );
              if (!ok) {
                throw new Error(`insufficient stock for ${item.productId}`);
              }
            }
          },
          compensate: async (ctx) => {
            for (const item of ctx.items) {
              await this.inventory.release(item.productId, item.quantity);
            }
          },
        },
        {
          name: 'charge-payment',
          forward: async (ctx) => {
            const { externalId } = await this.gateway.charge({
              orderId: ctx.orderId,
              amountCents: ctx.amountCents,
              currency: ctx.currency,
              ownerId: ctx.memberId,
            });
            ctx.externalPaymentId = externalId;
          },
          compensate: async (ctx) => {
            if (ctx.externalPaymentId) {
              await this.gateway.refund(ctx.externalPaymentId);
            }
          },
        },
        {
          name: 'write-ledger',
          forward: async (ctx) => {
            await this.ledger.postTransaction({
              kind: 'CHARGE',
              sourceType: 'Order',
              sourceId: ctx.orderId,
              description: `Checkout charge for order ${ctx.orderId}`,
              postings: [
                {
                  accountId: 'platform',
                  direction: 'DEBIT',
                  amountCents: ctx.amountCents,
                  currency: ctx.currency,
                },
                {
                  accountId: `user:${ctx.memberId}`,
                  direction: 'CREDIT',
                  amountCents: ctx.amountCents,
                  currency: ctx.currency,
                },
              ],
            });
          },
          compensate: async (ctx) => {
            await this.ledger.postTransaction({
              kind: 'REFUND',
              sourceType: 'Order',
              sourceId: ctx.orderId,
              description: `Checkout reversal for order ${ctx.orderId}`,
              postings: [
                {
                  accountId: `user:${ctx.memberId}`,
                  direction: 'DEBIT',
                  amountCents: ctx.amountCents,
                  currency: ctx.currency,
                },
                {
                  accountId: 'platform',
                  direction: 'CREDIT',
                  amountCents: ctx.amountCents,
                  currency: ctx.currency,
                },
              ],
            });
          },
        },
        {
          name: 'confirm-order',
          forward: async (ctx) => {
            await this.orders.transition(
              ctx.orderId,
              OrderStatus.PAID,
              'SYSTEM',
            );
          },
          compensate: async (ctx) => {
            await this.orders.transition(
              ctx.orderId,
              OrderStatus.REFUNDED,
              'SYSTEM',
            );
          },
        },
        {
          // No compensation: an outbound notification is safe to duplicate.
          name: 'emit-notification',
          forward: async (ctx) => {
            await this.prisma.$transaction((tx) =>
              this.outbox.emit(tx, 'order.paid', {
                orderId: ctx.orderId,
                memberId: ctx.memberId,
              }),
            );
          },
        },
      ],
      onFailure: async (ctx) => {
        const order = await this.prisma.order.findUnique({
          where: { id: ctx.orderId },
        });
        if (order?.status === OrderStatus.PENDING) {
          await this.orders.transition(
            ctx.orderId,
            OrderStatus.CANCELLED,
            'SYSTEM',
          );
        }
      },
    };
  }
}
