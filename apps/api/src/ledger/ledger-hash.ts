import { createHash } from 'node:crypto';

export type LedgerDirectionText = 'DEBIT' | 'CREDIT';

export interface HashablePosting {
  accountId: string;
  direction: LedgerDirectionText;
  amountCents: number;
  currency: string;
}

export interface HashableTransaction {
  seq: number;
  kind: string;
  sourceType: string;
  sourceId: string;
  createdAt: Date;
  previousHash: string | null;
  postings: HashablePosting[];
}

/**
 * Deterministic, order-independent canonical encoding of a transaction and its
 * postings. Postings are sorted by a stable key so that the hash depends only
 * on the *set* of legs, not the order the application happened to insert them.
 */
export function canonicalizeTransaction(tx: HashableTransaction): string {
  const postings = [...tx.postings]
    .map(
      (p) =>
        [p.accountId, p.direction, p.amountCents, p.currency] as const,
    )
    .sort((a, b) => {
      const ka = `${a[0]}\u0000${a[1]}\u0000${String(a[2]).padStart(20, '0')}\u0000${a[3]}`;
      const kb = `${b[0]}\u0000${b[1]}\u0000${String(b[2]).padStart(20, '0')}\u0000${b[3]}`;
      return ka < kb ? -1 : ka > kb ? 1 : 0;
    });

  return JSON.stringify({
    seq: tx.seq,
    kind: tx.kind,
    sourceType: tx.sourceType,
    sourceId: tx.sourceId,
    createdAt: tx.createdAt.toISOString(),
    previousHash: tx.previousHash,
    postings,
  });
}

/** SHA-256 (hex) of the canonical encoding. */
export function hashTransaction(tx: HashableTransaction): string {
  return createHash('sha256')
    .update(canonicalizeTransaction(tx))
    .digest('hex');
}
