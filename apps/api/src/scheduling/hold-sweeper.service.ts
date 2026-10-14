import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SchedulingService } from './scheduling.service';
import type { AppConfig } from '../config/configuration';
import { MetricsService } from '../metrics/metrics.service';

/**
 * Releases soft holds whose TTL has passed.
 *
 * A hold is a reservation with an expiry; "release" is an UPDATE that flips it
 * to CANCELLED, which immediately drops it out of the exclusion index so the
 * slot is bookable again. The sweep interval is tunable precisely so the
 * `hold-expiry` benchmark can measure how accurately the slot is released
 * relative to the TTL, under scheduler jitter.
 */
@Injectable()
export class HoldSweeperService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(HoldSweeperService.name);
  private readonly intervalMs: number;
  private timer?: NodeJS.Timeout;
  private sweeping = false;

  constructor(
    private readonly scheduling: SchedulingService,
    private readonly metrics: MetricsService,
    config: ConfigService<AppConfig, true>,
  ) {
    this.intervalMs = config.get('bookingHoldSweepIntervalMs', { infer: true });
  }

  onModuleInit(): void {
    this.timer = setInterval(() => void this.sweep(), this.intervalMs);
    this.timer.unref?.();
    this.logger.log(`Hold sweeper started (every ${this.intervalMs}ms)`);
  }

  onModuleDestroy(): void {
    if (this.timer) clearInterval(this.timer);
  }

  async sweep(): Promise<number> {
    if (this.sweeping) return 0;
    this.sweeping = true;
    try {
      const expired = await this.scheduling.expireStaleHolds();
      if (expired > 0) {
        this.metrics.holdsExpired.inc(expired);
        this.logger.debug(`expired ${expired} hold(s)`);
      }
      return expired;
    } catch (err) {
      this.logger.error(`Hold sweep failed: ${(err as Error).message}`);
      return 0;
    } finally {
      this.sweeping = false;
    }
  }
}
