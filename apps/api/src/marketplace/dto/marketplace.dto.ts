import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OrderActorRole, OrderStatus } from '@prisma/client';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  @MaxLength(160)
  name!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @ApiProperty({ description: 'Unit price in minor units (cents)' })
  @IsInt()
  @Min(0)
  @Max(1_000_000_000)
  priceCents!: number;

  @ApiPropertyOptional({ default: 'USD' })
  @IsOptional()
  @IsString()
  @MaxLength(3)
  currency?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(80)
  category?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isSponsored?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  conflictOfInterestNote?: string;

  @ApiPropertyOptional({ description: 'Initial stock quantity', default: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(1_000_000)
  quantity?: number;
}

export class ReserveInventoryDto {
  @ApiProperty()
  @IsInt()
  @Min(1)
  @Max(100_000)
  quantity!: number;
}

export class AddCartItemDto {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  productId!: string;

  @ApiProperty()
  @IsInt()
  @Min(1)
  @Max(10_000)
  quantity!: number;

  @ApiProperty({ description: 'Cart version the client last read' })
  @IsInt()
  @Min(0)
  expectedVersion!: number;
}

export class CreateOrderDto {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  cartId!: string;
}

export class TransitionOrderDto {
  @ApiProperty({ enum: OrderStatus })
  @IsEnum(OrderStatus)
  to!: OrderStatus;

  @ApiProperty({ enum: OrderActorRole })
  @IsEnum(OrderActorRole)
  actorRole!: OrderActorRole;
}
