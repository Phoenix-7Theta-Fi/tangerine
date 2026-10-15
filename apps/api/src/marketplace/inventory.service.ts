import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MetricsService } from '../metrics/metrics.service';

/**
 * Inventory reservation over a single contended row.
 *
 * The conditional UPDATE is the whole concurrency story: `quantity - reserved
 * >= n` is evaluated atomically by the row lock, so N concurrent reservations
 * for the same unit can never over-commit. There is no read-modify-write race
 * and no application-level locking.
 */
@Injectable()
export class InventoryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly metrics: MetricsService,
  ) {}

  /** Reserve `quantity` units. Returns false (never throws) when short. */
  async reserve(productId: string, quantity: number): Promise<boolean> {
    if (!Number.isInteger(quantity) || quantity <= 0) return false;
    const rows = await this.prisma.$executeRaw`
      UPDATE "InventoryItem"
      SET reserved = reserved + ${quantity},
          version = version + 1,
          "updatedAt" = now()
      WHERE "productId" = ${productId}
        AND quantity - reserved >= ${quantity}
    `;
    const ok = rows === 1;
    this.metrics.inventoryReservations.inc({
      outcome: ok ? 'reserved' : 'rejected',
    });
    return ok;
  }

  /** Release `quantity` reserved units (compensating action / sweep). */
  async release(productId: string, quantity: number): Promise<boolean> {
    if (!Number.isInteger(quantity) || quantity <= 0) return false;
    const rows = await this.prisma.$executeRaw`
      UPDATE "InventoryItem"
      SET reserved = reserved - ${quantity},
          version = version + 1,
          "updatedAt" = now()
      WHERE "productId" = ${productId}
        AND reserved >= ${quantity}
    `;
    const ok = rows === 1;
    this.metrics.inventoryReservations.inc({
      outcome: ok ? 'released' : 'release_miss',
    });
    return ok;
  }

  /**
   * Release soft holds on expired cart lines. `FOR UPDATE SKIP LOCKED` lets
   * several sweepers run concurrently without blocking each other or checkout.
   */
  async sweepExpired(limit = 200): Promise<number> {
    const expired = await this.prisma.$queryRaw<{ id: string }[]>`
      SELECT id FROM "CartItem"
      WHERE "reservedUntil" IS NOT NULL AND "reservedUntil" < now()
      ORDER BY "reservedUntil" ASC
      LIMIT ${limit}
      FOR UPDATE SKIP LOCKED
    `;
    if (expired.length === 0) return 0;
    const ids = expired.map((r) => r.id);
    const cleared = await this.prisma.cartItem.updateMany({
      where: { id: { in: ids } },
      data: { reservedUntil: null },
    });
    return cleared.count;
  }
}
