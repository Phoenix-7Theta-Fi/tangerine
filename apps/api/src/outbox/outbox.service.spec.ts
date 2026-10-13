import { OutboxService, POST_CREATED } from './outbox.service';

describe('OutboxService', () => {
  function build() {
    const rows = [
      { id: 'evt-1', type: POST_CREATED, payload: { postId: 'p1' } },
      { id: 'evt-2', type: POST_CREATED, payload: { postId: 'p2' } },
    ];
    const tx = {
      $queryRaw: jest.fn().mockResolvedValue(rows),
      outboxEvent: { update: jest.fn().mockResolvedValue({}) },
    };
    const prisma: any = {
      $transaction: jest.fn(async (cb: (t: unknown) => unknown) => cb(tx)),
      outboxEvent: { create: jest.fn().mockResolvedValue({}) },
    };
    const queue: any = { add: jest.fn().mockResolvedValue({}) };
    const config: any = {
      get: jest.fn((key: string) =>
        key === 'outboxRelayIntervalMs' ? 500 : 200,
      ),
    };
    return { service: new OutboxService(prisma, queue, config), prisma, queue, tx };
  }

  it('emits an event through the caller transaction', async () => {
    const { service, prisma, tx } = build();
    const fakeTx = { outboxEvent: { create: jest.fn() } } as any;
    await service.emit(fakeTx, POST_CREATED, { postId: 'p1' } as any);
    expect(fakeTx.outboxEvent.create).toHaveBeenCalledWith({
      data: { type: POST_CREATED, payload: { postId: 'p1' } },
    });
    expect(prisma.outboxEvent.create).not.toHaveBeenCalled();
    expect(tx.outboxEvent.update).not.toHaveBeenCalled();
  });

  it('relays pending rows with a per-event jobId for dedupe', async () => {
    const { service, queue, tx } = build();
    const count = await service.relayOnce();

    expect(count).toBe(2);
    expect(queue.add).toHaveBeenCalledTimes(2);
    expect(queue.add).toHaveBeenCalledWith(
      POST_CREATED,
      { eventId: 'evt-1', payload: { postId: 'p1' } },
      expect.objectContaining({
        jobId: 'evt-1',
        attempts: 5,
        backoff: { type: 'exponential', delay: 1000 },
      }),
    );
    expect(tx.outboxEvent.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'evt-1' },
        data: expect.objectContaining({ status: 'RELAYED' }),
      }),
    );
  });

  it('does not overlap relay runs', async () => {
    const { service, queue } = build();
    const [a] = await Promise.all([service.relayOnce(), service.relayOnce()]);
    // The second concurrent call is rejected by the re-entrancy guard.
    expect(queue.add).toHaveBeenCalledTimes(2);
    expect(a).toBe(2);
  });
});
