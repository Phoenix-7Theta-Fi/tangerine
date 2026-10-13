import { decodeCursor, encodeCursor } from './cursor';

describe('cursor', () => {
  it('round-trips values', () => {
    const cursor = encodeCursor([1712345678901, 'post_123']);
    expect(decodeCursor(cursor)).toEqual(['1712345678901', 'post_123']);
  });

  it('returns null for empty input', () => {
    expect(decodeCursor(undefined)).toBeNull();
    expect(decodeCursor(null)).toBeNull();
    expect(decodeCursor('')).toBeNull();
  });

  it('returns null for garbage', () => {
    expect(decodeCursor('not-a-cursor!!')).toBeNull();
    // valid base64url of a non-array JSON value
    const nonArray = Buffer.from('{"a":1}', 'utf8').toString('base64url');
    expect(decodeCursor(nonArray)).toBeNull();
  });

  it('is url-safe (no padding, no + or /)', () => {
    const cursor = encodeCursor([1, 'x'.repeat(50)]);
    expect(cursor).not.toMatch(/[+/=]/);
  });
});
