/**
 * Opaque keyset (seek) cursors.
 *
 * Offset pagination is wrong for feeds and chat: rows are inserted at the top
 * while the user reads, which shifts every offset and produces duplicates or
 * skipped items. A keyset cursor encodes a stable position — typically
 * (sortKey, id) — so the next page continues exactly where the last ended,
 * regardless of concurrent writes.
 */
export function encodeCursor(values: (string | number)[]): string {
  return Buffer.from(JSON.stringify(values), 'utf8').toString('base64url');
}

export function decodeCursor(cursor?: string | null): string[] | null {
  if (!cursor) return null;
  try {
    const parsed = JSON.parse(
      Buffer.from(cursor, 'base64url').toString('utf8'),
    );
    if (!Array.isArray(parsed)) return null;
    return parsed.map((v) => String(v));
  } catch {
    return null;
  }
}
