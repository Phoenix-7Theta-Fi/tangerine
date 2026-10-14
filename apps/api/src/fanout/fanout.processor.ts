import { Logger } from '@nestjs/common';
import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import type { Job } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';
import { TimelineService } from '../timeline/timeline.service';
import { FANOUT_QUEUE } from '../queue/queue.module';
import {
  BOOKING_CANCELLED,
  BOOKING_CONFIRMED,
  POST_CREATED,
  type BookingEventPayload,
  type PostCreatedPayload,
} from '../outbox/outbox.service';

interface FanoutJobData {
  eventId: string;
  payload: PostCreatedPayload | BookingEventPayload;
}

/**
 * Consumes fan-out work off the queue, decoupled from the API request path.
 *
 * Fan-out is idempotent by construction: a timeline is a Redis sorted set keyed
 * by post id, so re-applying the same event is a no-op. That is what makes
 * at-least-once delivery from the queue safe.
 *
 * Retries use exponential backoff (configured on the job). After the final
 * attempt the outbox row is marked FAILED so the failure is durable and
 * inspectable rather than lost in the queue's failed set.
 */
@Processor(FANOUT_QUEUE)
export class FanoutProcessor extends WorkerHost {
  private readonly logger = new Logger(FanoutProcessor.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly timeline: TimelineService,
  ) {
    super();
  }

  async process(job: Job<FanoutJobData>): Promise<void> {
    if (job.name === POST_CREATED) {
      const p = job.data.payload as PostCreatedPayload;
      const { pushed, celebrity } = await this.timeline.fanoutPost({
        id: p.postId,
        authorId: p.authorId,
        createdAt: new Date(p.createdAt),
        authorIsCelebrity: p.authorIsCelebrity,
      });
      this.logger.debug(
        `fanned out ${p.postId}: pushed=${pushed} celebrity=${celebrity}`,
      );
    } else if (job.name === BOOKING_CONFIRMED || job.name === BOOKING_CANCELLED) {
      // Booking lifecycle events ride the same outbox -> queue -> worker path as
      // post fan-out. A real deployment fans these into the push/in-app
      // notification pipeline (Feature List Part 3); here the worker is the
      // durable consumer that guarantees delivery is not lost.
      const p = job.data.payload as BookingEventPayload;
      this.logger.debug(
        `consumed ${job.name} for booking ${p.bookingId} (${p.status})`,
      );
    }
    await this.mark(job.data.eventId, 'PROCESSED');
  }

  @OnWorkerEvent('failed')
  async onFailed(job: Job<FanoutJobData>, err: Error): Promise<void> {
    const maxAttempts = job.opts.attempts ?? 1;
    if (job.attemptsMade >= maxAttempts) {
      this.logger.error(
        `fan-out permanently failed for event ${job.data.eventId}: ${err.message}`,
      );
      await this.mark(job.data.eventId, 'FAILED', err.message);
    }
  }

  private async mark(
    eventId: string,
    status: 'PROCESSED' | 'FAILED',
    lastError?: string,
  ): Promise<void> {
    await this.prisma.outboxEvent
      .update({
        where: { id: eventId },
        data: {
          status,
          processedAt: new Date(),
          ...(lastError ? { lastError } : {}),
        },
      })
      .catch(() => undefined);
  }
}
