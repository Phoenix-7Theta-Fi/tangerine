import { Controller, Get, Header } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InjectQueue } from '@nestjs/bullmq';
import type { Queue } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';
import { FANOUT_QUEUE } from '../queue/queue.module';

/**
 * Minimal Prometheus exposition. The two numbers that matter operationally:
 * queue depth (backlog) and outbox lag (oldest unprocessed event age). If lag
 * climbs, the fan-out workers are not keeping up — the signal you alert on.
 *
 * A fuller setup would use prom-client + a /metrics scrape config, but the
 * shape is the same: expose a gauge, alert on its derivative.
 */
@ApiTags('metrics')
@Controller('metrics')
export class MetricsController {
  constructor(
    @InjectQueue(FANOUT_QUEUE) private readonly queue: Queue,
    private readonly prisma: PrismaService,
  ) {}

  @Get()
  @Header('content-type', 'text/plain; version=0.0.4; charset=utf-8')
  async scrape(): Promise<string> {
    const [counts, grouped, oldest] = await Promise.all([
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
    ]);

    const outbox: Record<string, number> = {
      PENDING: 0,
      RELAYED: 0,
      PROCESSED: 0,
      FAILED: 0,
    };
    for (const row of grouped) {
      outbox[row.status] = row._count._all;
    }
    const lagSeconds = oldest
      ? Math.max(0, (Date.now() - oldest.createdAt.getTime()) / 1000)
      : 0;

    const lines: string[] = [
      '# HELP tangerine_outbox_events Outbox events by status.',
      '# TYPE tangerine_outbox_events gauge',
      ...Object.entries(outbox).map(
        ([status, value]) =>
          `tangerine_outbox_events{status="${status.toLowerCase()}"} ${value}`,
      ),
      '# HELP tangerine_outbox_oldest_pending_seconds Age of the oldest unrelayed event.',
      '# TYPE tangerine_outbox_oldest_pending_seconds gauge',
      `tangerine_outbox_oldest_pending_seconds ${lagSeconds.toFixed(3)}`,
      '# HELP tangerine_fanout_queue_jobs Fan-out queue jobs by state.',
      '# TYPE tangerine_fanout_queue_jobs gauge',
      ...Object.entries(counts).map(
        ([state, value]) => `tangerine_fanout_queue_jobs{state="${state}"} ${value}`,
      ),
    ];
    return lines.join('\n') + '\n';
  }
}
