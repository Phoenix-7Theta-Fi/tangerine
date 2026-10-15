import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { IdempotencyStatus, Prisma } from '@prisma/client';
import { createHash, randomUUID } from 'node:crypto';
import { PrismaService } from '../prisma/prisma.service';
import { MetricsService } from '../metrics/metrics.service';

/** Ambient context handed to the operation so it can record recovery points. */
export interface RecoveryContext {
  /** Last durable checkpoint, as recorded before this attempt started. */
  readonly recoveryPoint: string | null;
  /** Persist a checkpoint. Durable immediately (its own statement). */
  setRecoveryPoint(point: string): Promise<void>;
}

export interface ExecuteParams<T> {
  userId: string;
  /** Caller-supplied idempotency key, unique per user. */
  key: string;
  /** The request payload; hashed so a reuse with different content is a 409. */
  request: unknown;
  action?: string;
  /** HTTP status recorded alongside the response (default 201). */
  successStatus?: number;
  execute: (ctx: RecoveryContext) => Promise<T>;
}

type ClaimRow = {
  id: string;
  status: IdempotencyStatus;
  requestHash: string;
  recoveryPoint: string | null;
  lockToken: string | null;
  lockedAt: Date | null;
  expiresAt: Date;
  responseBody: Prisma.JsonValue | null;
};

type Claim =
  | { mode: 'CACHED'; body: unknown }
  | { mode: 'WAIT' }
  | { mode: 'RUN'; lockToken: string; recoveryPoint: string | null; id: string };

/** How long a claim is valid before another worker may take it over. */
export const LEASE_MS = 30_000;
/** How long a duplicate waits for the winner before giving up with a 409. */
const WAIT_MAX_MS = 15_000;
const WAIT_STEP_MS = 50;
/** How long a recorded response stays reusable (mirrors Stripe). */
const RETENTION_MS = 24 * 60 * 60 * 1000;
/**
 * Claim transactions are short, but under a stampede many callers queue for a
 * pooled connection, so give acquisition a generous budget.
 */
const CLAIM_TX_OPTIONS = { timeout: 15_000, maxWait: 20_000 } as const;

/**
 * Idempotency with recovery points.
 *
 * Exactly-once for externally-triggered operations: the first caller runs the
 * operation and records its response; a retry with the same (userId, key) and
 * an identical request returns the recorded response without repeating the side
 * effect; a concurrent duplicate waits for the winner and then replays.
 *
 * The operation runs OUTSIDE the claim transaction, so a slow operation never
 * pins a database connection while holding a row lock (which would deadlock the
 * pool under a stampede). Serialisation is by a short `SELECT ... FOR UPDATE`
 * claim, plus a lease (`lockedAt`) and a fencing token (`lockToken`) so a worker
 * whose lease expired cannot clobber the attempt that took over from it.
 *
 * Recovery points make the operation resumable: it persists named checkpoints
 * as it progresses, so a retry after a crash reads `ctx.recoveryPoint` and
 * continues rather than restarting from zero.
 */
@Injectable()
export class IdempotencyService {
  private readonly logger = new Logger(IdempotencyService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly metrics: MetricsService,
  ) {}

  /** Canonical ledger key: one ledger write per (sourceType, sourceId, kind). */
  static ledgerKey(sourceType: string, sourceId: string, kind: string): string {
    return `ledger:${sourceType}:${sourceId}:${kind}`;
  }

  async execute<T>(params: ExecuteParams<T>): Promise<T> {
    const requestHash = sha256(stableStringify(params.request));
    const claim = await this.claim(params.userId, params.key, requestHash);

    if (claim.mode === 'CACHED') {
      this.metrics.idempotentReplays.inc({ action: params.action ?? 'generic' });
      return claim.body as T;
    }

    if (claim.mode === 'WAIT') {
      const body = await this.waitForLoser(params.userId, params.key);
      if (body !== undefined) {
        this.metrics.idempotentReplays.inc({ action: params.action ?? 'generic' });
        return body as T;
      }
      throw new ConflictException(
        'A request with this idempotency key is still in progress',
      );
    }

    // mode === 'RUN'
    return this.run<T>(params, claim);
  }

  // ────────────────────────────────────────────────────────────────────────
  // Claim: short transaction that serialises callers on the key's row.
  // ────────────────────────────────────────────────────────────────────────

  private async claim(
    userId: string,
    key: string,
    requestHash: string,
  ): Promise<Claim> {
    const id = randomUUID();
    const expiresAt = new Date(Date.now() + RETENTION_MS);

    return this.prisma.$transaction(async (tx) => {
      // Insert if absent; never overwrite an existing attempt.
      await tx.$executeRaw`
        INSERT INTO "IdempotencyKey"
          (id, "userId", key, "requestHash", status, "expiresAt", "createdAt", "updatedAt")
        VALUES
          (${id}, ${userId}, ${key}, ${requestHash},
           'STARTED'::"IdempotencyStatus", ${expiresAt}, now(), now())
        ON CONFLICT ("userId", key) DO NOTHING
      `;

      const rows = await tx.$queryRaw<ClaimRow[]>`
        SELECT id, status, "requestHash", "recoveryPoint", "lockToken",
               "lockedAt", "expiresAt", "responseBody"
        FROM "IdempotencyKey"
        WHERE "userId" = ${userId} AND key = ${key}
        FOR UPDATE
      `;
      const row = rows[0];
      if (!row) {
        throw new ConflictException('Could not claim idempotency key');
      }

      // Same key, different payload: never silently reuse the old response.
      if (row.requestHash !== requestHash) {
        throw new ConflictException(
          'Idempotency key was already used with a different request body',
        );
      }

      const expired = row.expiresAt.getTime() < Date.now();

      // Completed and still within retention → replay the recorded response.
      if (row.status === IdempotencyStatus.COMPLETED && !expired) {
        return { mode: 'CACHED', body: row.responseBody } as Claim;
      }

      // A live attempt by another worker: do not run, wait for it.
      const leaseValid =
        row.lockedAt !== null && Date.now() - row.lockedAt.getTime() < LEASE_MS;
      if (row.status === IdempotencyStatus.STARTED && leaseValid && !expired) {
        return { mode: 'WAIT' } as Claim;
      }

      // Take over (fresh row, FAILED retry, completed-and-expired, or a lease
      // past its deadline). A new lockToken fences the previous attempt.
      const lockToken = randomUUID();
      await tx.idempotencyKey.update({
        where: { userId_key: { userId, key } },
        data: {
          status: IdempotencyStatus.STARTED,
          lockToken,
          lockedAt: new Date(),
          expiresAt,
          responseStatus: null,
          responseBody: Prisma.DbNull,
        },
      });

      return {
        mode: 'RUN',
        lockToken,
        recoveryPoint: row.recoveryPoint,
        id: row.id,
      } as Claim;
    }, CLAIM_TX_OPTIONS);
  }

  // ────────────────────────────────────────────────────────────────────────
  // Run: outside any held lock; recovery points written as short statements.
  // ────────────────────────────────────────────────────────────────────────

  private async run<T>(params: ExecuteParams<T>, claim: Claim & { mode: 'RUN' }): Promise<T> {
    const ctx: RecoveryContext = {
      recoveryPoint: claim.recoveryPoint,
      setRecoveryPoint: async (point: string) => {
        await this.prisma.idempotencyKey.updateMany({
          where: { id: claim.id, lockToken: claim.lockToken },
          data: { recoveryPoint: point },
        });
      },
    };

    try {
      const result = await params.execute(ctx);
      await this.finish(
        claim.id,
        claim.lockToken,
        result,
        params.successStatus ?? 201,
      );
      return result;
    } catch (err) {
      await this.fail(claim.id, claim.lockToken);
      throw err;
    }
  }

  private async finish(
    id: string,
    lockToken: string,
    result: unknown,
    responseStatus: number,
  ): Promise<void> {
    const { count } = await this.prisma.idempotencyKey.updateMany({
      where: { id, lockToken },
      data: {
        status: IdempotencyStatus.COMPLETED,
        responseStatus,
        responseBody: result as Prisma.InputJsonValue,
        recoveryPoint: null,
        lockToken: null,
        lockedAt: null,
      },
    });
    if (count === 0) {
      // Our lease was taken over (fenced). The new attempt owns the result.
      this.logger.warn(`idempotency attempt ${id} was fenced before finishing`);
    }
  }

  private async fail(id: string, lockToken: string): Promise<void> {
    // Preserve the recovery point: a retry may resume from the last checkpoint.
    await this.prisma.idempotencyKey
      .updateMany({
        where: { id, lockToken },
        data: { status: IdempotencyStatus.FAILED, lockToken: null, lockedAt: null },
      })
      .catch(() => undefined);
  }

  private async waitForLoser(
    userId: string,
    key: string,
  ): Promise<unknown | undefined> {
    const deadline = Date.now() + WAIT_MAX_MS;
    while (Date.now() < deadline) {
      await sleep(WAIT_STEP_MS);
      const row = await this.prisma.idempotencyKey.findUnique({
        where: { userId_key: { userId, key } },
        select: { status: true, responseBody: true },
      });
      if (row?.status === IdempotencyStatus.COMPLETED) {
        return row.responseBody ?? undefined;
      }
      if (row?.status === IdempotencyStatus.FAILED) {
        // The winner gave up; this caller should retry the key itself.
        throw new HttpException(
          'The in-flight request failed; retry with the same key',
          HttpStatus.CONFLICT,
        );
      }
    }
    return undefined;
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

function sha256(input: string): string {
  return createHash('sha256').update(input).digest('hex');
}

/** Deterministic JSON: object keys sorted, so equivalent bodies hash equal. */
function stableStringify(value: unknown): string {
  return JSON.stringify(sortValue(value));
}

function sortValue(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortValue);
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const k of Object.keys(value as Record<string, unknown>).sort()) {
      out[k] = sortValue((value as Record<string, unknown>)[k]);
    }
    return out;
  }
  return value;
}
