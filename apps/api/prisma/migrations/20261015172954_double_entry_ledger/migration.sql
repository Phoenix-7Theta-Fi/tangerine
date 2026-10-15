-- CreateEnum
CREATE TYPE "LedgerDirection" AS ENUM ('DEBIT', 'CREDIT');

-- CreateEnum
CREATE TYPE "LedgerTransactionKind" AS ENUM ('CHARGE', 'REFUND', 'PAYOUT', 'PLATFORM_FEE', 'ESCROW_HOLD', 'ESCROW_RELEASE');

-- CreateTable
CREATE TABLE "LedgerTransaction" (
    "id" TEXT NOT NULL,
    "seq" SERIAL NOT NULL,
    "kind" "LedgerTransactionKind" NOT NULL,
    "sourceType" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "previousHash" TEXT,
    "hash" TEXT NOT NULL,

    CONSTRAINT "LedgerTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LedgerPosting" (
    "id" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "direction" "LedgerDirection" NOT NULL,
    "amountCents" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LedgerPosting_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LedgerTransaction_seq_key" ON "LedgerTransaction"("seq");

-- CreateIndex
CREATE INDEX "LedgerTransaction_kind_createdAt_idx" ON "LedgerTransaction"("kind", "createdAt");

-- CreateIndex
CREATE INDEX "LedgerTransaction_createdAt_idx" ON "LedgerTransaction"("createdAt");

-- CreateIndex
CREATE INDEX "LedgerTransaction_sourceId_idx" ON "LedgerTransaction"("sourceId");

-- CreateIndex
CREATE UNIQUE INDEX "LedgerTransaction_sourceType_sourceId_kind_key" ON "LedgerTransaction"("sourceType", "sourceId", "kind");

-- CreateIndex
CREATE INDEX "LedgerPosting_accountId_currency_idx" ON "LedgerPosting"("accountId", "currency");

-- CreateIndex
CREATE INDEX "LedgerPosting_transactionId_idx" ON "LedgerPosting"("transactionId");

-- AddForeignKey
ALTER TABLE "LedgerPosting" ADD CONSTRAINT "LedgerPosting_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "LedgerTransaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- ───────────────────────────────────────────────────────────────────────────
-- Append-only enforcement.
--
-- The ledger is the system of record; history is immutable. A BEFORE
-- UPDATE OR DELETE trigger raises for every row on both tables, regardless of
-- the role issuing the statement. This is the real guarantee: revoked grants
-- (below) do not stop the table owner or a superuser, but a trigger does.
-- ───────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION ledger_reject_mutation() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION 'ledger tables are append-only: % on % is not permitted',
    TG_OP, TG_TABLE_NAME
    USING ERRCODE = 'restrict_violation';
END;
$$;

CREATE TRIGGER "LedgerTransaction_append_only"
  BEFORE UPDATE OR DELETE ON "LedgerTransaction"
  FOR EACH ROW EXECUTE FUNCTION ledger_reject_mutation();

CREATE TRIGGER "LedgerPosting_append_only"
  BEFORE UPDATE OR DELETE ON "LedgerPosting"
  FOR EACH ROW EXECUTE FUNCTION ledger_reject_mutation();

-- ───────────────────────────────────────────────────────────────────────────
-- Balanced-transaction invariant, enforced at COMMIT.
--
-- Every LedgerTransaction must have SUM(DEBIT) - SUM(CREDIT) = 0 across its
-- postings. The check is a DEFERRABLE INITIALLY DEFERRED constraint trigger,
-- so it runs at the end of the inserting transaction — after the service has
-- inserted every leg of the double entry. It raises SQLSTATE 23514
-- (check_violation) otherwise, aborting the whole transaction.
--
-- Constraint triggers must be AFTER ROW, so the function aggregates over the
-- affected transaction rather than reading a transition table.
-- ───────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION ledger_assert_balanced() RETURNS trigger
LANGUAGE plpgsql AS $$
DECLARE
  imbalance bigint;
BEGIN
  SELECT COALESCE(SUM(CASE WHEN "direction" = 'DEBIT' THEN "amountCents"
                                                   ELSE -"amountCents" END), 0)
    INTO imbalance
    FROM "LedgerPosting"
   WHERE "transactionId" = NEW."transactionId";

  IF imbalance <> 0 THEN
    RAISE EXCEPTION 'ledger transaction % is unbalanced by % cents',
      NEW."transactionId", imbalance
      USING ERRCODE = 'check_violation';
  END IF;

  RETURN NULL;
END;
$$;

CREATE CONSTRAINT TRIGGER "LedgerPosting_balanced"
  AFTER INSERT ON "LedgerPosting"
  DEFERRABLE INITIALLY DEFERRED
  FOR EACH ROW
  EXECUTE FUNCTION ledger_assert_balanced();

-- Defense in depth: strip UPDATE/DELETE from PUBLIC. The trigger above remains
-- the authoritative guard (owners and superusers bypass grants).
REVOKE UPDATE, DELETE ON "LedgerTransaction" FROM PUBLIC;
REVOKE UPDATE, DELETE ON "LedgerPosting" FROM PUBLIC;
