import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class StartDirectConversationDto {
  @ApiProperty({ description: 'The other user id' })
  @IsString()
  userId!: string;
}

export class SendMessageDto {
  @ApiProperty({ maxLength: 2000 })
  @IsString()
  @MinLength(1)
  @MaxLength(2000)
  body!: string;

  @ApiPropertyOptional({ description: 'Client idempotency key for retries' })
  @IsOptional()
  @IsString()
  clientMsgId?: string;
}

export class MarkReadDto {
  @ApiProperty({ description: 'Highest sequence number the user has read' })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  seq!: number;
}
