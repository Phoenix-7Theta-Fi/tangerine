import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CheckoutDto {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  orderId!: string;

  @ApiPropertyOptional({
    description:
      'Test-only failure injection: the named step will fail (requires SAGA_FAILURE_INJECTION=1).',
  })
  @IsOptional()
  @IsString()
  @MaxLength(80)
  forceFailStep?: string;
}
