import { Controller, Get, Header } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InjectQueue } from '@nestjs/bullmq';
import type { Queue } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';
import { FANOUT_QUEUE } from '../queue/queue.module';
import { MetricsService } from './metrics.service';

/**
 * Prometheus exposition endpoint. Combines per-request/domain metrics from the
 * prom-client registry with gauges read from Postgres (outbox state, live
 * reservations) and BullMQ (queue depth) at scrape time.
 *
 * The two numbers that matter operationally remain **outbox lag** (age of the
 * oldest unprocessed event) and **queue depth**; if either climbs, the fan-out
 * workers are not keeping up.
 */
@ApiTags('metrics')
@Controller('metrics')
export class MetricsController {
  constructor(
    @InjectQueue(FANOUT_QUEUE) private readonly queue: Queue,
    private readonly prisma: PrismaService,
    private readonly metrics: MetricsService,
  ) {}

  @Get()
  @Header('content-type', 'text/plain; version=0.0.4; charset=utf-8')
  async scrape(): Promise<string> {
    const [counts, grouped, oldest, activeReservations, expiredHolds] =
      await Promise.all([
        this.queue.getJobCounts('wait', 'active', 'completed', 'failed', 'delayed'),
        this.prisma.outboxEvent.groupBy({
          by: ['status'],
          _count: { _all: true },
        }),
        this.prisma.outboxEvent.findFirst({
          where: { status: 'PENDING' },
          orderBy: { createdAt: 'asc' },
          select: { createdAt: true },
        }),
        this.prisma.booking.count({
          where: { status: { in: ['HELD', 'PENDING', 'CONFIRMED'] } },
        }),
        this.prisma.booking.count({
          where: { status: 'HELD', holdExpiresAt: { lt: new Date() } },
        }),
      ]);

    const outbox: Record<string, number> = {
      PENDING: 0,
      RELAYED: 0,
      PROCESSED: 0,
      FAILED: 0,
    };
    for (const row of grouped) outbox[row.status] = row._count._all;
    for (const [status, value] of Object.entries(outbox)) {
      this.metrics.outboxEvents.set({ status: status.toLowerCase() }, value);
    }

    const lagSeconds = oldest
      ? Math.max(0, (Date.now() - oldest.createdAt.getTime()) / 1000)
      : 0;
    this.metrics.outboxOldestPendingSeconds.set(lagSeconds);

    for (const [state, value] of Object.entries(counts)) {
      this.metrics.fanoutQueueJobs.set({ state }, value ?? 0);
    }
    this.metrics.activeReservations.set(activeReservations);
    this.metrics.expiredHoldsPending.set(expiredHolds);

    return this.metrics.metrics();
  }
}
