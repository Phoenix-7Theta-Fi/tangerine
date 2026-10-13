import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import type { AppConfig } from '../config/configuration';

@Injectable()
export class FollowService {
  private readonly threshold: number;

  constructor(
    private readonly prisma: PrismaService,
    config: ConfigService<AppConfig, true>,
  ) {
    this.threshold = config.get('celebrityFollowerThreshold', { infer: true });
  }

  async follow(followerId: string, followingId: string) {
    if (followerId === followingId) {
      throw new BadRequestException('You cannot follow yourself');
    }
    const target = await this.prisma.user.findUnique({
      where: { id: followingId },
      select: { id: true },
    });
    if (!target) throw new BadRequestException('User not found');

    try {
      await this.prisma.$transaction(async (tx) => {
        await tx.follow.create({ data: { followerId, followingId } });
        await tx.user.update({
          where: { id: followingId },
          data: { followerCount: { increment: 1 } },
        });
        await tx.user.update({
          where: { id: followerId },
          data: { followingCount: { increment: 1 } },
        });
      });
    } catch (err) {
      // P2002 = already following. Idempotent: fall through and report state.
      if (
        !(err instanceof Prisma.PrismaClientKnownRequestError) ||
        err.code !== 'P2002'
      ) {
        throw err;
      }
    }

    await this.recomputeCelebrity(followingId);
    const count = await this.prisma.user.findUniqueOrThrow({
      where: { id: followingId },
      select: { followerCount: true, isCelebrity: true },
    });
    return { following: true, ...count };
  }

  async unfollow(followerId: string, followingId: string) {
    const existing = await this.prisma.follow.findUnique({
      where: { followerId_followingId: { followerId, followingId } },
    });
    if (existing) {
      await this.prisma.$transaction(async (tx) => {
        await tx.follow.delete({
          where: { followerId_followingId: { followerId, followingId } },
        });
        await tx.user.update({
          where: { id: followingId },
          data: { followerCount: { decrement: 1 } },
        });
        await tx.user.update({
          where: { id: followerId },
          data: { followingCount: { decrement: 1 } },
        });
      });
      await this.recomputeCelebrity(followingId);
    }
    const count = await this.prisma.user.findUniqueOrThrow({
      where: { id: followingId },
      select: { followerCount: true, isCelebrity: true },
    });
    return { following: false, ...count };
  }

  /**
   * Keeps the derived `isCelebrity` flag in sync with the follower count.
   * When an author crosses the threshold their posts stop being fanned out on
   * write and start being pulled at read time (hybrid fan-out).
   */
  private async recomputeCelebrity(userId: string): Promise<void> {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: { followerCount: true, isCelebrity: true },
    });
    const shouldBeCelebrity = user.followerCount >= this.threshold;
    if (shouldBeCelebrity !== user.isCelebrity) {
      await this.prisma.user.update({
        where: { id: userId },
        data: { isCelebrity: shouldBeCelebrity },
      });
    }
  }
}
