import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { MetricsService } from '../metrics/metrics.service';
import {
  BOOKING_CANCELLED,
  BOOKING_CONFIRMED,
  OutboxService,
} from '../outbox/outbox.service';
import type { AppConfig } from '../config/configuration';
import {
  addDays,
  dayOffsetIfStable,
  dayOrdinal,
  partsInZone,
  utcFromLocal,
  zonedTimeToUtc,
} from './timezone';
import type {
  CancelBookingDto,
  CreateBookingDto,
  CreateHoldDto,
  CreateSessionTypeDto,
  OpenSlotsQueryDto,
  RescheduleBookingDto,
  SetAvailabilityDto,
} from './dto/scheduling.dto';

const BOOKING_INCLUDE = {
  sessionType: {
    select: {
      id: true,
      name: true,
      durationMinutes: true,
      priceCents: true,
      currency: true,
    },
  },
  practitioner: {
    select: { id: true, handle: true, displayName: true, avatarUrl: true, role: true },
  },
  member: {
    select: { id: true, handle: true, displayName: true, avatarUrl: true },
  },
} satisfies Prisma.BookingInclude;

type BookingRow = Prisma.BookingGetPayload<{ include: typeof BOOKING_INCLUDE }>;

/** Statuses that own a slot and therefore participate in the exclusion index. */
const ACTIVE_STATUSES = ['HELD', 'PENDING', 'CONFIRMED'] as const;

export function isExclusionViolation(err: unknown): boolean {
  const e = err as { code?: string; meta?: { code?: string }; message?: string };
  const pgCode = e?.meta?.code ?? e?.code;
  const message = String(e?.message ?? '');
  return (
    pgCode === '23P01' ||
    message.includes('Booking_no_overlap_per_practitioner') ||
    message.includes('conflicting key value violates exclusion constraint')
  );
}

function isUniqueViolation(err: unknown): boolean {
  return (
    err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002'
  );
}

/**
 * Errors that are safe to retry for a single-row write: Postgres detected a
 * deadlock or serialization failure, or Prisma's interactive-transaction budget
 * elapsed while the row was waiting on a lock. A lost slot race (23P01) is
 * deliberately NOT retryable — it is a definitive 409.
 */
export function isRetryableWriteError(err: unknown): boolean {
  if (isExclusionViolation(err)) return false;
  const e = err as {
    code?: string;
    meta?: { code?: string };
    message?: string;
  };
  const pgCode = e?.meta?.code ?? e?.code;
  if (pgCode === '40P01' || pgCode === '40001') return true; // deadlock / serialization
  if (pgCode === 'P2028' || pgCode === 'P2034') return true; // tx expired / write conflict
  const message = String(e?.message ?? '');
  return (
    message.includes('deadlock detected') ||
    message.includes('Transaction already closed') ||
    message.includes('Transaction not found')
  );
}

/** Budget for the tiny insert+outbox transactions on the booking path. */
const WRITE_TX_OPTIONS = { timeout: 15_000, maxWait: 15_000 } as const;


@Injectable()
export class SchedulingService {
  private readonly logger = new Logger(SchedulingService.name);
  private readonly holdTtlSeconds: number;
  private readonly cancelNoticeHours: number;
  /** Timestamp of the last hold-expiry sweep triggered from the hot path. */
  private lastHoldExpiryAt = 0;

  constructor(
    private readonly prisma: PrismaService,
    private readonly outbox: OutboxService,
    private readonly metrics: MetricsService,
    config: ConfigService<AppConfig, true>,
  ) {
    this.holdTtlSeconds = config.get('bookingHoldTtlSeconds', { infer: true });
    this.cancelNoticeHours = config.get('bookingCancelNoticeHours', {
      infer: true,
    });
  }

  // ──────────────────────────────────────────────────────────────────────
  // Session type catalog
  // ──────────────────────────────────────────────────────────────────────

  async createSessionType(practitionerId: string, dto: CreateSessionTypeDto) {
    try {
      return await this.prisma.sessionType.create({
        data: {
          practitionerId,
          name: dto.name,
          description: dto.description,
          durationMinutes: dto.durationMinutes,
          priceCents: dto.priceCents,
          currency: dto.currency ?? 'USD',
        },
      });
    } catch (err) {
      if (isUniqueViolation(err)) {
        throw new ConflictException(
          `Session type "${dto.name}" already exists for this practitioner`,
        );
      }
      throw err;
    }
  }

  listSessionTypes(practitionerId?: string) {
    return this.prisma.sessionType.findMany({
      where: { active: true, ...(practitionerId ? { practitionerId } : {}) },
      orderBy: { createdAt: 'asc' },
    });
  }

  // ──────────────────────────────────────────────────────────────────────
  // Recurring availability
  // ──────────────────────────────────────────────────────────────────────

  async setAvailability(practitionerId: string, dto: SetAvailabilityDto) {
    for (const slot of dto.slots) {
      if (slot.startMinute >= slot.endMinute) {
        throw new BadRequestException(
          `Availability window ${slot.weekday}: startMinute must be < endMinute`,
        );
      }
      try {
        // Validate the IANA zone eagerly so a bad zone fails the request, not
        // the slot lookup that happens later.
        new Intl.DateTimeFormat('en-US', { timeZone: slot.timezone ?? 'UTC' });
      } catch {
        throw new BadRequestException(`Unknown timezone "${slot.timezone}"`);
      }
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.practitionerAvailability.deleteMany({ where: { practitionerId } });
      if (dto.slots.length) {
        await tx.practitionerAvailability.createMany({
          data: dto.slots.map((s) => ({
            practitionerId,
            weekday: s.weekday,
            startMinute: s.startMinute,
            endMinute: s.endMinute,
            timezone: s.timezone ?? 'UTC',
          })),
        });
      }
    });

    return this.prisma.practitionerAvailability.findMany({
      where: { practitionerId },
      orderBy: [{ weekday: 'asc' }, { startMinute: 'asc' }],
    });
  }

  getAvailability(practitionerId: string) {
    return this.prisma.practitionerAvailability.findMany({
      where: { practitionerId },
      orderBy: [{ weekday: 'asc' }, { startMinute: 'asc' }],
    });
  }

  // ──────────────────────────────────────────────────────────────────────
  // Slot lookup: availability − live reservations
  // ──────────────────────────────────────────────────────────────────────

  async listOpenSlots(params: {
    practitionerId: string;
    query: OpenSlotsQueryDto;
  }): Promise<{
    slots: { startTime: string; endTime: string }[];
    totalOpen: number;
    practitionerId: string;
    scannedDays: number;
    conflictsConsidered: number;
  }> {
    const { practitionerId, query } = params;
    const from = new Date(query.from);
    const to = new Date(query.to);
    if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) {
      throw new BadRequestException('from/to must be valid ISO-8601 timestamps');
    }
    if (to <= from) throw new BadRequestException('to must be after from');

    const sessionType = query.sessionTypeId
      ? await this.prisma.sessionType.findUnique({
          where: { id: query.sessionTypeId },
        })
      : await this.prisma.sessionType.findFirst({
          where: { practitionerId, active: true },
          orderBy: { createdAt: 'asc' },
        });
    if (!sessionType) throw new NotFoundException('No session type for practitioner');

    const duration = sessionType.durationMinutes;
    const step = query.granularityMinutes ?? duration;

    const availability = await this.prisma.practitionerAvailability.findMany({
      where: { practitionerId },
    });

    // Live reservations in the window. Expired holds are ignored without
    // needing the sweeper to have run yet, so a booking can claim a slot the
    // moment its hold TTL passes.
    const conflicts = await this.prisma.booking.findMany({
      where: {
        practitionerId,
        startTime: { lt: to },
        endTime: { gt: from },
        OR: [
          { status: { in: ['PENDING', 'CONFIRMED'] } },
          { status: 'HELD', holdExpiresAt: { gt: new Date() } },
        ],
      },
      select: { startTime: true, endTime: true },
    });
    const conflictRanges = conflicts.map((c) => ({
      start: c.startTime.getTime(),
      end: c.endTime.getTime(),
    }));

    const slots: { startTime: string; endTime: string }[] = [];
    let scannedDays = 0;

    for (const av of availability) {
      const tz = av.timezone;
      const startLocal = partsInZone(from, tz);
      const endLocal = partsInZone(to, tz);
      const firstOrdinal = dayOrdinal(startLocal.year, startLocal.month, startLocal.day);
      const lastOrdinal = dayOrdinal(endLocal.year, endLocal.month, endLocal.day);
      const dayCount = lastOrdinal - firstOrdinal + 1;
      scannedDays = Math.max(scannedDays, dayCount);

      for (let offset = 0; offset < dayCount; offset++) {
        const day = addDays(startLocal.year, startLocal.month, startLocal.day, offset);
        const weekday = new Date(
          Date.UTC(day.year, day.month - 1, day.day),
        ).getUTCDay();
        if (weekday !== av.weekday) continue;

        // Sample the zone offset once for this local day (fast path); fall
        // back to the exact per-instant conversion only on a DST transition.
        const dayOffset = dayOffsetIfStable(day.year, day.month, day.day, tz);

        for (
          let minute = av.startMinute;
          minute + duration <= av.endMinute;
          minute += step
        ) {
          const localHour = Math.floor(minute / 60);
          const localMinute = minute % 60;
          const start =
            dayOffset === null
              ? zonedTimeToUtc(
                  day.year,
                  day.month,
                  day.day,
                  localHour,
                  localMinute,
                  tz,
                )
              : utcFromLocal(
                  day.year,
                  day.month,
                  day.day,
                  localHour,
                  localMinute,
                  dayOffset,
                );
          const end = new Date(start.getTime() + duration * 60_000);
          if (start < from || start >= to) continue;
          if (start.getTime() < Date.now()) continue;

          const overlaps = conflictRanges.some(
            (r) => start.getTime() < r.end && end.getTime() > r.start,
          );
          if (!overlaps) {
            slots.push({
              startTime: start.toISOString(),
              endTime: end.toISOString(),
            });
          }
        }
      }
    }

    slots.sort((a, b) => a.startTime.localeCompare(b.startTime));

    // `maxSlots` caps the payload without short-circuiting the computation, so
    // response size stays constant while the candidate/conflict scan still runs
    // in full. That is what makes the slot-lookup benchmark measure compute.
    const capped =
      query.maxSlots && slots.length > query.maxSlots
        ? slots.slice(0, query.maxSlots)
        : slots;

    return {
      slots: capped,
      totalOpen: slots.length,
      practitionerId,
      scannedDays,
      conflictsConsidered: conflictRanges.length,
    };
  }

  // ──────────────────────────────────────────────────────────────────────
  // Booking creation (conflict-safe) and holds
  // ──────────────────────────────────────────────────────────────────────

  async createBooking(
    memberId: string,
    dto: CreateBookingDto,
  ): Promise<BookingRow> {
    const { sessionType, start, end } = await this.resolveSlot(dto);

    return this.withIdempotency(memberId, dto.clientOpId, 'book', async () => {
      await this.assertWithinAvailability(
        sessionType.practitionerId,
        start,
        sessionType.durationMinutes,
      );
      await this.expireHoldsThrottled();

      try {
        if (dto.holdId) {
          // Promote a hold the same member owns. The excluded `status = HELD`
          // row already owns the slot, so this UPDATE cannot lose a race.
          const promoted = await this.writeTx(async (tx) => {
            const res = await tx.booking.updateMany({
              where: { id: dto.holdId, memberId, status: 'HELD' },
              data: {
                status: 'CONFIRMED',
                confirmedAt: new Date(),
                holdExpiresAt: null,
                clientOpId: dto.clientOpId ?? null,
              },
            });
            if (res.count === 0) {
              throw new ConflictException('Hold not found, expired, or not yours');
            }
            const row = await tx.booking.findUniqueOrThrow({
              where: { id: dto.holdId },
              include: BOOKING_INCLUDE,
            });
            await this.outbox.emit(tx, BOOKING_CONFIRMED, this.eventPayload(row));
            return row;
          });
          this.metrics.bookingsCreated.inc();
          return promoted;
        }

        const created = await this.writeTx(async (tx) => {
          await this.acquireSlotLock(tx, sessionType.practitionerId, start);
          const row = await tx.booking.create({
            data: {
              practitionerId: sessionType.practitionerId,
              memberId,
              sessionTypeId: sessionType.id,
              startTime: start,
              endTime: end,
              status: 'CONFIRMED',
              priceCents: sessionType.priceCents,
              currency: sessionType.currency,
              clientOpId: dto.clientOpId ?? null,
              confirmedAt: new Date(),
            },
            include: BOOKING_INCLUDE,
          });
          await this.outbox.emit(tx, BOOKING_CONFIRMED, this.eventPayload(row));
          return row;
        });
        this.metrics.bookingsCreated.inc();
        return created;
      } catch (err) {
        if (isExclusionViolation(err)) {
          this.metrics.bookingConflicts.inc();
          throw new ConflictException({
            error: 'SlotUnavailable',
            message: 'That slot is no longer available',
          });
        }
        throw err;
      }
    });
  }

  async createHold(memberId: string, dto: CreateHoldDto): Promise<BookingRow> {
    const { sessionType, start, end } = await this.resolveSlot({
      sessionTypeId: dto.sessionTypeId,
      startTime: dto.startTime,
    });
    const ttl = dto.ttlSeconds ?? this.holdTtlSeconds;

    return this.withIdempotency(memberId, dto.clientOpId, 'hold', async () => {
      await this.assertWithinAvailability(
        sessionType.practitionerId,
        start,
        sessionType.durationMinutes,
      );
      await this.expireHoldsThrottled();

      try {
        const hold = await this.writeTx(async (tx) => {
          await this.acquireSlotLock(tx, sessionType.practitionerId, start);
          return tx.booking.create({
            data: {
              practitionerId: sessionType.practitionerId,
              memberId,
              sessionTypeId: sessionType.id,
              startTime: start,
              endTime: end,
              status: 'HELD',
              priceCents: sessionType.priceCents,
              currency: sessionType.currency,
              holdExpiresAt: new Date(Date.now() + ttl * 1000),
            },
            include: BOOKING_INCLUDE,
          });
        });
        this.metrics.holdsCreated.inc();
        return hold;
      } catch (err) {
        if (isExclusionViolation(err)) {
          this.metrics.bookingConflicts.inc();
          throw new ConflictException({
            error: 'SlotUnavailable',
            message: 'That slot is already held or booked',
          });
        }
        throw err;
      }
    });
  }

  async reschedule(
    userId: string,
    bookingId: string,
    dto: RescheduleBookingDto,
  ): Promise<BookingRow> {
    const existing = await this.findAuthorizedBooking(userId, bookingId);
    const newStart = new Date(dto.startTime);
    if (Number.isNaN(newStart.getTime())) {
      throw new BadRequestException('startTime must be a valid ISO-8601 timestamp');
    }
    const duration = existing.sessionType.durationMinutes;
    const newEnd = new Date(newStart.getTime() + duration * 60_000);

    return this.withIdempotency(userId, dto.clientOpId, 'reschedule', async () => {
      await this.assertWithinAvailability(
        existing.practitionerId,
        newStart,
        duration,
      );
      await this.expireHoldsThrottled();
      try {
        return await this.writeTx(async (tx) => {
          await this.acquireSlotLock(tx, existing.practitionerId, newStart);
          const row = await tx.booking.update({
            where: { id: bookingId },
            data: { startTime: newStart, endTime: newEnd },
            include: BOOKING_INCLUDE,
          });
          await this.outbox.emit(tx, BOOKING_CONFIRMED, {
            ...this.eventPayload(row),
            rescheduled: true,
          });
          return row;
        });
      } catch (err) {
        if (isExclusionViolation(err)) {
          throw new ConflictException({
            error: 'SlotUnavailable',
            message: 'The new slot overlaps another reservation',
          });
        }
        throw err;
      }
    });
  }

  async cancel(
    userId: string,
    bookingId: string,
    dto: CancelBookingDto,
  ): Promise<BookingRow> {
    const existing = await this.findAuthorizedBooking(userId, bookingId);

    return this.withIdempotency(userId, dto.clientOpId, 'cancel', async () => {
      if (existing.status === 'CANCELLED') return existing;

      const msToStart = existing.startTime.getTime() - Date.now();
      const withinNotice =
        msToStart < this.cancelNoticeHours * 3600_000 && msToStart > 0;

      const row = await this.writeTx(async (tx) => {
        const updated = await tx.booking.update({
          where: { id: bookingId },
          data: {
            status: 'CANCELLED',
            cancelledAt: new Date(),
            cancelReason: dto.reason ?? null,
          },
          include: BOOKING_INCLUDE,
        });
        await this.outbox.emit(tx, BOOKING_CANCELLED, {
          ...this.eventPayload(updated),
          reason: dto.reason ?? null,
          withinNoticeWindow: withinNotice,
        });
        return updated;
      });
      return row;
    });
  }

  async listBookings(params: {
    userId: string;
    as?: 'member' | 'practitioner';
    from?: string;
    to?: string;
    limit?: number;
  }) {
    const limit = params.limit ?? 50;
    const where: Prisma.BookingWhereInput = {
      ...(params.as === 'practitioner'
        ? { practitionerId: params.userId }
        : params.as === 'member'
          ? { memberId: params.userId }
          : {
              OR: [
                { memberId: params.userId },
                { practitionerId: params.userId },
              ],
            }),
      ...(params.from || params.to
        ? {
            startTime: {
              ...(params.from ? { gte: new Date(params.from) } : {}),
              ...(params.to ? { lt: new Date(params.to) } : {}),
            },
          }
        : {}),
    };
    const rows = await this.prisma.booking.findMany({
      where,
      include: BOOKING_INCLUDE,
      orderBy: { startTime: 'desc' },
      take: limit,
    });
    return { items: rows };
  }

  /**
   * Reap holds whose TTL has passed. Safe to run concurrently: each row is
   * cancelled at most once, and the exclusion index immediately frees the slot.
   */
  async expireStaleHolds(): Promise<number> {
    const res = await this.prisma.booking.updateMany({
      where: { status: 'HELD', holdExpiresAt: { lt: new Date() } },
      data: {
        status: 'CANCELLED',
        cancelledAt: new Date(),
        cancelReason: 'hold_expired',
      },
    });
    return res.count;
  }

  // ──────────────────────────────────────────────────────────────────────
  // Internals
  // ──────────────────────────────────────────────────────────────────────

  private async resolveSlot(dto: {
    sessionTypeId: string;
    startTime: string;
  }) {
    const sessionType = await this.prisma.sessionType.findUnique({
      where: { id: dto.sessionTypeId },
    });
    if (!sessionType || !sessionType.active) {
      throw new NotFoundException('Session type not found');
    }
    const start = new Date(dto.startTime);
    if (Number.isNaN(start.getTime())) {
      throw new BadRequestException('startTime must be a valid ISO-8601 timestamp');
    }
    const end = new Date(start.getTime() + sessionType.durationMinutes * 60_000);
    return { sessionType, start, end };
  }

  private async assertWithinAvailability(
    practitionerId: string,
    start: Date,
    durationMinutes: number,
  ): Promise<void> {
    const availability = await this.prisma.practitionerAvailability.findMany({
      where: { practitionerId },
    });
    if (availability.length === 0) {
      throw new BadRequestException('Practitioner has no availability configured');
    }
    const ok = availability.some((av) => {
      const p = partsInZone(start, av.timezone);
      if (p.weekday !== av.weekday) return false;
      const localMinute = p.hour * 60 + p.minute;
      return (
        localMinute >= av.startMinute &&
        localMinute + durationMinutes <= av.endMinute
      );
    });
    if (!ok) {
      throw new BadRequestException('Requested time is outside availability');
    }
  }

  private async findAuthorizedBooking(userId: string, bookingId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: BOOKING_INCLUDE,
    });
    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.memberId !== userId && booking.practitionerId !== userId) {
      throw new ForbiddenException('Not a participant on this booking');
    }
    return booking;
  }

  /**
   * Exactly-once mutation guard keyed by (userId, clientOpId). The first request
   * records its result; a retry with the same op id returns the recorded result
   * without repeating the side effect. A concurrent duplicate waits briefly for
   * the winner to record its result.
   */
  private async withIdempotency<T>(
    userId: string,
    opId: string | undefined,
    action: string,
    fn: () => Promise<T>,
  ): Promise<T> {
    if (!opId) return fn();

    const key = { userId_opId: { userId, opId } };
    const existing = await this.prisma.bookingOperation.findUnique({ where: key });
    if (existing) {
      this.metrics.idempotentReplays.inc({ action });
      return this.replay<T>(existing);
    }

    try {
      await this.prisma.bookingOperation.create({
        data: { userId, opId, action },
      });
    } catch (err) {
      if (isUniqueViolation(err)) {
        const winner = await this.waitForOperation(userId, opId);
        if (winner?.response) {
          this.metrics.idempotentReplays.inc({ action });
          return this.replay<T>(winner);
        }
        throw new ConflictException('Operation already in progress');
      }
      throw err;
    }

    try {
      const result = await fn();
      await this.prisma.bookingOperation.update({
        where: key,
        data: {
          response: result as unknown as Prisma.InputJsonValue,
          bookingId: (result as { id?: string })?.id ?? null,
        },
      });
      return result;
    } catch (err) {
      // Do not poison the idempotency key: a failed attempt may be retried.
      await this.prisma.bookingOperation.delete({ where: key }).catch(() => undefined);
      throw err;
    }
  }

  private replay<T>(row: { response: Prisma.JsonValue }): T {
    if (row.response === null || row.response === undefined) {
      throw new ConflictException('Operation already in progress');
    }
    return row.response as unknown as T;
  }

  private async waitForOperation(
    userId: string,
    opId: string,
  ): Promise<{ response: Prisma.JsonValue } | null> {
    const key = { userId_opId: { userId, opId } };
    for (let i = 0; i < 20; i++) {
      await new Promise((r) => setTimeout(r, 25));
      const row = await this.prisma.bookingOperation.findUnique({ where: key });
      if (!row) return null;
      if (row.response !== null && row.response !== undefined) return row;
    }
    return null;
  }

  /**
   * Serialises the tiny critical section for one (practitioner, slot) pair with
   * a transaction-scoped advisory lock.
   *
   * PostgreSQL's GiST exclusion index can deadlock when several sessions insert
   * overlapping ranges at once (BUG #15026), and with 3+ sessions a retry loop
   * can livelock. The documented remedy is to take one exclusive lock on a
   * shared entity *before* the insert. Here the key is the slot itself, so
   * contenders queue in a deterministic order: the first commits, the rest then
   * hit the exclusion constraint and get a clean 23P01. Different slots use
   * different keys and proceed in parallel. The exclusion constraint remains the
   * correctness backstop — the lock only removes the deadlock storm.
   */
  private async acquireSlotLock(
    tx: Prisma.TransactionClient,
    practitionerId: string,
    start: Date,
  ): Promise<void> {
    const key = `${practitionerId}:${start.toISOString()}`;
    // Namespace 4242 keeps booking locks out of other advisory-lock keyspaces.
    // Wrapped in a subquery so the `void` return is not deserialized by Prisma
    // (which cannot read a void column from $queryRaw).
    await tx.$queryRaw`
      SELECT 1 AS locked
      FROM (SELECT pg_advisory_xact_lock(4242, hashtext(${key}::text))) AS _lock
    `;
  }

  /**
   * Runs a write transaction with a generous budget and bounded retries.
   *
   * Under a same-slot race the exclusion index serializes writers; Postgres can
   * surface a deadlock (40P01) or Prisma can hit its interactive-transaction
   * deadline (P2028) while a row waits on a lock. Both are transient and safe to
   * retry for this single-row insert. A 23P01 (slot taken) is not retried.
   */
  private writeTx<T>(
    fn: (tx: Prisma.TransactionClient) => Promise<T>,
    attempts = 5,
  ): Promise<T> {
    return this.withWriteRetry(
      () => this.prisma.$transaction(fn, WRITE_TX_OPTIONS),
      attempts,
    );
  }

  private async withWriteRetry<T>(
    fn: () => Promise<T>,
    attempts: number,
  ): Promise<T> {
    let lastError: unknown;
    for (let attempt = 0; attempt < attempts; attempt++) {
      try {
        return await fn();
      } catch (err) {
        lastError = err;
        if (!isRetryableWriteError(err)) throw err;
        const backoff = 4 * (attempt + 1) + Math.random() * 12;
        await new Promise((r) => setTimeout(r, backoff));
      }
    }
    throw lastError;
  }

  /**
   * Hot-path variant of the hold sweep. A full `UPDATE` before every single
   * booking attempt is wasted work under contention, so it is throttled: within
   * a 100 ms window the request relies on the background sweeper. Expired holds
   * are still excluded from slot reads, and the worst-case release latency grows
   * by at most the throttle window.
   */
  private async expireHoldsThrottled(): Promise<void> {
    const now = Date.now();
    if (now - this.lastHoldExpiryAt < 100) return;
    this.lastHoldExpiryAt = now;
    await this.expireStaleHolds();
  }

  private eventPayload(row: BookingRow) {
    return {
      bookingId: row.id,
      practitionerId: row.practitionerId,
      memberId: row.memberId,
      sessionTypeId: row.sessionTypeId,
      startTime: row.startTime.toISOString(),
      endTime: row.endTime.toISOString(),
      status: row.status,
    };
  }
}
