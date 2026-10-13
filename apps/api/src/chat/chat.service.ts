import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConversationType, Message, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { RealtimeService } from '../realtime/realtime.service';

const USER_MINI = {
  id: true,
  handle: true,
  displayName: true,
  avatarUrl: true,
  role: true,
} satisfies Prisma.UserSelect;

export interface MessageDto {
  id: string;
  conversationId: string;
  senderId: string;
  body: string;
  seq: number;
  type: string;
  createdAt: Date;
  clientMsgId: string;
}

export interface ConversationSummaryDto {
  id: string;
  type: ConversationType;
  title: string | null;
  lastMessageAt: Date | null;
  unreadCount: number;
  members: { id: string; handle: string; displayName: string; avatarUrl: string | null }[];
  lastMessage: { body: string; senderId: string; createdAt: Date } | null;
}

@Injectable()
export class ChatService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly realtime: RealtimeService,
  ) {}

  async listConversations(userId: string): Promise<ConversationSummaryDto[]> {
    const memberships = await this.prisma.conversationMember.findMany({
      where: { userId },
      include: {
        conversation: {
          include: {
            members: { include: { user: { select: USER_MINI } } },
            messages: {
              orderBy: { seq: 'desc' },
              take: 1,
            },
          },
        },
      },
    });

    const summaries = await Promise.all(
      memberships.map(async (m) => {
        const conv = m.conversation;
        const last = conv.messages[0] ?? null;
        const unreadCount = await this.prisma.message.count({
          where: {
            conversationId: conv.id,
            seq: { gt: m.lastReadSeq },
            senderId: { not: userId },
          },
        });
        const others = conv.members.filter((x) => x.userId !== userId);
        const title =
          conv.type === ConversationType.GROUP
            ? conv.title
            : others.map((o) => o.user.displayName).join(', ');
        return {
          id: conv.id,
          type: conv.type,
          title,
          lastMessageAt: conv.lastMessageAt,
          unreadCount,
          members: conv.members.map((x) => x.user),
          lastMessage: last
            ? { body: last.body, senderId: last.senderId, createdAt: last.createdAt }
            : null,
        } satisfies ConversationSummaryDto;
      }),
    );

    return summaries.sort((a, b) => {
      const at = a.lastMessageAt?.getTime() ?? 0;
      const bt = b.lastMessageAt?.getTime() ?? 0;
      return bt - at;
    });
  }

  async getOrCreateDirect(userId: string, otherUserId: string) {
    if (userId === otherUserId) {
      throw new ForbiddenException('Cannot start a conversation with yourself');
    }
    const other = await this.prisma.user.findUnique({
      where: { id: otherUserId },
      select: { id: true },
    });
    if (!other) throw new NotFoundException('User not found');

    const existing = await this.prisma.conversation.findFirst({
      where: {
        type: ConversationType.DIRECT,
        AND: [
          { members: { some: { userId } } },
          { members: { some: { userId: otherUserId } } },
        ],
      },
      include: { members: true },
    });
    // Guard against a group/duplicate match: a DIRECT chat must have 2 members.
    if (existing && existing.members.length === 2) {
      return this.getConversation(existing.id, userId);
    }

    const created = await this.prisma.conversation.create({
      data: {
        type: ConversationType.DIRECT,
        members: {
          create: [
            { userId, lastReadSeq: 0 },
            { userId: otherUserId, lastReadSeq: 0 },
          ],
        },
      },
    });
    return this.getConversation(created.id, userId);
  }

  async getConversation(conversationId: string, userId: string) {
    await this.assertMember(conversationId, userId);
    const conv = await this.prisma.conversation.findUniqueOrThrow({
      where: { id: conversationId },
      include: { members: { include: { user: { select: USER_MINI } } } },
    });
    return {
      id: conv.id,
      type: conv.type,
      title:
        conv.type === ConversationType.GROUP
          ? conv.title
          : conv.members
              .filter((m) => m.userId !== userId)
              .map((m) => m.user.displayName)
              .join(', '),
      members: conv.members.map((m) => m.user),
    };
  }

  async listMessages(params: {
    userId: string;
    conversationId: string;
    cursorSeq?: number;
    limit: number;
  }) {
    const { userId, conversationId, cursorSeq, limit } = params;
    await this.assertMember(conversationId, userId);

    const rows = await this.prisma.message.findMany({
      where: {
        conversationId,
        ...(cursorSeq ? { seq: { lt: cursorSeq } } : {}),
      },
      orderBy: { seq: 'desc' },
      take: limit + 1,
    });

    const hasMore = rows.length > limit;
    const page = hasMore ? rows.slice(0, limit) : rows;
    // Return ascending for rendering; cursor is the oldest seq in the page.
    const items = page.map(toMessageDto).reverse();
    return {
      items,
      nextCursor: hasMore ? String(page[page.length - 1].seq) : null,
    };
  }

  /**
   * Idempotent send. `clientMsgId` is the client's retry key: a duplicate send
   * returns the original message instead of creating a second one. The sequence
   * number comes from an atomic increment on the conversation row, so ordering
   * is decided by the server, never by client clocks.
   */
  async sendMessage(params: {
    conversationId: string;
    senderId: string;
    body: string;
    clientMsgId: string;
  }): Promise<{ message: MessageDto; deduped: boolean }> {
    const { conversationId, senderId, body, clientMsgId } = params;
    await this.assertMember(conversationId, senderId);

    const existing = await this.prisma.message.findUnique({
      where: { senderId_clientMsgId: { senderId, clientMsgId } },
    });
    if (existing) {
      return { message: toMessageDto(existing), deduped: true };
    }

    let message: Message;
    try {
      message = await this.prisma.$transaction(async (tx) => {
        const conv = await tx.conversation.update({
          where: { id: conversationId },
          data: { lastSeq: { increment: 1 }, lastMessageAt: new Date() },
          select: { lastSeq: true },
        });
        return tx.message.create({
          data: {
            conversationId,
            senderId,
            body,
            seq: conv.lastSeq,
            clientMsgId,
          },
        });
      });
    } catch (err) {
      // Lost a race on the idempotency key — return the winner's row.
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === 'P2002'
      ) {
        const winner = await this.prisma.message.findUniqueOrThrow({
          where: { senderId_clientMsgId: { senderId, clientMsgId } },
        });
        return { message: toMessageDto(winner), deduped: true };
      }
      throw err;
    }

    const dto = toMessageDto(message);
    this.realtime.emitToConversation(conversationId, 'message:new', dto);
    return { message: dto, deduped: false };
  }

  /** Advance a member's read cursor to `seq` (never backwards). */
  async markRead(params: {
    userId: string;
    conversationId: string;
    seq: number;
  }): Promise<{ conversationId: string; userId: string; seq: number }> {
    const { userId, conversationId, seq } = params;
    await this.assertMember(conversationId, userId);

    await this.prisma.$executeRaw`
      UPDATE "ConversationMember"
      SET "lastReadSeq" = GREATEST("lastReadSeq", ${seq})
      WHERE "conversationId" = ${conversationId} AND "userId" = ${userId}
    `;

    const event = { conversationId, userId, seq };
    this.realtime.emitToConversation(conversationId, 'read:update', event);
    return event;
  }

  async assertMember(conversationId: string, userId: string): Promise<void> {
    const member = await this.prisma.conversationMember.findUnique({
      where: { conversationId_userId: { conversationId, userId } },
      select: { id: true },
    });
    if (!member) {
      throw new ForbiddenException('You are not a member of this conversation');
    }
  }

  async conversationIdsFor(userId: string): Promise<string[]> {
    const rows = await this.prisma.conversationMember.findMany({
      where: { userId },
      select: { conversationId: true },
    });
    return rows.map((r) => r.conversationId);
  }

  /** Peer user ids for a conversation, excluding `userId`. */
  async peerUserIds(conversationId: string, userId: string): Promise<string[]> {
    const rows = await this.prisma.conversationMember.findMany({
      where: { conversationId, userId: { not: userId } },
      select: { userId: true },
    });
    return rows.map((r) => r.userId);
  }
}

function toMessageDto(m: Message): MessageDto {
  return {
    id: m.id,
    conversationId: m.conversationId,
    senderId: m.senderId,
    body: m.body,
    seq: m.seq,
    type: m.type,
    createdAt: m.createdAt,
    clientMsgId: m.clientMsgId,
  };
}
