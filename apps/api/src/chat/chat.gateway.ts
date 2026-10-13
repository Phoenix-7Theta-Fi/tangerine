import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { createAdapter } from '@socket.io/redis-adapter';
import type { Server, Socket } from 'socket.io';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';
import { ChatService } from './chat.service';
import { RealtimeService } from '../realtime/realtime.service';
import { RedisService } from '../redis/redis.service';
import type { AppConfig } from '../config/configuration';

interface SendPayload {
  conversationId: string;
  body: string;
  clientMsgId?: string;
}

@WebSocketGateway({
  cors: { origin: true, credentials: true },
  transports: ['websocket', 'polling'],
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(ChatGateway.name);

  @WebSocketServer()
  server!: Server;

  constructor(
    private readonly chat: ChatService,
    private readonly realtime: RealtimeService,
    private readonly redis: RedisService,
    private readonly config: ConfigService<AppConfig, true>,
  ) {}

  afterInit(server: Server): void {
    this.realtime.setServer(server);

    // Horizontal scale-out: the Socket.IO Redis adapter lets any API instance
    // deliver an event to a socket held by another instance. Adapter clients
    // must be dedicated connections (a subscribed client can't run commands).
    const url = this.config.get('redisUrl', { infer: true });
    const pubClient = new Redis(url);
    const subClient = pubClient.duplicate();
    server.adapter(createAdapter(pubClient, subClient));
    this.logger.log('Chat gateway initialised with Redis adapter');
  }

  async handleConnection(socket: Socket): Promise<void> {
    const userId =
      (socket.handshake.auth?.userId as string | undefined) ??
      (socket.handshake.query?.userId as string | undefined);

    if (!userId) {
      socket.emit('error', { message: 'Missing userId in handshake auth' });
      socket.disconnect(true);
      return;
    }

    socket.data.userId = userId;
    await socket.join(`user:${userId}`);

    const conversationIds = await this.chat.conversationIdsFor(userId);
    await Promise.all(
      conversationIds.map((id) => socket.join(`conversation:${id}`)),
    );

    await this.realtime.markOnline(userId);
    // Broadcast presence. In production this is scoped to users who share a
    // conversation and throttled; a small demo can afford a global emit.
    socket.broadcast.emit('presence:update', { userId, online: true });
    this.logger.debug(`connected user=${userId} socket=${socket.id}`);
  }

  async handleDisconnect(socket: Socket): Promise<void> {
    const userId = socket.data.userId as string | undefined;
    if (!userId) return;
    await this.realtime.markOffline(userId);
    socket.broadcast.emit('presence:update', { userId, online: false });
    this.logger.debug(`disconnected user=${userId} socket=${socket.id}`);
  }

  @SubscribeMessage('conversation:join')
  async onJoinConversation(
    @ConnectedSocket() socket: Socket,
    @MessageBody() payload: { conversationId: string },
  ) {
    const userId = socket.data.userId as string;
    await this.chat.assertMember(payload.conversationId, userId);
    await socket.join(`conversation:${payload.conversationId}`);
    return { joined: payload.conversationId };
  }

  @SubscribeMessage('message:send')
  async onSend(
    @ConnectedSocket() socket: Socket,
    @MessageBody() payload: SendPayload,
  ) {
    const userId = socket.data.userId as string;
    const { message, deduped } = await this.chat.sendMessage({
      conversationId: payload.conversationId,
      senderId: userId,
      body: payload.body,
      clientMsgId: payload.clientMsgId ?? `${userId}-${Date.now()}`,
    });
    return { message, deduped };
  }

  @SubscribeMessage('message:read')
  async onRead(
    @ConnectedSocket() socket: Socket,
    @MessageBody() payload: { conversationId: string; seq: number },
  ) {
    const userId = socket.data.userId as string;
    return this.chat.markRead({
      userId,
      conversationId: payload.conversationId,
      seq: payload.seq,
    });
  }

  @SubscribeMessage('typing')
  onTyping(
    @ConnectedSocket() socket: Socket,
    @MessageBody() payload: { conversationId: string },
  ) {
    socket.to(`conversation:${payload.conversationId}`).emit('typing:update', {
      conversationId: payload.conversationId,
      userId: socket.data.userId,
    });
  }

  @SubscribeMessage('presence:heartbeat')
  async onHeartbeat(@ConnectedSocket() socket: Socket) {
    const userId = socket.data.userId as string;
    await this.realtime.markOnline(userId);
    return { ok: true, userId };
  }
}
