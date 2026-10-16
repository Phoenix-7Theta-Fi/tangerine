import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Sex } from '@prisma/client';
import { AuthGuard } from '../common/guards/auth.guard';
import { AuthUser, CurrentUser } from '../common/decorators/current-user.decorator';
import { PrismaService } from '../prisma/prisma.service';
import { AdherenceService } from './adherence.service';
import { ProtocolService } from './protocol.service';
import { ReferenceRangeService } from './reference-range.service';
import { TrendService } from './trend.service';
import { HealthIngestionService } from './health-ingestion.service';
import {
  AdherenceQueryDto,
  IngestAdherenceDto,
  IngestObservationDto,
  ProgressQueryDto,
  TrendQueryDto,
} from './dto/clinical.dto';

const DAY_MS = 86400000;

/**
 * Health-monitoring derivation API. Every endpoint is scoped to the
 * authenticated user (the patient). Nothing here writes: derivations are
 * computed on read from the append-only stores.
 */
@ApiTags('clinical')
@ApiBearerAuth('x-user-id')
@UseGuards(AuthGuard)
@Controller('clinical')
export class ClinicalController {
  constructor(
    private readonly trends: TrendService,
    private readonly adherence: AdherenceService,
    private readonly protocols: ProtocolService,
    private readonly ranges: ReferenceRangeService,
    private readonly prisma: PrismaService,
    private readonly ingestion: HealthIngestionService,
  ) {}

  private requireKey(key: string | undefined): string {
    if (!key || !key.trim()) {
      throw new BadRequestException('idempotency-key header is required');
    }
    return key.trim();
  }

  @Post('ingest/fhir')
  @HttpCode(202)
  @ApiHeader({ name: 'idempotency-key', required: true })
  @ApiOperation({
    summary: 'Ingest a FHIR R4 Bundle (verify, extract, write), exactly-once per key',
  })
  ingestFhir(
    @CurrentUser() user: AuthUser,
    @Headers('idempotency-key') key: string | undefined,
    @Body() bundle: unknown,
  ) {
    return this.ingestion.ingestFhirBundle(user, bundle, this.requireKey(key));
  }

  @Post('observations')
  @HttpCode(202)
  @ApiHeader({ name: 'idempotency-key', required: true })
  @ApiOperation({ summary: 'Ingest a single observation, exactly-once per key' })
  ingestObservation(
    @CurrentUser() user: AuthUser,
    @Headers('idempotency-key') key: string | undefined,
    @Body() dto: IngestObservationDto,
  ) {
    return this.ingestion.ingestObservation(user, dto, this.requireKey(key));
  }

  @Post('adherence-events')
  @HttpCode(202)
  @ApiHeader({ name: 'idempotency-key', required: true })
  @ApiOperation({ summary: 'Ingest a single adherence event, exactly-once per key' })
  ingestAdherence(
    @CurrentUser() user: AuthUser,
    @Headers('idempotency-key') key: string | undefined,
    @Body() dto: IngestAdherenceDto,
  ) {
    return this.ingestion.ingestAdherence(user, dto, this.requireKey(key));
  }

  @Get('trends')
  @ApiOperation({
    summary:
      'Biomarker trends: latest value per code, lookback value, delta, direction, range status',
  })
  getTrends(@CurrentUser() user: AuthUser, @Query() query: TrendQueryDto) {
    return this.trends.trends(user.id, query);
  }

  @Get('protocols')
  @ApiOperation({ summary: 'Protocols (care plans) and their expected schedule for the patient' })
  getProtocols(@CurrentUser() user: AuthUser) {
    return this.protocols.list(user.id);
  }

  @Get('protocols/:id/progress')
  @ApiOperation({ summary: 'Protocol progress: completion %, current phase, next milestone' })
  getProgress(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Query() query: ProgressQueryDto,
  ) {
    return this.protocols.progress(user.id, id, query);
  }

  @Get('adherence')
  @ApiOperation({
    summary: 'Adherence rate per protocol item, distinguishing not-logged from missed',
  })
  getAdherence(@CurrentUser() user: AuthUser, @Query() query: AdherenceQueryDto) {
    return this.adherence.adherence(user.id, query);
  }

  @Get('observations/:id/range')
  @ApiOperation({
    summary: 'Resolve the reference range for one observation by patient demographics',
  })
  async getObservationRange(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    const obs = await this.prisma.observation.findFirst({ where: { id, patientId: user.id } });
    if (!obs) throw new NotFoundException(`Observation ${id} not found for patient`);
    const profile = await this.prisma.patientProfile.findUnique({ where: { userId: user.id } });
    if (!profile) throw new NotFoundException(`No patient profile for user ${user.id}`);
    const ageDays = Math.floor((obs.effectiveAt.getTime() - profile.birthDate.getTime()) / DAY_MS);
    const range = await this.ranges.resolve({
      code: obs.code,
      unit: obs.valueUnit,
      sex: (profile.sex as Sex) ?? Sex.UNKNOWN,
      ageDays,
      at: obs.effectiveAt,
    });
    return {
      observationId: obs.id,
      code: obs.code,
      display: obs.display,
      value: obs.valueNumeric,
      unit: obs.valueUnit,
      effectiveAt: obs.effectiveAt,
      rangeStatus: this.ranges.classify(obs.valueNumeric, range),
      range,
    };
  }
}
