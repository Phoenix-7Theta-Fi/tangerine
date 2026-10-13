import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUrl, MaxLength, MinLength } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({ maxLength: 500, example: 'Sleep and cortisol — what actually moves the needle?' })
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  body!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  mediaUrl?: string;
}

export class CreateCommentDto {
  @ApiProperty({ maxLength: 300 })
  @IsString()
  @MinLength(1)
  @MaxLength(300)
  body!: string;
}
