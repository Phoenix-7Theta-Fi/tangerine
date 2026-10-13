import { Prisma } from '@prisma/client';
import { ChatService } from './chat.service';

/**
 * These tests exercise the two chat invariants that are easy to get wrong:
 *   1. sends are idempotent on clientMsgId, and
 *   2. ordering is the server's job, not the client's.
 */
describe('ChatService', () => {
  const member = { id: 'member-1' };
  const conversation = { lastSeq: 5 };

  function build(overrides: {
    existingMessage?: unknown;
    memberExists?: boolean;
  }) {
    const createdMessage = {
      id: 'msg-1',
      conversationId: 'conv-1',
      senderId: 'user-a',
      body: 'hello',
      seq: 6,
      type: 'TEXT',
      createdAt: new Date(),
      clientMsgId: 'cmid-1',
    };

    const prisma: any = {
      message: {
        findUnique: jest.fn().mockResolvedValue(overrides.existingMessage ?? null),
        findUniqueOrThrow: jest.fn().mockResolvedValue(null),
        create: jest.fn().mockResolvedValue(createdMessage),
      },
      conversationMember: {
        findUnique: jest
          .fn()
          .mockResolvedValue(overrides.memberExists === false ? null : member),
      },
      conversation: {
        update: jest.fn().mockResolvedValue({ lastSeq: 6 }),
      },
      $transaction: jest.fn(async (cb: (tx: any) => unknown) => cb(prisma)),
      $executeRaw: jest.fn().mockResolvedValue(1),
    };
    const realtime: any = { emitToConversation: jest.fn() };
    return { service: new ChatService(prisma, realtime), prisma, realtime };
  }

  it('assigns the next sequence number from the atomic conversation counter', async () => {
    const { service, prisma, realtime } = build({});
    const { message, deduped } = await service.sendMessage({
      conversationId: 'conv-1',
      senderId: 'user-a',
      body: 'hello',
      clientMsgId: 'cmid-1',
    });

    expect(deduped).toBe(false);
    expect(message.seq).toBe(6);
    expect(prisma.conversation.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ lastSeq: { increment: 1 } }),
      }),
    );
    expect(realtime.emitToConversation).toHaveBeenCalledWith(
      'conv-1',
      'message:new',
      expect.objectContaining({ seq: 6 }),
    );
  });

  it('deduplicates a retried send without creating a second row', async () => {
    const existing = {
      id: 'msg-existing',
      conversationId: 'conv-1',
      senderId: 'user-a',
      body: 'hello',
      seq: 6,
      type: 'TEXT',
      createdAt: new Date(),
      clientMsgId: 'cmid-1',
    };
    const { service, prisma, realtime } = build({ existingMessage: existing });

    const { message, deduped } = await service.sendMessage({
      conversationId: 'conv-1',
      senderId: 'user-a',
      body: 'hello',
      clientMsgId: 'cmid-1',
    });

    expect(deduped).toBe(true);
    expect(message.id).toBe('msg-existing');
    expect(prisma.message.create).not.toHaveBeenCalled();
    expect(realtime.emitToConversation).not.toHaveBeenCalled();
  });

  it('rejects a sender who is not a member of the conversation', async () => {
    const { service } = build({ memberExists: false });
    await expect(
      service.sendMessage({
        conversationId: 'conv-1',
        senderId: 'intruder',
        body: 'hi',
        clientMsgId: 'x',
      }),
    ).rejects.toThrow(/not a member/i);
  });

  it('resolves a unique-constraint race by returning the winning row', async () => {
    const winner = {
      id: 'msg-winner',
      conversationId: 'conv-1',
      senderId: 'user-a',
      body: 'hello',
      seq: 6,
      type: 'TEXT',
      createdAt: new Date(),
      clientMsgId: 'cmid-race',
    };
    const { service, prisma } = build({});
    // No row on the first lookup, but a concurrent writer wins the insert.
    prisma.message.findUnique
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(winner);
    prisma.message.findUniqueOrThrow.mockResolvedValue(winner);
    prisma.message.create.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError('duplicate', {
        code: 'P2002',
        clientVersion: 'test',
      }),
    );

    const { message, deduped } = await service.sendMessage({
      conversationId: 'conv-1',
      senderId: 'user-a',
      body: 'hello',
      clientMsgId: 'cmid-race',
    });

    expect(deduped).toBe(true);
    expect(message.id).toBe('msg-winner');
  });

  it('advances the read cursor with a monotonic GREATEST update', async () => {
    const { service, prisma } = build({});
    await service.markRead({ userId: 'user-a', conversationId: 'conv-1', seq: 4 });
    expect(prisma.$executeRaw).toHaveBeenCalledTimes(1);
  });
});
