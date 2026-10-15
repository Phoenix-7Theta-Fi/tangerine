import {
  BadRequestException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'node:crypto';
import Stripe from 'stripe';
import { PrismaService } from '../prisma/prisma.service';
import { MetricsService } from '../metrics/metrics.service';
import { IdempotencyService } from '../idempotency/idempotency.service';
import { LedgerService } from '../ledger/ledger.service';
import type { AppConfig } from '../config/configuration';
import { PaymentService } from './payment.service';

export type IngestOutcome = 'processed' | 'deduped' | 'invalid_signature' | 'failed';

export interface IngestResult {
  status: IngestOutcome;
  source: string;
  eventId: string;
  type: string;
}

interface StripeObjectLike {
  id?: string;
  amount?: number;
  currency?: string;
  metadata?: Record<string, unknown> | null;
  payment_intent?: string | null;
}

/**
 * Webhook ingestion.
 *
 * Three layers of exactly-once protection, from cheapest to most durable:
 *   1. Signature verification (`constructEvent`) rejects anything unauthentic.
 *   2. The transactional inbox (`WebhookEvent`, unique on source + event id)
 *      makes ingestion idempotent — a replay never dispatches twice.
 *   3. The idempotency service wraps dispatch, so processing interrupted by a
 *      crash is retried rather than lost, and the side effects (ledger writes)
 *      are themselves idempotent on their source.
 */
@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name);
  private readonly stripe: Stripe;

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService<AppConfig, true>,
    private readonly metrics: MetricsService,
    private readonly idempotency: IdempotencyService,
    private readonly payments: PaymentService,
    private readonly ledger: LedgerService,
  ) {
    this.stripe = new Stripe(
      this.config.get('stripeSecretKey', { infer: true }),
    );
  }

  /** Verify, deduplicate, and dispatch a Stripe webhook. */
  async ingestStripe(
    rawBody: Buffer | undefined,
    signature: string | undefined,
  ): Promise<IngestResult> {
    if (!rawBody || !signature) {
      this.metrics.webhookEvents.inc({
        source: 'stripe',
        type: 'unknown',
        outcome: 'invalid_signature',
      });
      throw new BadRequestException('Missing webhook body or signature');
    }

    let event: Stripe.Event;
    try {
      event = this.stripe.webhooks.constructEvent(
        rawBody,
        signature,
        this.config.get('stripeWebhookSecret', { infer: true }),
        this.config.get('stripeWebhookTolerance', { infer: true }),
      );
    } catch (err) {
      this.logger.warn(
        `rejected webhook with invalid signature: ${(err as Error).message}`,
      );
      this.metrics.webhookEvents.inc({
        source: 'stripe',
        type: 'unknown',
        outcome: 'invalid_signature',
      });
      throw new BadRequestException('Invalid webhook signature');
    }

    return this.process('stripe', event.id, event.type, event);
  }

  private async process(
    source: string,
    externalEventId: string,
    type: string,
    event: Stripe.Event,
  ): Promise<IngestResult> {
    const id = randomUUID();
    const inserted = await this.prisma.$queryRaw<{ id: string }[]>`
      INSERT INTO "WebhookEvent"
        (id, source, "externalEventId", type, payload, status, "receivedAt")
      VALUES
        (${id}, ${source}, ${externalEventId}, ${type},
         ${JSON.stringify(event)}::jsonb, 'RECEIVED'::"WebhookEventStatus", now())
      ON CONFLICT (source, "externalEventId") DO NOTHING
      RETURNING id
    `;
    const isNew = inserted.length > 0;

    if (!isNew) {
      const existing = await this.prisma.webhookEvent.findUnique({
        where: {
          source_externalEventId: { source, externalEventId },
        },
        select: { status: true },
      });
      if (existing?.status === 'PROCESSED') {
        this.metrics.webhookEvents.inc({ source, type, outcome: 'deduped' });
        return { status: 'deduped', source, eventId: externalEventId, type };
      }
      // RECEIVED or FAILED → fall through and (re)process.
    } else {
      this.metrics.webhookEvents.inc({ source, type, outcome: 'processed' });
    }

    try {
      await this.idempotency.execute({
        userId: source,
        key: `webhook:${source}:${externalEventId}`,
        request: event,
        action: 'webhook',
        execute: () => this.dispatch(event),
      });
      await this.prisma.webhookEvent.update({
        where: { source_externalEventId: { source, externalEventId } },
        data: { status: 'PROCESSED', processedAt: new Date() },
      });
      if (!isNew) {
        this.metrics.webhookEvents.inc({ source, type, outcome: 'deduped' });
      }
      return {
        status: isNew ? 'processed' : 'deduped',
        source,
        eventId: externalEventId,
        type,
      };
    } catch (err) {
      await this.prisma.webhookEvent
        .update({
          where: { source_externalEventId: { source, externalEventId } },
          data: { status: 'FAILED' },
        })
        .catch(() => undefined);
      this.metrics.webhookEvents.inc({ source, type, outcome: 'failed' });
      throw err;
    }
  }

  /** Route a verified event to its handler. Idempotent by construction. */
  private async dispatch(event: Stripe.Event): Promise<void> {
    switch (event.type) {
      case 'payment_intent.created':
      case 'payment_intent.succeeded':
      case 'payment_intent.payment_failed':
      case 'payment_intent.canceled': {
        const pi = event.data.object as StripeObjectLike & { id: string };
        const applied = await this.payments.applyWebhookEvent(
          pi.id,
          event.type,
          pi,
        );
        if (event.type === 'payment_intent.succeeded') {
          // Always attempt the ledger write on success: it is idempotent on
          // (Payment, id, CHARGE), so a retry after a partial failure recovers.
          await this.postCharge(applied.paymentId, pi.id);
        }
        return;
      }
      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge;
        const externalId =
          typeof charge.payment_intent === 'string' ? charge.payment_intent : null;
        if (!externalId) return;
        const applied = await this.payments.applyWebhookEvent(
          externalId,
          event.type,
          charge,
        );
        await this.postRefund(applied.paymentId, externalId, charge.amount);
        return;
      }
      default:
        this.logger.debug(`ignoring unhandled webhook type ${event.type}`);
        return;
    }
  }

  private async postCharge(paymentId: string, externalId: string): Promise<void> {
    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
    });
    if (!payment || payment.amountCents <= 0) return;

    await this.ledger.postTransaction({
      kind: 'CHARGE',
      sourceType: 'Payment',
      sourceId: externalId,
      description: `Stripe PaymentIntent ${externalId}`,
      postings: [
        { accountId: 'platform', direction: 'DEBIT', amountCents: payment.amountCents },
        {
          accountId: `user:${payment.ownerId ?? 'unknown'}`,
          direction: 'CREDIT',
          amountCents: payment.amountCents,
        },
      ],
    });
  }

  private async postRefund(
    paymentId: string,
    externalId: string,
    amount: number,
  ): Promise<void> {
    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
    });
    const amountCents =
      Number.isInteger(amount) && amount > 0 ? amount : payment?.amountCents ?? 0;
    if (!payment || amountCents <= 0) return;

    await this.ledger.postTransaction({
      kind: 'REFUND',
      sourceType: 'Payment',
      sourceId: externalId,
      description: `Stripe refund for ${externalId}`,
      postings: [
        {
          accountId: `user:${payment.ownerId ?? 'unknown'}`,
          direction: 'DEBIT',
          amountCents,
        },
        { accountId: 'platform', direction: 'CREDIT', amountCents },
      ],
    });
  }
}
