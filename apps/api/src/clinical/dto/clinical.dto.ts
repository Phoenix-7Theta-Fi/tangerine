import { Type } from 'class-transformer';
import {
  IsEnum,
  IsISO8601,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { AdherenceEventType, ObservationCategory } from '@prisma/client';

export class TrendQueryDto {
  /** Lookback interval, in days, for the comparison value. */
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(3650)
  lookbackDays?: number;

  /** Comma-separated LOINC codes; omit for every tracked code. */
  @IsOptional()
  @IsString()
  codes?: string;

  /** ISO instant to evaluate at (defaults to now). Lets tests pin "today". */
  @IsOptional()
  @IsISO8601()
  asOf?: string;
}

export class AdherenceQueryDto {
  /** Restrict to one protocol; omit for every active protocol. */
  @IsOptional()
  @IsString()
  protocolId?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(365)
  windowDays?: number;

  @IsOptional()
  @IsISO8601()
  asOf?: string;
}

export class ProgressQueryDto {
  @IsOptional()
  @IsISO8601()
  asOf?: string;
}

export class IngestObservationDto {
  @IsEnum(ObservationCategory)
  category!: ObservationCategory;

  @IsString()
  code!: string;

  @IsOptional()
  @IsString()
  codeSystem?: string;

  @IsOptional()
  @IsString()
  display?: string;

  @IsOptional()
  @IsNumber()
  valueNumeric?: number;

  @IsOptional()
  @IsString()
  valueString?: string;

  @IsOptional()
  @IsString()
  valueCode?: string;

  @IsOptional()
  @IsString()
  valueUnit?: string;

  @IsISO8601()
  effectiveAt!: string;

  @IsOptional()
  @IsISO8601()
  issuedAt?: string;

  /** Stable source id; defaults to the idempotency key. */
  @IsOptional()
  @IsString()
  sourceId?: string;

  @IsOptional()
  @IsString()
  deviceId?: string;

  @IsOptional()
  @IsString()
  encounterId?: string;
}

export class IngestAdherenceDto {
  @IsEnum(AdherenceEventType)
  type!: AdherenceEventType;

  @IsString()
  protocolItemKey!: string;

  @IsISO8601()
  occurredAt!: string;

  @IsOptional()
  @IsNumber()
  valueNumeric?: number;

  @IsOptional()
  @IsString()
  note?: string;

  @IsOptional()
  @IsString()
  sourceId?: string;
}
