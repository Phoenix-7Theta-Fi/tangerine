import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

export interface CreateProductInput {
  practitionerId: string;
  name: string;
  description?: string;
  priceCents: number;
  currency?: string;
  category?: string;
  isSponsored?: boolean;
  conflictOfInterestNote?: string;
  quantity?: number;
}

const PRODUCT_INCLUDE = {
  inventory: true,
} satisfies Prisma.ProductInclude;

export type ProductWithInventory = Prisma.ProductGetPayload<{
  include: typeof PRODUCT_INCLUDE;
}>;

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  create(input: CreateProductInput): Promise<ProductWithInventory> {
    return this.prisma.product.create({
      data: {
        practitionerId: input.practitionerId,
        name: input.name,
        description: input.description ?? null,
        priceCents: input.priceCents,
        currency: input.currency ?? 'USD',
        category: input.category ?? null,
        isSponsored: input.isSponsored ?? false,
        conflictOfInterestNote: input.conflictOfInterestNote ?? null,
        inventory: { create: { quantity: input.quantity ?? 0 } },
      },
      include: PRODUCT_INCLUDE,
    });
  }

  list(activeOnly = true): Promise<ProductWithInventory[]> {
    return this.prisma.product.findMany({
      where: activeOnly ? { active: true } : {},
      include: PRODUCT_INCLUDE,
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }

  findById(id: string): Promise<ProductWithInventory | null> {
    return this.prisma.product.findUnique({
      where: { id },
      include: PRODUCT_INCLUDE,
    });
  }
}
