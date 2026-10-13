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
});
