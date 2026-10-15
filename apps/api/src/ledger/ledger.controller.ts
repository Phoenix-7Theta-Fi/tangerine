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
  constructor(private readonly ledger: LedgerService) {}

  @Post('transactions')
  @ApiOperation({
    summary: 'Post one balanced double-entry transaction (idempotent on source)',
  })
  post(@Body() dto: PostTransactionDto) {
    return this.ledger.postTransaction({
      kind: dto.kind,
      sourceType: dto.sourceType,
      sourceId: dto.sourceId,
      description: dto.description,
      postings: dto.postings,
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
