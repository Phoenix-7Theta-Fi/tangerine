import { Injectable } from '@nestjs/common';
import { PaymentStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

export interface ChargeResult {
  externalId: string;
}

/**
 * Payment gateway boundary.
 *
 * In production this fronts Stripe (create a PaymentIntent to charge, refund it
 * to compensate). The bundled implementation is a local, offline stand-in that
 * records a `Payment` row and flips its status, so the saga's charge/refund
 * steps are testable without network or keys. The interface is the seam: swap
 * the implementation and the saga is unchanged.
 */
@Injectable()
export class PaymentGateway {
  constructor(private readonly prisma: PrismaService) {}

  async charge(params: {
    orderId: string;
    amountCents: number;
    currency: string;
    ownerId: string;
  }): Promise<ChargeResult> {
    const externalId = `pi_saga_${params.orderId}`;
    await this.prisma.payment.upsert({
      where: { externalId },
      create: {
        externalId,
        ownerId: params.ownerId,
        amountCents: params.amountCents,
        currency: params.currency,
        status: PaymentStatus.SUCCEEDED,
      },
      update: {},
    });
    return { externalId };
  }

  async refund(externalId: string): Promise<void> {
    await this.prisma.payment.updateMany({
      where: { externalId, status: PaymentStatus.SUCCEEDED },
      data: { status: PaymentStatus.REFUNDED },
    });
  }
}
