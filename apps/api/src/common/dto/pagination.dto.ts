import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class PaginationQueryDto {
  @ApiPropertyOptional({ description: 'Opaque keyset cursor from a previous page' })
  @IsOptional()
  @IsString()
  cursor?: string;

  @ApiPropertyOptional({ default: 20, minimum: 1, maximum: 50 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number = 20;
}

export interface Page<T> {
  items: T[];
  nextCursor: string | null;
}

export function toPage<T>(
  items: T[],
  limit: number,
  cursorOf: (item: T) => string,
): Page<T> {
  const hasMore = items.length > limit;
  const pageItems = hasMore ? items.slice(0, limit) : items;
  return {
    items: pageItems,
    nextCursor: hasMore ? cursorOf(pageItems[pageItems.length - 1]) : null,
  };
}
