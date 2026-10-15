import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { LedgerDirection, LedgerTransactionKind, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { MetricsService } from '../metrics/metrics.service';
import { hashTransaction } from './ledger-hash';

export type LedgerTransactionWithPostings = Prisma.LedgerTransactionGetPayload<{
  include: { postings: true };
}>;

export interface LedgerPostingInput {
  accountId: string;
  direction: LedgerDirection;
  amountCents: number;
  currency?: string;
}

export interface PostTransactionInput {
  kind: LedgerTransactionKind;
  sourceType: string;
  sourceId: string;
  description?: string;
  postings: LedgerPostingInput[];
}

export interface LedgerBalance {
  accountId: string;
  currency: string;
  debitCents: number;
  creditCents: number;
  /** Signed: credits minus debits. */
  balanceCents: number;
}

export interface IntegrityReport {
  ok: boolean;
  checked: number;
  brokenAtSeq?: number;
  reason?: string;
}

/**
 * Advisory-lock namespace for the global hash chain. Serialises chain
 * extension so that `seq` is gap-free and `previousHash` always links to the
 * immediately preceding transaction. Ledger writes are tiny; the correctness
 * of an unbroken chain is worth far more than concurrent write throughput.
 */
const LEDGER_CHAIN_LOCK_NAMESPACE = 9317;

const LEDGER_TX_OPTIONS = { timeout: 20_000, maxWait: 20_000 } as const;

/**
 * Double-entry ledger.
 *
 * The database is the arbiter (see the migration):
 *   * append-only triggers reject UPDATE/DELETE on both tables;
 *   * a deferred constraint trigger rejects any transaction whose postings do
 *     not net to zero, at COMMIT.
 *
 * This service enforces the same rules as a convenience (fast, clear errors)
 * and adds the parts that only application code can: idempotency by source,
 * deterministic hash-chain construction, and chain verification.
 */
@Injectable()
export class LedgerService {
  private readonly logger = new Logger(LedgerService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly metrics: MetricsService,
  ) {}

  /**
   * Post one balanced transaction. Idempotent on `(sourceType, sourceId, kind)`:
   * a repeat returns the already-recorded transaction without a second row.
   */
  async postTransaction(
    input: PostTransactionInput,
  ): Promise<LedgerTransactionWithPostings> {
    const postings = this.validate(input);

    const uniqueKey = {
      sourceType: input.sourceType,
      sourceId: input.sourceId,
      kind: input.kind,
    };

    const existing = await this.findBySource(uniqueKey);
    if (existing) {
      this.metrics.idempotentReplays.inc({ action: 'ledger' });
      return existing;
    }

    try {
      const created = await this.prisma.$transaction(async (tx) => {
        // Serialise chain extension. The lock is transaction-scoped: released
        // on commit or rollback, so a failed append never blocks the chain.
        await this.acquireChainLock(tx);

        // Re-check inside the lock: a concurrent duplicate that committed
        // while we were waiting must not create a second transaction.
        const raced = await tx.ledgerTransaction.findUnique({
          where: { sourceType_sourceId_kind: uniqueKey },
          include: { postings: true },
        });
        if (raced) return raced;

        const last = await tx.ledgerTransaction.findFirst({
          orderBy: { seq: 'desc' },
          select: { seq: true, hash: true },
        });
        const seq = (last?.seq ?? 0) + 1;
        const previousHash = last?.hash ?? null;
        const createdAt = new Date();

        const normalized = postings.map((p) => ({
          accountId: p.accountId,
          direction: p.direction,
          amountCents: p.amountCents,
          currency: p.currency ?? 'USD',
        }));

        const hash = hashTransaction({
          seq,
          kind: input.kind,
          sourceType: input.sourceType,
          sourceId: input.sourceId,
          createdAt,
          previousHash,
          postings: normalized,
        });

        return tx.ledgerTransaction.create({
          data: {
            seq,
            kind: input.kind,
            sourceType: input.sourceType,
            sourceId: input.sourceId,
            description: input.description ?? null,
            createdAt,
            previousHash,
            hash,
            postings: { create: normalized },
          },
          include: { postings: true },
        });
      }, LEDGER_TX_OPTIONS);

      this.metrics.ledgerTransactions.inc({ kind: input.kind });
      return created;
    } catch (err) {
      if (isUniqueViolation(err)) {
        const winner = await this.findBySource(uniqueKey);
        if (winner) {
          this.metrics.idempotentReplays.inc({ action: 'ledger' });
          return winner;
        }
      }
      throw err;
    }
  }

  /** Derived balance. Never stored; always aggregated from the postings. */
  async getBalance(accountId: string, currency = 'USD'): Promise<LedgerBalance> {
    const grouped = await this.prisma.ledgerPosting.groupBy({
      by: ['direction'],
      where: { accountId, currency },
      _sum: { amountCents: true },
    });
    const debitCents =
      grouped.find((g) => g.direction === LedgerDirection.DEBIT)?._sum
        .amountCents ?? 0;
    const creditCents =
      grouped.find((g) => g.direction === LedgerDirection.CREDIT)?._sum
        .amountCents ?? 0;
    return {
      accountId,
      currency,
      debitCents,
      creditCents,
      balanceCents: creditCents - debitCents,
    };
  }

  /** Global debit-minus-credit across every posting. Must always be 0. */
  async globalImbalanceCents(): Promise<number> {
    const grouped = await this.prisma.ledgerPosting.groupBy({
      by: ['direction'],
      _sum: { amountCents: true },
    });
    const debit =
      grouped.find((g) => g.direction === LedgerDirection.DEBIT)?._sum
        .amountCents ?? 0;
    const credit =
      grouped.find((g) => g.direction === LedgerDirection.CREDIT)?._sum
        .amountCents ?? 0;
    return debit - credit;
  }

  /**
   * Walk the hash chain in `seq` order and recompute every hash. Detects
   * sequence gaps, broken links, and content changes (tampering).
   */
  async verifyIntegrity(): Promise<IntegrityReport> {
    const rows = await this.prisma.ledgerTransaction.findMany({
      orderBy: { seq: 'asc' },
      include: { postings: true },
    });

    let previousHash: string | null = null;
    let expectedSeq = 1;
    let checked = 0;

    for (const txRow of rows) {
      if (txRow.seq !== expectedSeq) {
        return {
          ok: false,
          checked,
          brokenAtSeq: txRow.seq,
          reason: `sequence gap: expected ${expectedSeq}, found ${txRow.seq}`,
        };
      }
      if ((txRow.previousHash ?? null) !== previousHash) {
        return {
          ok: false,
          checked,
          brokenAtSeq: txRow.seq,
          reason: 'hash chain link mismatch (a prior transaction was altered or removed)',
        };
      }

      const recomputed = hashTransaction({
        seq: txRow.seq,
        kind: txRow.kind,
        sourceType: txRow.sourceType,
        sourceId: txRow.sourceId,
        createdAt: txRow.createdAt,
        previousHash: txRow.previousHash ?? null,
        postings: txRow.postings.map((p) => ({
          accountId: p.accountId,
          direction: p.direction,
          amountCents: p.amountCents,
          currency: p.currency,
        })),
      });
      if (recomputed !== txRow.hash) {
        return {
          ok: false,
          checked,
          brokenAtSeq: txRow.seq,
          reason: 'content hash mismatch (record tampered with)',
        };
      }

      previousHash = txRow.hash;
      expectedSeq += 1;
      checked += 1;
    }

    return { ok: true, checked };
  }

  listTransactions(params: {
    sourceType?: string;
    sourceId?: string;
    limit?: number;
  }): Promise<LedgerTransactionWithPostings[]> {
    return this.prisma.ledgerTransaction.findMany({
      where: {
        ...(params.sourceType ? { sourceType: params.sourceType } : {}),
        ...(params.sourceId ? { sourceId: params.sourceId } : {}),
      },
      include: { postings: true },
      orderBy: { seq: 'desc' },
      take: params.limit ?? 50,
    });
  }

  // ────────────────────────────────────────────────────────────────────────
  // Internals
  // ────────────────────────────────────────────────────────────────────────

  private validate(input: PostTransactionInput): LedgerPostingInput[] {
    const postings = input.postings ?? [];
    if (postings.length < 2) {
      throw new BadRequestException(
        'A double-entry transaction needs at least two postings',
      );
    }
    let debit = 0;
    let credit = 0;
    for (const p of postings) {
      if (!p.accountId) throw new BadRequestException('accountId is required');
      if (!Number.isInteger(p.amountCents) || p.amountCents <= 0) {
        throw new BadRequestException(
          `amountCents must be a positive integer (got ${p.amountCents})`,
        );
      }
      if (p.direction === LedgerDirection.DEBIT) debit += p.amountCents;
      else if (p.direction === LedgerDirection.CREDIT) credit += p.amountCents;
      else throw new BadRequestException(`Unknown direction ${String(p.direction)}`);
    }
    if (debit !== credit) {
      throw new BadRequestException(
        `Postings must balance: debits (${debit}) != credits (${credit})`,
      );
    }
    return postings;
  }

  private findBySource(key: {
    sourceType: string;
    sourceId: string;
    kind: LedgerTransactionKind;
  }): Promise<LedgerTransactionWithPostings | null> {
    return this.prisma.ledgerTransaction.findUnique({
      where: { sourceType_sourceId_kind: key },
      include: { postings: true },
    });
  }

  private async acquireChainLock(tx: Prisma.TransactionClient): Promise<void> {
    await tx.$queryRaw`
      SELECT 1 AS locked
      FROM (SELECT pg_advisory_xact_lock(${LEDGER_CHAIN_LOCK_NAMESPACE})) AS _lock
    `;
  }
}

function isUniqueViolation(err: unknown): boolean {
  return (
    err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002'
  );
}
