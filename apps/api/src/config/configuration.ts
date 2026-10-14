export interface AppConfig {
  nodeEnv: string;
  port: number;
  databaseUrl: string;
  redisUrl: string;
  /** Authors with >= this many followers skip write-time fan-out (pull at read). */
  celebrityFollowerThreshold: number;
  /** Max post ids retained per user's materialized home timeline. */
  timelineMaxLength: number;
  /** How often the outbox relay polls for pending events, in ms. */
  outboxRelayIntervalMs: number;
  /** Max outbox events relayed per poll tick. */
  outboxRelayBatchSize: number;
  /** Default TTL for a soft booking hold, in seconds. */
  bookingHoldTtlSeconds: number;
  /** How often the hold sweeper releases expired holds, in ms. */
  bookingHoldSweepIntervalMs: number;
  /** Notice (hours) inside which a cancellation is flagged as late. */
  bookingCancelNoticeHours: number;
}

export default (): AppConfig => ({
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: parseInt(process.env.PORT ?? '3001', 10),
  databaseUrl: process.env.DATABASE_URL ?? '',
  redisUrl: process.env.REDIS_URL ?? 'redis://localhost:6379',
  celebrityFollowerThreshold: parseInt(
    process.env.CELEBRITY_FOLLOWER_THRESHOLD ?? '10000',
    10,
  ),
  timelineMaxLength: parseInt(process.env.TIMELINE_MAX_LENGTH ?? '800', 10),
  outboxRelayIntervalMs: parseInt(
    process.env.OUTBOX_RELAY_INTERVAL_MS ?? '500',
    10,
  ),
  outboxRelayBatchSize: parseInt(process.env.OUTBOX_RELAY_BATCH_SIZE ?? '200', 10),
  bookingHoldTtlSeconds: parseInt(process.env.BOOKING_HOLD_TTL_SECONDS ?? '120', 10),
  bookingHoldSweepIntervalMs: parseInt(
    process.env.BOOKING_HOLD_SWEEP_INTERVAL_MS ?? '1000',
    10,
  ),
  bookingCancelNoticeHours: parseInt(
    process.env.BOOKING_CANCEL_NOTICE_HOURS ?? '24',
    10,
  ),
});
