import type { ConnectionOptions } from 'bullmq';

/**
 * BullMQ manages its own Redis connections. It needs `maxRetriesPerRequest:
 * null` (its blocking commands must not time out) and explicit host/port rather
 * than a url string.
 */
export function bullConnectionFromUrl(url: string): ConnectionOptions {
  const parsed = new URL(url);
  const db =
    parsed.pathname && parsed.pathname.length > 1
      ? Number(parsed.pathname.slice(1))
      : undefined;
  return {
    host: parsed.hostname,
    port: Number(parsed.port || 6379),
    username: parsed.username || undefined,
    password: parsed.password || undefined,
    db,
    maxRetriesPerRequest: null,
  };
}
