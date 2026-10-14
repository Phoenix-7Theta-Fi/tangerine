import { ConflictException } from '@nestjs/common';
import { SchedulingService, isExclusionViolation } from './scheduling.service';

/** A metrics double: every counter is a no-op spy. */
function metricsDouble() {
  const counter = () => ({ inc: jest.fn() });
  return {
    bookingsCreated: counter(),
    holdsCreated: counter(),
    bookingConflicts: counter(),
    idempotentReplays: counter(),
  };
}

function configDouble() {
  const values: Record<string, number> = {
    bookingHoldTtlSeconds: 120,
    bookingCancelNoticeHours: 24,
  };
  return { get: jest.fn((key: string) => values[key]) };
}

const SESSION_TYPE = {
  id: 'st-1',
  practitionerId: 'prac-1',
  name: 'Initial consult',
  durationMinutes: 60,
  priceCents: 18000,
  currency: 'USD',
  active: true,
};

const AVAILABILITY = {
  practitionerId: 'prac-1',
  // 24h window on every weekday, so any timestamp is "within availability".
  weekday: -1,
  startMinute: 0,
  endMinute: 1440,
  timezone: 'UTC',
};

function build(overrides: Partial<Record<string, unknown>> = {}) {
  const availability = Array.from({ length: 7 }, (_, weekday) => ({
    ...AVAILABILITY,
    weekday,
  }));
  const bookingCreate = jest.fn();
  const tx = {
    $queryRaw: jest.fn().mockResolvedValue([]),
    booking: { create: bookingCreate, update: jest.fn(), updateMany: jest.fn() },
    outboxEvent: { create: jest.fn() },
  };
  const prisma: any = {
    $transaction: jest.fn(async (cb: (t: unknown) => unknown) => cb(tx)),
    sessionType: {
      findUnique: jest.fn().mockResolvedValue(SESSION_TYPE),
      findFirst: jest.fn().mockResolvedValue(SESSION_TYPE),
    },
    practitionerAvailability: {
      findMany: jest.fn().mockResolvedValue(availability),
    },
    bookingOperation: {
      findUnique: jest.fn().mockResolvedValue(null),
      create: jest.fn().mockResolvedValue({}),
      update: jest.fn().mockResolvedValue({}),
      delete: jest.fn().mockResolvedValue({}),
    },
    booking: {
      create: bookingCreate,
      updateMany: jest.fn().mockResolvedValue({ count: 0 }),
    },
    ...overrides,
  };
  const outbox = { emit: jest.fn().mockResolvedValue(undefined) };
  const metrics = metricsDouble();
  const service = new SchedulingService(
    prisma,
    outbox as any,
    metrics as any,
    configDouble() as any,
  );
  return { service, prisma, outbox, metrics, tx };
}

describe('SchedulingService', () => {
  describe('isExclusionViolation', () => {
    it('detects the Postgres exclusion SQLSTATE', () => {
      expect(isExclusionViolation({ meta: { code: '23P01' }, message: '' })).toBe(
        true,
      );
    });
    it('detects the named constraint in a message', () => {
      expect(
        isExclusionViolation({
          message: 'conflicting key value violates exclusion constraint "Booking_no_overlap_per_practitioner"',
        }),
      ).toBe(true);
    });
    it('ignores unrelated errors', () => {
      expect(isExclusionViolation(new Error('nope'))).toBe(false);
    });
  });

  it('maps a lost booking race to a 409 and records the conflict', async () => {
    const { service, prisma, metrics } = build();
    prisma.booking.create.mockRejectedValue({
      meta: { code: '23P01' },
      message: 'conflicting key value violates exclusion constraint',
    });

    await expect(
      service.createHold('member-1', {
        sessionTypeId: 'st-1',
        startTime: '2026-10-14T10:00:00.000Z',
        clientOpId: 'op-conflict',
      }),
    ).rejects.toBeInstanceOf(ConflictException);

    expect(metrics.bookingConflicts.inc).toHaveBeenCalledTimes(1);
    expect(metrics.holdsCreated.inc).not.toHaveBeenCalled();
  });

  it('replays a stored result for a duplicate op id without repeating the write', async () => {
    const stored = { id: 'hold-1', status: 'HELD' };
    const { service, prisma, metrics } = build();
    // First call: no op yet. Second call: the op and its response already exist.
    prisma.bookingOperation.findUnique
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({ response: stored });
    prisma.booking.create.mockResolvedValue({
      ...stored,
      practitionerId: 'prac-1',
      memberId: 'member-1',
      sessionTypeId: 'st-1',
      startTime: new Date(),
      endTime: new Date(),
      sessionType: SESSION_TYPE,
      practitioner: {},
      member: {},
    });

    await service.createHold('member-1', {
      sessionTypeId: 'st-1',
      startTime: '2026-10-14T10:00:00.000Z',
      clientOpId: 'op-1',
    });
    const replay = await service.createHold('member-1', {
      sessionTypeId: 'st-1',
      startTime: '2026-10-14T10:00:00.000Z',
      clientOpId: 'op-1',
    });

    expect(replay).toEqual(stored);
    expect(prisma.booking.create).toHaveBeenCalledTimes(1);
    expect(metrics.idempotentReplays.inc).toHaveBeenCalledTimes(1);
  });

  it('expires only holds past their TTL', async () => {
    const { service, prisma } = build();
    prisma.booking.updateMany.mockResolvedValue({ count: 3 });
    const n = await service.expireStaleHolds();
    expect(n).toBe(3);
    const arg = prisma.booking.updateMany.mock.calls[0][0];
    expect(arg.where).toMatchObject({ status: 'HELD' });
    expect(arg.data.status).toBe('CANCELLED');
  });
});
