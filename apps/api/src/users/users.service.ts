import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { decodeCursor, encodeCursor } from '../common/cursor';
import { Page } from '../common/dto/pagination.dto';

export interface UserSummary {
  id: string;
  handle: string;
  displayName: string;
  avatarUrl: string | null;
  role: Role;
  headline: string | null;
  region: string | null;
  isCelebrity: boolean;
  online?: boolean;
}

export interface UserProfile extends UserSummary {
  bio: string | null;
  verified: boolean;
  followerCount: number;
  followingCount: number;
  postCount: number;
  isFollowing: boolean;
  isSelf: boolean;
}

const SUMMARY_SELECT = {
  id: true,
  handle: true,
  displayName: true,
  avatarUrl: true,
  role: true,
  headline: true,
  region: true,
  isCelebrity: true,
} satisfies Prisma.UserSelect;

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  async search(params: {
    viewerId: string;
    q?: string;
    role?: Role;
    cursor?: string;
    limit: number;
  }): Promise<Page<UserSummary & { isFollowing: boolean }>> {
    const { viewerId, q, role, cursor, limit } = params;
    const decoded = decodeCursor(cursor);

    // Keyset pagination over (followerCount DESC, id ASC).
    const keyset: Prisma.UserWhereInput | undefined = decoded
      ? {
          OR: [
            { followerCount: { lt: Number(decoded[0]) } },
            {
              followerCount: Number(decoded[0]),
              id: { gt: decoded[1] },
            },
          ],
        }
      : undefined;

    const where: Prisma.UserWhereInput = {
      ...(role ? { role } : {}),
      ...(q
        ? {
            OR: [
              { handle: { contains: q, mode: 'insensitive' } },
              { displayName: { contains: q, mode: 'insensitive' } },
              { headline: { contains: q, mode: 'insensitive' } },
            ],
          }
        : {}),
      ...(keyset ? { AND: [keyset] } : {}),
    };

    const rows = await this.prisma.user.findMany({
      where,
      select: { ...SUMMARY_SELECT, followerCount: true },
      orderBy: [{ followerCount: 'desc' }, { id: 'asc' }],
      take: limit + 1,
    });

    const following = await this.followingSet(
      viewerId,
      rows.map((r) => r.id),
    );
    const presence = await this.presenceMap(rows.map((r) => r.id));

    const hasMore = rows.length > limit;
    const items = (hasMore ? rows.slice(0, limit) : rows).map((r) => ({
      id: r.id,
      handle: r.handle,
      displayName: r.displayName,
      avatarUrl: r.avatarUrl,
      role: r.role,
      headline: r.headline,
      region: r.region,
      isCelebrity: r.isCelebrity,
      online: presence.get(r.id) ?? false,
      isFollowing: following.has(r.id),
    }));

    return {
      items,
      nextCursor: hasMore
        ? encodeCursor([rows[limit - 1].followerCount, rows[limit - 1].id])
        : null,
    };
  }

  async getProfile(id: string, viewerId: string): Promise<UserProfile> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        ...SUMMARY_SELECT,
        bio: true,
        verified: true,
        followerCount: true,
        followingCount: true,
        _count: { select: { posts: true } },
      },
    });
    if (!user) throw new NotFoundException('User not found');

    const [following, presence] = await Promise.all([
      this.followingSet(viewerId, [id]),
      this.presenceMap([id]),
    ]);

    return {
      id: user.id,
      handle: user.handle,
      displayName: user.displayName,
      avatarUrl: user.avatarUrl,
      role: user.role,
      headline: user.headline,
      region: user.region,
      isCelebrity: user.isCelebrity,
      bio: user.bio,
      verified: user.verified,
      followerCount: user.followerCount,
      followingCount: user.followingCount,
      postCount: user._count.posts,
      isFollowing: following.has(id),
      isSelf: viewerId === id,
      online: presence.get(id) ?? false,
    };
  }

  async followingSet(
    viewerId: string,
    ids: string[],
  ): Promise<Set<string>> {
    if (ids.length === 0) return new Set();
    const rows = await this.prisma.follow.findMany({
      where: { followerId: viewerId, followingId: { in: ids } },
      select: { followingId: true },
    });
    return new Set(rows.map((r) => r.followingId));
  }

  async presenceMap(ids: string[]): Promise<Map<string, boolean>> {
    if (ids.length === 0) return new Map();
    const keys = ids.map((id) => `presence:${id}`);
    const values = await this.redis.client.mget(...keys);
    const map = new Map<string, boolean>();
    ids.forEach((id, i) => map.set(id, values[i] !== null));
    return map;
  }

  /** Ids of everyone `userId` follows. */
  async followeeIds(userId: string): Promise<string[]> {
    const rows = await this.prisma.follow.findMany({
      where: { followerId: userId },
      select: { followingId: true },
    });
    return rows.map((r) => r.followingId);
  }
}
