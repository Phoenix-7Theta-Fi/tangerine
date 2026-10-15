import { Injectable, Logger } from '@nestjs/common';
import { Prisma, SagaStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { MetricsService } from '../metrics/metrics.service';

export interface SagaStep<C> {
  name: string;
  /** The forward action. Throwing triggers compensation. */
  forward(ctx: C): Promise<void>;
  /** Undo for `forward`, run LIFO on failure. Absent = no-op (e.g. notify). */
  compensate?(ctx: C): Promise<void>;
}

export interface SagaDefinition<C> {
  type: string;
  steps: SagaStep<C>[];
  /** Best-effort cleanup after compensation (e.g. cancel an unconfirmed order). */
  onFailure?(ctx: C): Promise<void>;
}

export interface SagaRun {
  id: string;
  sagaType: string;
  status: SagaStatus;
  completedSteps: string[];
  compensationsRun: string[];
}

/**
 * Orchestration-style saga: one owner drives the steps in order, persisting
 * progress to `SagaState` so a long-running checkout is inspectable.
 *
 * On any step failure the completed steps are compensated in LIFO order
 * (the reverse of the order their forward actions committed). Compensation is
 * best-effort and itself idempotent: each compensation maps to an idempotent
 * operation (release, refund, reversing ledger entry), so a retry is safe.
 *
 * Failure injection for tests: when `SAGA_FAILURE_INJECTION=1`, a step whose
 * name equals `ctx.forceFailStep` throws before doing any work.
 */
@Injectable()
export class SagaOrchestrator {
  private readonly logger = new Logger(SagaOrchestrator.name);
  private readonly definitions = new Map<string, SagaDefinition<Record<string, unknown>>>();

  constructor(
    private readonly prisma: PrismaService,
    private readonly metrics: MetricsService,
  ) {}

  register<C extends object>(definition: SagaDefinition<C>): void {
    this.definitions.set(
      definition.type,
      definition as unknown as SagaDefinition<Record<string, unknown>>,
    );
  }

  async start<C extends { forceFailStep?: string }>(
    type: string,
    context: C,
  ): Promise<SagaRun> {
    const def = this.definitions.get(type);
    if (!def) throw new Error(`Unknown saga type: ${type}`);

    const saga = await this.prisma.sagaState.create({
      data: {
        sagaType: type,
        status: SagaStatus.RUNNING,
        completedSteps: [],
        compensationsRun: [],
        context: context as unknown as Prisma.InputJsonValue,
      },
    });

    const completed: string[] = [];
    const compensations: string[] = [];
    const persist = (data: Prisma.SagaStateUpdateInput) =>
      this.prisma.sagaState.update({ where: { id: saga.id }, data });

    try {
      for (const step of def.steps) {
        await persist({ currentStep: step.name });
        if (this.shouldInject(step.name, context)) {
          throw new Error(`injected failure at step "${step.name}"`);
        }
        await step.forward(context);
        completed.push(step.name);
        await persist({ completedSteps: completed });
      }

      await persist({ status: SagaStatus.COMPLETED, currentStep: null });
      this.metrics.sagaRuns.inc({ saga_type: type, status: 'COMPLETED' });
      return {
        id: saga.id,
        sagaType: type,
        status: SagaStatus.COMPLETED,
        completedSteps: completed,
        compensationsRun: compensations,
      };
    } catch (err) {
      this.logger.warn(
        `saga ${saga.id} (${type}) failed after [${completed.join(', ')}]: ${(err as Error).message}`,
      );
      await persist({ status: SagaStatus.COMPENSATING });

      for (const name of [...completed].reverse()) {
        const step = def.steps.find((s) => s.name === name);
        if (!step?.compensate) continue;
        try {
          await step.compensate(context);
          compensations.push(name);
          await persist({ compensationsRun: compensations });
          this.metrics.sagaCompensations.inc({ saga_type: type, step: name });
        } catch (cerr) {
          this.logger.error(
            `compensation "${name}" failed: ${(cerr as Error).message}`,
          );
        }
      }

      if (def.onFailure) {
        try {
          await def.onFailure(context);
        } catch (ferr) {
          this.logger.error(`onFailure failed: ${(ferr as Error).message}`);
        }
      }

      await persist({
        status: SagaStatus.FAILED,
        currentStep: null,
        compensationsRun: compensations,
      });
      this.metrics.sagaRuns.inc({ saga_type: type, status: 'FAILED' });
      return {
        id: saga.id,
        sagaType: type,
        status: SagaStatus.FAILED,
        completedSteps: completed,
        compensationsRun: compensations,
      };
    }
  }

  getState(id: string) {
    return this.prisma.sagaState.findUnique({ where: { id } });
  }

  list(limit = 50) {
    return this.prisma.sagaState.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  private shouldInject(stepName: string, ctx: { forceFailStep?: string }): boolean {
    return (
      process.env.SAGA_FAILURE_INJECTION === '1' &&
      ctx.forceFailStep === stepName
    );
  }
}
