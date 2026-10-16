import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import type { AppConfig } from '../config/configuration';
import { bullConnectionFromUrl } from './redis-connection';

export const FANOUT_QUEUE = 'fanout';
export const HEALTH_QUEUE = 'health';

/**
 * Registers the BullMQ root connection and the fan-out queue once, globally, so
 * both the outbox relay (producer) and the fan-out worker (consumer) share a
 * single queue definition.
 */
@Global()
@Module({
  imports: [
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService<AppConfig, true>) => ({
        connection: bullConnectionFromUrl(config.get('redisUrl', { infer: true })),
      }),
    }),
    BullModule.registerQueue({ name: FANOUT_QUEUE }),
    BullModule.registerQueue({ name: HEALTH_QUEUE }),
  ],
  exports: [BullModule],
})
export class QueueModule {}
