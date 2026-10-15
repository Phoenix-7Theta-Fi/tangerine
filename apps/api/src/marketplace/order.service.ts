import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { OrderActorRole, OrderStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { MetricsService } from '../metrics/metrics.service';

/**
 * Data-driven order state machine. `ORDER_TRANSITIONS[current]` lists the only
 * legal next statuses; everything else is rejected and counted as illegal.
 */
export const ORDER_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  [OrderStatus.PENDING]: [OrderStatus.PAID, OrderStatus.CANCELLED],
  [OrderStatus.PAID]: [OrderStatus.FULFILLING, OrderStatus.REFUNDED],
  [OrderStatus.FULFILLING]: [OrderStatus.SHIPPED, OrderStatus.CANCELLED],
  [OrderStatus.SHIPPED]: [OrderStatus.DELIVERED],
  [OrderStatus.DELIVERED]: [OrderStatus.RETURNED],
  [OrderStatus.RETURNED]: [OrderStatus.REFUNDED],
  [OrderStatus.REFUNDED]: [],
  [OrderStatus.CANCELLED]: [],
};

export const ORDER_TERMINAL: OrderStatus[] = [
  OrderStatus.REFUNDED,
  OrderStatus.CANCELLED,
];

const ORDER_INCLUDE = {
  items: true,
  transitions: { orderBy: { createdAt: 'asc' } },
} satisfies Prisma.OrderInclude;

export type OrderWithDetail = Prisma.OrderGetPayload<{
  include: typeof ORDER_INCLUDE;
}>;

@Injectable()
export class OrderService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly metrics: MetricsService,
  ) {}

  /** Create a PENDING order (with frozen line snapshots) from a cart. */
  async createFromCart(
    memberId: string,
    cartId: string,
  ): Promise<OrderWithDetail> {
    const cart = await this.prisma.cart.findUnique({
      where: { id: cartId },
      include: { items: { include: { product: true } } },
    });
    if (!cart) throw new NotFoundException('Cart not found');
    if (cart.items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    const totalCents = cart.items.reduce(
      (sum, i) => sum + i.product.priceCents * i.quantity,
      0,
    );
    const currency = cart.items[0].product.currency;

    return this.prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          memberId,
          status: OrderStatus.PENDING,
          totalCents,
          currency,
          items: {
            create: cart.items.map((i) => ({
              productId: i.productId,
              productName: i.product.name,
              quantity: i.quantity,
              unitPriceCents: i.product.priceCents,
            })),
          },
        },
      });
      await tx.cartItem.deleteMany({ where: { cartId } });
      await tx.cart.update({
        where: { id: cartId },
        data: { version: { increment: 1 } },
      });
      return tx.order.findUniqueOrThrow({
        where: { id: order.id },
        include: ORDER_INCLUDE,
      });
    });
  }

  async getOrder(orderId: string): Promise<OrderWithDetail> {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: ORDER_INCLUDE,
    });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  /** Apply a transition if legal; record it; reject (409) otherwise. */
  async transition(
    orderId: string,
    to: OrderStatus,
    actorRole: OrderActorRole,
    actorId?: string,
  ): Promise<OrderWithDetail> {
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new NotFoundException('Order not found');

    const legal = ORDER_TRANSITIONS[order.status].includes(to);
    this.metrics.orderTransitions.inc({
      from: order.status,
      to,
      legal: legal ? 'true' : 'false',
    });
    if (!legal) {
      throw new ConflictException(
        `Illegal transition ${order.status} to ${to}`,
      );
    }

    return this.prisma.$transaction(async (tx) => {
      await tx.order.update({
        where: { id: orderId },
        data: { status: to },
      });
      await tx.orderStateTransition.create({
        data: {
          orderId,
          fromStatus: order.status,
          toStatus: to,
          actorRole,
          actorId: actorId ?? null,
        },
      });
      return tx.order.findUniqueOrThrow({
        where: { id: orderId },
        include: ORDER_INCLUDE,
      });
    });
  }

  static isTerminal(status: OrderStatus): boolean {
    return ORDER_TERMINAL.includes(status);
  }
}
