import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../common/guards/auth.guard';
import { AuthUser, CurrentUser } from '../common/decorators/current-user.decorator';
import { IdempotencyService } from '../idempotency/idempotency.service';
import { LedgerService } from './ledger.service';
import {
  ListLedgerTransactionsQueryDto,
  PostTransactionDto,
} from './dto/ledger.dto';

@ApiTags('ledger')
@ApiBearerAuth('x-user-id')
@UseGuards(AuthGuard)
@Controller('ledger')
export class LedgerController {
  constructor(
    private readonly ledger: LedgerService,
    private readonly idempotency: IdempotencyService,
  ) {}

  @Post('transactions')
  @ApiOperation({
    summary:
      'Post one balanced double-entry transaction (exactly-once via idempotency key)',
  })
  post(@CurrentUser() user: AuthUser, @Body() dto: PostTransactionDto) {
    const key = IdempotencyService.ledgerKey(
      dto.sourceType,
      dto.sourceId,
      dto.kind,
    );
    return this.idempotency.execute({
      userId: user.id,
      key,
      request: dto,
      action: 'ledger',
      execute: async (ctx) => {
        // Recovery point #1: durable before the side effect, so a retry after a
        // crash knows the ledger write may or may not have happened. The write
        // itself is idempotent on (sourceType, sourceId, kind), so re-running is
        // safe.
        if (ctx.recoveryPoint === null) {
          await ctx.setRecoveryPoint('ledger.before-post');
        }

        // Test-only crash injection (Phase 2 recovery test). Env-gated and
        // confined to source ids prefixed "crash:"; absent in production.
        if (
          process.env.IDEMPOTENCY_CRASH_TEST === '1' &&
          dto.sourceId.startsWith('crash:') &&
          ctx.recoveryPoint === null
        ) {
          throw new Error('simulated crash before ledger write');
        }

        const tx = await this.ledger.postTransaction({
          kind: dto.kind,
          sourceType: dto.sourceType,
          sourceId: dto.sourceId,
          description: dto.description,
          postings: dto.postings,
        });
        await ctx.setRecoveryPoint('ledger.posted');
        return tx;
      },
    });
  }

  @Get('transactions')
  @ApiOperation({ summary: 'List ledger transactions (newest first)' })
  list(@Query() query: ListLedgerTransactionsQueryDto) {
    return this.ledger.listTransactions(query);
  }

  @Get('accounts/:accountId/balance')
  @ApiOperation({ summary: 'Derived balance for one account (never stored)' })
  balance(
    @Param('accountId') accountId: string,
    @Query('currency') currency?: string,
  ) {
    return this.ledger.getBalance(accountId, currency ?? 'USD');
  }

  @Get('verify')
  @ApiOperation({ summary: 'Verify the hash chain end to end' })
  verify() {
    return this.ledger.verifyIntegrity();
  }
}
