import { Type } from 'class-transformer';
import { IsInt, IsISO8601, IsOptional, IsString, Max, Min } from 'class-validator';

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
