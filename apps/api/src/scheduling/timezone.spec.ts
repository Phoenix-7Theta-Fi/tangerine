import {
  addDays,
  dayOffsetIfStable,
  dayOrdinal,
  offsetMs,
  partsInZone,
  utcFromLocal,
  zonedTimeToUtc,
} from './timezone';

describe('timezone arithmetic', () => {
  it('converts a fixed-offset zone (Asia/Kolkata, +05:30) to UTC', () => {
    const utc = zonedTimeToUtc(2026, 10, 14, 10, 0, 'Asia/Kolkata');
    expect(utc.toISOString()).toBe('2026-10-14T04:30:00.000Z');
  });

  it('applies the correct DST offset on both sides of a transition (New York)', () => {
    const winter = zonedTimeToUtc(2026, 1, 15, 12, 0, 'America/New_York');
    const summer = zonedTimeToUtc(2026, 7, 15, 12, 0, 'America/New_York');
    // EST = UTC−5, EDT = UTC−4.
    expect(winter.toISOString()).toBe('2026-01-15T17:00:00.000Z');
    expect(summer.toISOString()).toBe('2026-07-15T16:00:00.000Z');
  });

  it('round-trips local wall-clock parts through UTC', () => {
    const utc = zonedTimeToUtc(2026, 6, 15, 14, 15, 'Europe/Zurich');
    const parts = partsInZone(utc, 'Europe/Zurich');
    expect([parts.hour, parts.minute]).toEqual([14, 15]);
  });

  it('resolves a wall-clock time inside a DST spring-forward gap to a real instant', () => {
    // 02:30 on 2026-03-29 does not exist in Europe/Zurich (02:00 → 03:00). The
    // two-pass conversion must still land on a valid instant, not NaN or a
    // wrong-day result; it resolves forward to 03:30 local.
    const utc = zonedTimeToUtc(2026, 3, 29, 2, 30, 'Europe/Zurich');
    const parts = partsInZone(utc, 'Europe/Zurich');
    expect([parts.hour, parts.minute]).toEqual([3, 30]);
  });

  it('reports the weekday of the local calendar date', () => {
    // 2026-10-14 is a Wednesday (weekday 3).
    const parts = partsInZone(new Date('2026-10-14T04:30:00.000Z'), 'Asia/Kolkata');
    expect(parts.weekday).toBe(3);
  });

  it('handles calendar arithmetic across month boundaries', () => {
    expect(addDays(2026, 1, 31, 1)).toEqual({ year: 2026, month: 2, day: 1 });
    expect(dayOrdinal(2026, 2, 1) - dayOrdinal(2026, 1, 31)).toBe(1);
  });

  it('produces a stable offset for a fixed zone', () => {
    expect(offsetMs(new Date('2026-10-14T00:00:00.000Z'), 'Asia/Kolkata')).toBe(
      5.5 * 3600 * 1000,
    );
  });

  it('uses a per-day cached offset only when the day has no DST transition', () => {
    const off = dayOffsetIfStable(2026, 10, 14, 'Europe/Zurich');
    expect(off).not.toBeNull();
    // The fast path must agree with the exact two-pass conversion.
    expect(
      utcFromLocal(2026, 10, 14, 9, 30, off as number).toISOString(),
    ).toBe(zonedTimeToUtc(2026, 10, 14, 9, 30, 'Europe/Zurich').toISOString());

    // 2026-03-29 is the European spring-forward day.
    expect(dayOffsetIfStable(2026, 3, 29, 'Europe/Zurich')).toBeNull();
  });
});
