import {
  Controller,
  Headers,
  HttpCode,
  Post,
  RawBodyRequest,
  Req,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import type { FastifyRequest } from 'fastify';
import { WebhookService } from './webhook.service';

@ApiTags('webhooks')
@Controller('webhooks')
export class WebhookController {
  constructor(private readonly webhooks: WebhookService) {}

  @Post('stripe')
  @HttpCode(200)
  @ApiOperation({
    summary:
      'Stripe webhook endpoint. Signature-verified, deduplicated, idempotent.',
  })
  stripe(
    @Req() req: RawBodyRequest<FastifyRequest>,
    @Headers('stripe-signature') signature?: string,
  ) {
    return this.webhooks.ingestStripe(req.rawBody, signature);
  }
}
