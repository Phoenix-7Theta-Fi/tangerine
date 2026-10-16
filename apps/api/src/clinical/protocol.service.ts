import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

const DAY_MS = 86400000;
const round2 = (n: number) => Math.round(n * 100) / 100;

export interface MilestoneProgress {
  id: string;
  orderIndex: number;
  name: string;
  phase: string;
  dueAt: Date;
  requiredCumulativeTaken: number;
  met: boolean;
}

export interface ProtocolProgress {
  protocolId: string;
  name: string;
  completionPercentage: number;
  currentPhase: string | null;
  nextMilestone: MilestoneProgress | null;
  takenTotal: number;
  expectedTotal: number;
  daysElapsed: number;
  milestones: MilestoneProgress[];
}

/**
 * Protocol progress: completion percentage (logged events vs the schedule
 * expected up to the reference time), the current phase, and the next unmet
 * milestone. All three are derived — nothing is stored.
 */
@Injectable()
export class ProtocolService {
  constructor(private readonly prisma: PrismaService) {}

  async progress(
    patientId: string,
    protocolId: string,
    opts: { asOf?: string },
  ): Promise<ProtocolProgress> {
    const at = opts.asOf ? new Date(opts.asOf) : new Date();
    const protocol = await this.prisma.protocol.findFirst({
      where: { id: protocolId, patientId },
      include: { items: true, milestones: { orderBy: { orderIndex: 'asc' } } },
    });
    if (!protocol) throw new NotFoundException(`Protocol ${protocolId} not found for patient`);

    const startAt = protocol.startAt;
    const endAt = protocol.endAt && protocol.endAt < at ? protocol.endAt : at;
    const daysElapsed = Math.max(0, (endAt.getTime() - startAt.getTime()) / DAY_MS);

    const activeItems = protocol.items.filter((i) => i.active);
    const expectedPerDay = activeItems.reduce((s, i) => s + i.expectedPerDay, 0);
    const expectedTotal = expectedPerDay * daysElapsed;

    const keys = activeItems.map((i) => i.key);
    const types = [...new Set(activeItems.map((i) => i.adherenceType))];
    const takenTotal = keys.length
      ? await this.prisma.adherenceEvent.count({
          where: {
            patientId,
            protocolItemKey: { in: keys },
            type: { in: types },
            occurredAt: { gte: startAt, lte: endAt },
          },
        })
      : 0;

    const completionPercentage =
      expectedTotal > 0 ? Math.min(100, round2((takenTotal / expectedTotal) * 100)) : 0;

    const milestones: MilestoneProgress[] = protocol.milestones.map((m) => ({
      id: m.id,
      orderIndex: m.orderIndex,
      name: m.name,
      phase: m.phase,
      dueAt: m.dueAt,
      requiredCumulativeTaken: m.requiredCumulativeTaken,
      met: takenTotal >= m.requiredCumulativeTaken,
    }));
    const nextMilestone = milestones.find((m) => !m.met) ?? null;
    // You are "in" the phase of the milestone you are working toward; once all
    // are met you are in the final phase.
    const currentPhase =
      nextMilestone?.phase ?? milestones.at(-1)?.phase ?? activeItems[0]?.phase ?? null;

    return {
      protocolId: protocol.id,
      name: protocol.name,
      completionPercentage,
      currentPhase,
      nextMilestone,
      takenTotal,
      expectedTotal: round2(expectedTotal),
      daysElapsed: round2(daysElapsed),
      milestones,
    };
  }

  async list(patientId: string) {
    return this.prisma.protocol.findMany({
      where: { patientId },
      include: { items: true, milestones: { orderBy: { orderIndex: 'asc' } } },
      orderBy: { createdAt: 'asc' },
    });
  }
}
