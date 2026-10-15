import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../common/guards/auth.guard';
import { AuthUser, CurrentUser } from '../common/decorators/current-user.decorator';
import { CheckoutSagaService } from './checkout-saga.service';
import { SagaOrchestrator } from './saga.service';
import { CheckoutDto } from './dto/saga.dto';

@ApiTags('sagas')
@ApiBearerAuth('x-user-id')
@UseGuards(AuthGuard)
@Controller('sagas')
export class SagaController {
  constructor(
    private readonly checkoutSaga: CheckoutSagaService,
    private readonly orchestrator: SagaOrchestrator,
  ) {}

  @Post('checkout')
  @ApiOperation({ summary: 'Run the checkout saga for an order' })
  checkout(@CurrentUser() user: AuthUser, @Body() dto: CheckoutDto) {
    return this.checkoutSaga.checkout(user.id, dto.orderId, dto.forceFailStep);
  }

  @Get()
  @ApiOperation({ summary: 'List recent sagas' })
  list() {
    return this.orchestrator.list();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Fetch one saga state' })
  get(@Param('id') id: string) {
    return this.orchestrator.getState(id);
  }
}
