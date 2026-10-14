/**
 * Minimal, dependency-free IANA timezone arithmetic.
 *
 * Availability is stored as the practitioner's *local wall clock* (weekday +
 * minutes from local midnight + IANA zone). To place a bookable slot on the
 * UTC timeline we must convert those wall-clock instants to UTC, which depends
 * on the offset in force *at that instant* (DST). `Intl.DateTimeFormat` with a
 * timeZone is the only correct source of that offset in Node without a tz
 * database dependency, so we use it directly.
 */

const FMT_CACHE = new Map<string, Intl.DateTimeFormat>();

function formatter(timeZone: string): Intl.DateTimeFormat {
  let fmt = FMT_CACHE.get(timeZone);
  if (!fmt) {
    fmt = new Intl.DateTimeFormat('en-US', {
      timeZone,
      hour12: false,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    FMT_CACHE.set(timeZone, fmt);
  }
  return fmt;
}

export interface ZonedParts {
  year: number;
  month: number; // 1-12
  day: number; // 1-31
  hour: number; // 0-23
  minute: number;
  second: number;
  weekday: number; // 0 = Sunday … 6 = Saturday
}

/** The wall-clock parts of an instant as observed in `timeZone`. */
export function partsInZone(date: Date, timeZone: string): ZonedParts {
  const parts = formatter(timeZone).formatToParts(date);
  const map: Record<string, string> = {};
  for (const p of parts) map[p.type] = p.value;
  const year = Number(map.year);
  const month = Number(map.month);
  const day = Number(map.day);
  const hour = Number(map.hour === '24' ? '0' : map.hour);
  const minute = Number(map.minute);
  const second = Number(map.second);
  return {
    year,
    month,
    day,
    hour,
    minute,
    second,
    weekday: new Date(Date.UTC(year, month - 1, day)).getUTCDay(),
  };
}

/** Offset (ms) that must be added to UTC to obtain local time in `timeZone`. */
export function offsetMs(date: Date, timeZone: string): number {
  const p = partsInZone(date, timeZone);
  const asUtc = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second);
  const floored = date.getTime() - (date.getTime() % 1000);
  return asUtc - floored;
}

/**
 * Convert a local wall-clock time in `timeZone` to the corresponding UTC
 * instant. Two passes handle a DST boundary: the first guess uses the offset at
 * the *naive* UTC interpretation, the second corrects using the offset actually
 * in force at the resulting instant.
 */
export function zonedTimeToUtc(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  timeZone: string,
): Date {
  const naiveUtc = Date.UTC(year, month - 1, day, hour, minute, 0, 0);
  const firstOffset = offsetMs(new Date(naiveUtc), timeZone);
  let ts = naiveUtc - firstOffset;
  const secondOffset = offsetMs(new Date(ts), timeZone);
  if (secondOffset !== firstOffset) ts = naiveUtc - secondOffset;
  return new Date(ts);
}

/** Add `days` to a y/m/d triple using UTC calendar math (DST-safe). */
export function addDays(
  year: number,
  month: number,
  day: number,
  days: number,
): { year: number; month: number; day: number } {
  const d = new Date(Date.UTC(year, month - 1, day + days));
  return {
    year: d.getUTCFullYear(),
    month: d.getUTCMonth() + 1,
    day: d.getUTCDate(),
  };
}

/** Whole-day ordinal for a y/m/d triple, so ranges can be compared cheaply. */
export function dayOrdinal(year: number, month: number, day: number): number {
  return Math.floor(Date.UTC(year, month - 1, day) / 86_400_000);
}

/**
 * The UTC offset (ms) in force for a local calendar day, if it is constant
 * across the day (i.e. no DST transition). Returns null on a transition day so
 * the caller can fall back to the exact per-instant conversion.
 *
 * Slot expansion can produce thousands of candidates from one availability
 * window; calling `Intl.DateTimeFormat.formatToParts` for each is the dominant
 * cost. Sampling the offset once per day removes that cost for the common case.
 */
export function dayOffsetIfStable(
  year: number,
  month: number,
  day: number,
  timeZone: string,
): number | null {
  const start = offsetMs(new Date(Date.UTC(year, month - 1, day, 0, 0, 0)), timeZone);
  const end = offsetMs(new Date(Date.UTC(year, month - 1, day, 23, 0, 0)), timeZone);
  return start === end ? start : null;
}

/** Convert local wall-clock parts to UTC using a pre-sampled day offset. */
export function utcFromLocal(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  offset: number,
): Date {
  return new Date(Date.UTC(year, month - 1, day, hour, minute, 0, 0) - offset);
}
