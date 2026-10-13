import { Injectable } from '@nestjs/common';
import type { Server } from 'socket.io';
import { RedisService } from '../redis/redis.service';

const PRESENCE_TTL_SECONDS = 60;

/**
 * Holds the Socket.IO server reference so that both the gateway and ordinary
 * services (e.g. ChatService, called from a REST handler) can push events
 * without a circular dependency on the gateway.
 *
 * Presence is heartbeat-based: a Redis key with a TTL, refreshed on each
 * heartbeat. A dropped connection simply lets the key expire — no explicit
 * disconnect bookkeeping required, which is what makes presence robust to
 * crashes and network partitions.
 */
@Injectable()
export class RealtimeService {
  private server: Server | null = null;

  constructor(private readonly redis: RedisService) {}

  setServer(server: Server): void {
    this.server = server;
  }

  emitToConversation(conversationId: string, event: string, payload: unknown): void {
    this.server?.to(`conversation:${conversationId}`).emit(event, payload);
  }

  emitToUser(userId: string, event: string, payload: unknown): void {
    this.server?.to(`user:${userId}`).emit(event, payload);
  }

  emitToUsers(userIds: string[], event: string, payload: unknown): void {
    if (userIds.length === 0) return;
    this.server?.to(userIds.map((id) => `user:${id}`)).emit(event, payload);
  }

  async markOnline(userId: string): Promise<void> {
    await this.redis.client.set(`presence:${userId}`, '1', 'EX', PRESENCE_TTL_SECONDS);
  }

  async markOffline(userId: string): Promise<void> {
    await this.redis.client.del(`presence:${userId}`);
  }

  async isOnline(userId: string): Promise<boolean> {
    return (await this.redis.client.exists(`presence:${userId}`)) === 1;
  }
}
