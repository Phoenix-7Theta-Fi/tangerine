import {
  Inject,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectQueue } from '@nestjs/bullmq';
import type { Queue } from 'bullmq';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { FANOUT_QUEUE, HEALTH_QUEUE } from '../queue/queue.module';
import type { AppConfig } from '../config/configuration';

export const POST_CREATED = 'post.created';
export const BOOKING_CONFIRMED = 'booking.confirmed';
export const BOOKING_CANCELLED = 'booking.cancelled';
export const HEALTH_OBSERVATION_INGESTED = 'health.observation.ingested';
export const HEALTH_ADHERENCE_LOGGED = 'health.adherence.logged';
export const HEALTH_RANGE_ALERT = 'health.range.alert';

export interface PostCreatedPayload {
  postId: string;
  authorId: string;
  createdAt: string;
  authorIsCelebrity: boolean;
}

export interface BookingEventPayload {
  bookingId: string;
  practitionerId: string;
  memberId: string;
  sessionTypeId: string;
  startTime: string;
  endTime: string;
  status: string;
  rescheduled?: boolean;
  reason?: string | null;
  withinNoticeWindow?: boolean;
}

interface PendingRow {
  id: string;
  type: string;
  payload: unknown;
}

/**
 * Transactional outbox: the write side of the async fan-out pipeline.
 *
 * `emit` is called *inside* the same transaction as the domain change, so the
 * event and the change commit or roll back together. A relay loop then claims
 * pending rows and publishes them to the work queue. This is what lets us decouple
 * the post write (fast, bounded) from fan-out (slow, unbounded in follower count)
 * without ever losing or double-publishing work across a crash.
 */
@Injectable()
export class OutboxService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(OutboxService.name);
  private readonly intervalMs: number;
  private readonly batchSize: number;
  private timer?: NodeJS.Timeout;
  private relaying = false;

  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue(FANOUT_QUEUE) private readonly queue: Queue,
    @InjectQueue(HEALTH_QUEUE) private readonly healthQueue: Queue,
    config: ConfigService<AppConfig, true>,
  ) {
    this.intervalMs = config.get('outboxRelayIntervalMs', { infer: true });
    this.batchSize = config.get('outboxRelayBatchSize', { infer: true });
  }

  /** Enqueue an outbox event as part of a caller's transaction. */
  async emit(
    tx: Prisma.TransactionClient,
    type: string,
    payload: Prisma.InputJsonValue,
  ): Promise<void> {
    await tx.outboxEvent.create({ data: { type, payload } });
  }

  onModuleInit(): void {
    this.timer = setInterval(() => void this.relayOnce(), this.intervalMs);
    this.timer.unref?.();
    this.logger.log(`Outbox relay started (every ${this.intervalMs}ms)`);
  }

  onModuleDestroy(): void {
    if (this.timer) clearInterval(this.timer);
  }

  /**
   * Claims a batch of pending events and publishes them. `FOR UPDATE SKIP
   * LOCKED` lets several API instances relay the same table concurrently with no
   * coordination: each row is claimed by exactly one relay for the duration of
   * its transaction. `jobId = eventId` makes publishing idempotent — a crash
   * between commit and publish just re-relays, and BullMQ drops the duplicate.
   */
  async relayOnce(): Promise<number> {
    if (this.relaying) return 0;
    this.relaying = true;
    try {
      return await this.prisma.$transaction(async (tx) => {
        const rows = await tx.$queryRaw<PendingRow[]>`
          SELECT id, type, payload
          FROM "OutboxEvent"
          WHERE status = 'PENDING'::"OutboxStatus"
            AND "availableAt" <= now()
          ORDER BY "createdAt" ASC
          LIMIT ${this.batchSize}
          FOR UPDATE SKIP LOCKED
        `;

        for (const row of rows) {
          // Route by event family: health ingestions go to the health worker,
          // everything else to fan-out. Same outbox, same relay, same
          // crash-safety; the queue is just the consumer's address.
          const target = row.type.startsWith('health.') ? this.healthQueue : this.queue;
          await target.add(
            row.type,
            { eventId: row.id, payload: row.payload },
            {
              jobId: row.id, // dedupe key: same event -> same job
              attempts: 5,
              backoff: { type: 'exponential', delay: 1000 },
              removeOnComplete: { count: 1000 },
              removeOnFail: false, // keep failures for inspection / replay
            },
          );
          await tx.outboxEvent.update({
            where: { id: row.id },
            data: {
              status: 'RELAYED',
              relayedAt: new Date(),
              attempts: { increment: 1 },
            },
          });
        }
        return rows.length;
      });
    } catch (err) {
      this.logger.error(`Outbox relay failed: ${(err as Error).message}`);
      return 0;
    } finally {
      this.relaying = false;
    }
  }
}
