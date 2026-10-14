import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsISO8601,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';

export class CreateSessionTypeDto {
  @ApiProperty()
  @IsString()
  @MinLength(2)
  @MaxLength(80)
  name!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(280)
  description?: string;

  @ApiProperty({ description: 'Slot length in minutes' })
  @IsInt()
  @Min(5)
  @Max(480)
  durationMinutes!: number;

  @ApiProperty({ description: 'Price in minor units (cents)' })
  @IsInt()
  @Min(0)
  priceCents!: number;

  @ApiPropertyOptional({ default: 'USD' })
  @IsOptional()
  @IsString()
  @MaxLength(3)
  currency?: string;
}

export class AvailabilitySlotDto {
  @ApiProperty({ description: '0 = Sunday … 6 = Saturday (local)' })
  @IsInt()
  @Min(0)
  @Max(6)
  weekday!: number;

  @ApiProperty({ description: 'Minutes from local midnight, inclusive' })
  @IsInt()
  @Min(0)
  @Max(1440)
  startMinute!: number;

  @ApiProperty({ description: 'Minutes from local midnight, exclusive' })
  @IsInt()
  @Min(0)
  @Max(1440)
  endMinute!: number;

  @ApiPropertyOptional({ default: 'UTC' })
  @IsOptional()
  @IsString()
  @MaxLength(64)
  timezone?: string;
}

export class SetAvailabilityDto {
  @ApiProperty({ type: [AvailabilitySlotDto] })
  @IsArray()
  @ArrayMaxSize(50)
  @ValidateNested({ each: true })
  @Type(() => AvailabilitySlotDto)
  slots!: AvailabilitySlotDto[];
}

export class OpenSlotsQueryDto {
  @ApiProperty({ description: 'ISO-8601 start of the range (inclusive)' })
  @IsISO8601()
  from!: string;

  @ApiProperty({ description: 'ISO-8601 end of the range (exclusive)' })
  @IsISO8601()
  to!: string;

  @ApiPropertyOptional({ description: 'Restrict to one session type' })
  @IsOptional()
  @IsString()
  sessionTypeId?: string;

  @ApiPropertyOptional({
    description: 'Slot grid in minutes; defaults to the session duration',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(5)
  @Max(120)
  granularityMinutes?: number;

  @ApiPropertyOptional({
    description:
      'Cap the returned slots (compute is unaffected; keeps response size constant)',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(500)
  maxSlots?: number;
}

export class CreateBookingDto {
  @ApiProperty()
  @IsString()
  sessionTypeId!: string;

  @ApiProperty({ description: 'ISO-8601 start time' })
  @IsISO8601()
  startTime!: string;

  @ApiPropertyOptional({ description: 'Idempotency key for this booking intent' })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  clientOpId?: string;

  @ApiPropertyOptional({ description: 'Consume an existing hold into a booking' })
  @IsOptional()
  @IsString()
  holdId?: string;
}

export class CreateHoldDto {
  @ApiProperty()
  @IsString()
  sessionTypeId!: string;

  @ApiProperty({ description: 'ISO-8601 start time' })
  @IsISO8601()
  startTime!: string;

  @ApiPropertyOptional({ description: 'Idempotency key' })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  clientOpId?: string;

  @ApiPropertyOptional({ description: 'Override hold TTL in seconds' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(3600)
  ttlSeconds?: number;
}

export class RescheduleBookingDto {
  @ApiProperty({ description: 'New ISO-8601 start time' })
  @IsISO8601()
  startTime!: string;

  @ApiPropertyOptional({ description: 'Idempotency key' })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  clientOpId?: string;
}

export class CancelBookingDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(280)
  reason?: string;

  @ApiPropertyOptional({ description: 'Idempotency key' })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  clientOpId?: string;
}

export class ListBookingsQueryDto {
  @ApiPropertyOptional({ enum: ['member', 'practitioner'] })
  @IsOptional()
  @IsString()
  as?: 'member' | 'practitioner';

  @ApiPropertyOptional()
  @IsOptional()
  @IsISO8601()
  from?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsISO8601()
  to?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(200)
  limit?: number;
}
