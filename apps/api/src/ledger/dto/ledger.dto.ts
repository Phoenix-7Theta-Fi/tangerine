import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { LedgerDirection, LedgerTransactionKind } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';

export class LedgerPostingDto {
  @ApiProperty({
    description: 'Free-form account key, e.g. "user:<id>", "platform", "escrow:<orderId>"',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(160)
  accountId!: string;

  @ApiProperty({ enum: LedgerDirection })
  @IsEnum(LedgerDirection)
  direction!: LedgerDirection;

  @ApiProperty({ description: 'Positive amount in minor units (cents)' })
  @IsInt()
  @Min(1)
  @Max(1_000_000_000)
  amountCents!: number;

  @ApiPropertyOptional({ default: 'USD' })
  @IsOptional()
  @IsString()
  @MaxLength(3)
  currency?: string;
}

export class PostTransactionDto {
  @ApiProperty({ enum: LedgerTransactionKind })
  @IsEnum(LedgerTransactionKind)
  kind!: LedgerTransactionKind;

  @ApiProperty({ description: 'Domain object type that caused this transaction' })
  @IsString()
  @MinLength(1)
  @MaxLength(80)
  sourceType!: string;

  @ApiProperty({ description: 'Domain object id; unique per (sourceType, sourceId, kind)' })
  @IsString()
  @MinLength(1)
  @MaxLength(160)
  sourceId!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(280)
  description?: string;

  @ApiProperty({ type: [LedgerPostingDto] })
  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(20)
  @ValidateNested({ each: true })
  @Type(() => LedgerPostingDto)
  postings!: LedgerPostingDto[];
}

export class ListLedgerTransactionsQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(80)
  sourceType?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(160)
  sourceId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(500)
  limit?: number;
}
