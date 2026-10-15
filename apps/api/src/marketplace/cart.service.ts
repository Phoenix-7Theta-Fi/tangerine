import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Cart, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { MetricsService } from '../metrics/metrics.service';

const CART_INCLUDE = {
  items: { include: { product: true }, orderBy: { createdAt: 'asc' } },
} satisfies Prisma.CartInclude;

export type CartWithItems = Prisma.CartGetPayload<{ include: typeof CART_INCLUDE }>;

/** How long a cart line's soft hold lasts before the sweeper clears it. */
const CART_HOLD_MS = 15 * 60 * 1000;

/**
 * Cart with optimistic concurrency.
 *
 * Every mutation must present the version it read. A stale version loses the
 * `UPDATE ... WHERE version = expected` race (0 rows) and gets a 409, so two
 * concurrent edits can never silently clobber each other.
 */
@Injectable()
export class CartService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly metrics: MetricsService,
  ) {}

  async getOrCreateCart(userId: string): Promise<Cart> {
    return this.prisma.cart.upsert({
      where: { userId },
      create: { userId },
      update: {},
    });
  }

  async getCart(userId: string): Promise<CartWithItems> {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: CART_INCLUDE,
    });
    if (!cart) throw new NotFoundException('Cart not found');
    return cart;
  }

  async addItem(
    userId: string,
    productId: string,
    quantity: number,
    expectedVersion: number,
  ): Promise<CartWithItems> {
    if (quantity <= 0) throw new ConflictException('quantity must be positive');

    const cart = await this.getOrCreateCart(userId);

    const held = await this.prisma.cart.updateMany({
      where: { id: cart.id, version: expectedVersion },
      data: { version: { increment: 1 } },
    });
    if (held.count === 0) {
      this.metrics.cartConflicts.inc();
      throw new ConflictException(
        'Cart was modified by another request; refetch and retry',
      );
    }

    const reservedUntil = new Date(Date.now() + CART_HOLD_MS);
    await this.prisma.cartItem.upsert({
      where: { cartId_productId: { cartId: cart.id, productId } },
      create: { cartId: cart.id, productId, quantity, reservedUntil },
      update: { quantity: { increment: quantity }, reservedUntil },
    });

    return this.getCart(userId);
  }
}
