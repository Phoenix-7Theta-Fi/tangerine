import { FanoutProcessor } from './fanout.processor';
import { POST_CREATED } from '../outbox/outbox.service';

function job(overrides: Record<string, unknown> = {}) {
  return {
    name: POST_CREATED,
    data: {
      eventId: 'evt-1',
      payload: {
        postId: 'p1',
        authorId: 'a1',
        createdAt: new Date().toISOString(),
        authorIsCelebrity: false,
      },
    },
    opts: { attempts: 5 },
    attemptsMade: 1,
    ...overrides,
  } as any;
}

describe('FanoutProcessor', () => {
  function build() {
    const timeline: any = {
      fanoutPost: jest.fn().mockResolvedValue({ pushed: 3, celebrity: false }),
    };
    const prisma: any = {
      outboxEvent: { update: jest.fn().mockResolvedValue({}) },
    };
    return { processor: new FanoutProcessor(prisma, timeline), prisma, timeline };
  }

  it('fans out the post and marks the event PROCESSED', async () => {
    const { processor, prisma, timeline } = build();
    await processor.process(job());

    expect(timeline.fanoutPost).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'p1', authorId: 'a1', authorIsCelebrity: false }),
    );
    expect(prisma.outboxEvent.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'evt-1' },
        data: expect.objectContaining({ status: 'PROCESSED' }),
      }),
    );
  });

  it('keeps retrying while attempts remain', async () => {
    const { processor, prisma } = build();
    await processor.onFailed(job({ attemptsMade: 2 }), new Error('boom'));
    expect(prisma.outboxEvent.update).not.toHaveBeenCalled();
  });

  it('marks the event FAILED after the final attempt (dead-letter)', async () => {
    const { processor, prisma } = build();
    await processor.onFailed(job({ attemptsMade: 5 }), new Error('boom'));
    expect(prisma.outboxEvent.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'evt-1' },
        data: expect.objectContaining({ status: 'FAILED', lastError: 'boom' }),
      }),
    );
  });
});
