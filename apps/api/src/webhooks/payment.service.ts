import { Injectable, Logger } from '@nestjs/common';
import { Payment, PaymentStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

interface TransitionRule {
  to: PaymentStatus;
  /** Current statuses from which this transition is legal. Empty = create-only. */
  from: PaymentStatus[];
}

/**
 * Data-driven transition table for the Payment lifecycle.
 *
 * Provider events arrive out of order, so this is not a linear pipeline: a
 * transition is applied only when it is legal from the current status and has
 * not already happened. Anything else is a no-op. `payment_intent.created` is
 * create-only (it never downgrades an advanced payment).
 */
const PAYMENT_TRANSITIONS: Record<string, TransitionRule> = {
  'payment_intent.created': { to: PaymentStatus.CREATED, from: [] },
  'payment_intent.succeeded': {
    to: PaymentStatus.SUCCEEDED,
    from: [PaymentStatus.CREATED],
  },
  'payment_intent.payment_failed': {
    to: PaymentStatus.FAILED,
    from: [PaymentStatus.CREATED],
  },
  'payment_intent.canceled': {
    to: PaymentStatus.FAILED,
    from: [PaymentStatus.CREATED],
  },
  'charge.refunded': {
    to: PaymentStatus.REFUNDED,
    from: [PaymentStatus.SUCCEEDED],
  },
};

export interface AppliedEvent {
  paymentId: string;
  status: PaymentStatus;
  /** True only when the status actually advanced. */
  changed: boolean;
}

interface StripeLikeObject {
  id?: string;
  amount?: number;
  currency?: string;
  metadata?: Record<string, unknown> | null;
  /** Stripe may expand this into a full object; we never read it here. */
  payment_intent?: string | { id?: string } | null;
}

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(private readonly prisma: PrismaService) {}

  get supports(): string[] {
    return Object.keys(PAYMENT_TRANSITIONS);
  }

  /**
   * Apply one provider event to a payment, order-independently.
   *
   * The payment is created on first sight (any event), so a `succeeded` that
   * arrives before `created` still lands on SUCCEEDED, and a later `created`
   * is a no-op.
   */
  async applyWebhookEvent(
    externalId: string,
    eventType: string,
    object: StripeLikeObject,
  ): Promise<AppliedEvent> {
    const payment = await this.ensurePayment(externalId, object);

    const rule = PAYMENT_TRANSITIONS[eventType];
    if (!rule || eventType === 'payment_intent.created') {
      return { paymentId: payment.id, status: payment.status, changed: false };
    }
    if (payment.status === rule.to) {
      return { paymentId: payment.id, status: payment.status, changed: false };
    }
    if (!rule.from.includes(payment.status)) {
      this.logger.debug(
        `payment ${externalId}: ${eventType} ignored (status ${payment.status})`,
      );
      return { paymentId: payment.id, status: payment.status, changed: false };
    }

    const updated = await this.prisma.$transaction(async (tx) => {
      const row = await tx.payment.update({
        where: { id: payment.id },
        data: { status: rule.to },
      });
      await tx.paymentStateTransition.create({
        data: {
          paymentId: row.id,
          fromStatus: payment.status,
          toStatus: rule.to,
          eventType,
        },
      });
      return row;
    });

    return { paymentId: updated.id, status: updated.status, changed: true };
  }

  async getByExternalId(externalId: string): Promise<Payment | null> {
    return this.prisma.payment.findUnique({ where: { externalId } });
  }

  private async ensurePayment(
    externalId: string,
    object: StripeLikeObject,
  ): Promise<Payment> {
    const existing = await this.prisma.payment.findUnique({
      where: { externalId },
    });
    if (existing) return existing;

    const ownerId = await this.resolveOwner(object.metadata);
    const amountCents =
      Number.isInteger(object.amount) && (object.amount as number) >= 0
        ? (object.amount as number)
        : 0;
    const currency = (object.currency ?? 'usd').toUpperCase();

    try {
      return await this.prisma.payment.create({
        data: { externalId, ownerId, amountCents, currency },
      });
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === 'P2002'
      ) {
        return this.prisma.payment.findUniqueOrThrow({ where: { externalId } });
      }
      throw err;
    }
  }

  private async resolveOwner(
    metadata: Record<string, unknown> | null | undefined,
  ): Promise<string | null> {
    const candidate = metadata?.ownerId;
    if (typeof candidate !== 'string' || candidate.length === 0) return null;
    const user = await this.prisma.user.findUnique({
      where: { id: candidate },
      select: { id: true },
    });
    return user?.id ?? null;
  }
}
