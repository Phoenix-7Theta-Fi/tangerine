import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../common/guards/auth.guard';
import { AuthUser, CurrentUser } from '../common/decorators/current-user.decorator';
import { SchedulingService } from './scheduling.service';
import {
  CancelBookingDto,
  CreateBookingDto,
  CreateHoldDto,
  CreateSessionTypeDto,
  ListBookingsQueryDto,
  OpenSlotsQueryDto,
  RescheduleBookingDto,
  SetAvailabilityDto,
} from './dto/scheduling.dto';

@ApiTags('scheduling')
@ApiBearerAuth('x-user-id')
@UseGuards(AuthGuard)
@Controller()
export class SchedulingController {
  constructor(private readonly scheduling: SchedulingService) {}

  // ── Catalog ─────────────────────────────────────────────────────────
  @Post('session-types')
  @ApiOperation({ summary: 'Create a session type (practitioner)' })
  createSessionType(
    @CurrentUser() user: AuthUser,
    @Body() dto: CreateSessionTypeDto,
  ) {
    return this.scheduling.createSessionType(user.id, dto);
  }

  @Get('session-types')
  @ApiOperation({ summary: 'List active session types' })
  listSessionTypes(@Query('practitionerId') practitionerId?: string) {
    return this.scheduling.listSessionTypes(practitionerId);
  }

  // ── Availability ────────────────────────────────────────────────────
  @Put('practitioners/me/availability')
  @ApiOperation({ summary: 'Replace my recurring weekly availability' })
  setMyAvailability(
    @CurrentUser() user: AuthUser,
    @Body() dto: SetAvailabilityDto,
  ) {
    return this.scheduling.setAvailability(user.id, dto);
  }

  @Get('practitioners/me/availability')
  getMyAvailability(@CurrentUser() user: AuthUser) {
    return this.scheduling.getAvailability(user.id);
  }

  // ── Slot lookup ─────────────────────────────────────────────────────
  @Get('practitioners/:practitionerId/slots')
  @ApiOperation({
    summary: 'Open slots for a date range (availability minus live reservations)',
  })
  slots(
    @Param('practitionerId') practitionerId: string,
    @Query() query: OpenSlotsQueryDto,
  ) {
    return this.scheduling.listOpenSlots({ practitionerId, query });
  }

  // ── Bookings ────────────────────────────────────────────────────────
  @Post('bookings')
  @ApiOperation({ summary: 'Create a booking (conflict-safe, idempotent)' })
  createBooking(@CurrentUser() user: AuthUser, @Body() dto: CreateBookingDto) {
    return this.scheduling.createBooking(user.id, dto);
  }

  @Get('bookings')
  @ApiOperation({ summary: 'List my bookings (as member, practitioner, or both)' })
  listBookings(
    @CurrentUser() user: AuthUser,
    @Query() query: ListBookingsQueryDto,
  ) {
    return this.scheduling.listBookings({
      userId: user.id,
      as: query.as,
      from: query.from,
      to: query.to,
      limit: query.limit,
    });
  }

  @Post('bookings/:id/reschedule')
  @ApiOperation({ summary: 'Reschedule a booking (idempotent on clientOpId)' })
  reschedule(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: RescheduleBookingDto,
  ) {
    return this.scheduling.reschedule(user.id, id, dto);
  }

  @Post('bookings/:id/cancel')
  @ApiOperation({ summary: 'Cancel a booking (idempotent on clientOpId)' })
  cancel(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: CancelBookingDto,
  ) {
    return this.scheduling.cancel(user.id, id, dto);
  }

  // ── Holds ───────────────────────────────────────────────────────────
  @Post('holds')
  @ApiOperation({ summary: 'Create an expiring soft hold on a slot' })
  createHold(@CurrentUser() user: AuthUser, @Body() dto: CreateHoldDto) {
    return this.scheduling.createHold(user.id, dto);
  }

  @Delete('holds/:id')
  @ApiOperation({ summary: 'Release a hold early' })
  releaseHold(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.scheduling.cancel(user.id, id, { reason: 'released' });
  }
}
