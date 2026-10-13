import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import type { AppConfig } from '../config/configuration';

/**
 * Thin wrapper around two ioredis connections:
 *  - `client`     : general command connection (ZSETs, presence, counters).
 *  - `subscriber` : dedicated connection, because a subscribed Redis connection
 *                   cannot issue normal commands.
 *
 * Redis holds only *derived* state here — materialized home timelines and
 * presence keys. Everything can be rebuilt from Postgres, which is why a cold
 * cache is a non-event rather than a data-loss incident.
 */
@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  public readonly client: Redis;
  public readonly subscriber: Redis;
  public readonly publisher: Redis;

  constructor(private readonly config: ConfigService<AppConfig, true>) {
    const url = this.config.get('redisUrl', { infer: true });
    const opts = { lazyConnect: false, maxRetriesPerRequest: null };
    this.client = new Redis(url, opts);
    this.subscriber = new Redis(url, opts);
    this.publisher = new Redis(url, opts);
    for (const [name, conn] of Object.entries({
      client: this.client,
      subscriber: this.subscriber,
      publisher: this.publisher,
    })) {
      conn.on('error', (err) =>
        this.logger.warn(`Redis(${name}) error: ${err.message}`),
      );
    }
  }

  async onModuleInit(): Promise<void> {
    try {
      await this.client.ping();
      this.logger.log('Connected to Redis');
    } catch (err) {
      this.logger.error(`Redis not reachable: ${(err as Error).message}`);
    }
  }

  async onModuleDestroy(): Promise<void> {
    await Promise.allSettled([
      this.client.quit(),
      this.subscriber.quit(),
      this.publisher.quit(),
    ]);
  }
}
