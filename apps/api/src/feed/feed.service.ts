import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { PostsService, PostDto, PostWithAuthor } from '../posts/posts.service';
import { TimelineService, TimelineEntry } from '../timeline/timeline.service';
import { decodeCursor, encodeCursor } from '../common/cursor';
import { Page } from '../common/dto/pagination.dto';

interface Cursor {
  createdAtMs: number;
  id: string;
}

/**
 * Assembles a user's home feed from two sources:
 *   1. the materialized Redis timeline (posts pushed by normal authors), and
 *   2. a read-time pull of the celebrity authors the user follows.
 *
 * The two sets are merged, de-duplicated, and returned newest-first behind an
 * opaque keyset cursor. A cold cache (or a brand-new follow) falls back to a
 * bounded read-time backfill straight from Postgres — slower, but never empty,
 * which is the graceful-degradation story we'd want in production.
 */
@Injectable()
export class FeedService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly timeline: TimelineService,
    private readonly posts: PostsService,
    private readonly users: UsersService,
  ) {}

  async getHomeFeed(params: {
    viewerId: string;
    cursor?: string;
    limit: number;
  }): Promise<Page<PostDto>> {
    const { viewerId, cursor, limit } = params;
    const decoded = decodeCursor(cursor);
    const cursorObj: Cursor | null = decoded
      ? { createdAtMs: Number(decoded[0]), id: decoded[1] }
      : null;

    const buffer = Math.max(limit * 3, 30);
    const followees = await this.users.followeeIds(viewerId);
    const celebrityFollowees = await this.celebrityFollowees(followees);

    // 1) Pushed timelines (normal authors + the viewer's own posts).
    const pushed = await this.timeline.getPushedEntries(
      viewerId,
      cursorObj
        ? { score: cursorObj.createdAtMs, id: cursorObj.id }
        : null,
      buffer,
    );

    // 2) Read-time pull from celebrity authors (kept bounded — a user follows
    //    only a handful of high-follower accounts).
    const celebEntries: TimelineEntry[] = [];
    for (const celebId of celebrityFollowees) {
      const entries = await this.timeline.getPushedEntries(
        celebId,
        cursorObj ? { score: cursorObj.createdAtMs, id: cursorObj.id } : null,
        Math.min(limit, 10),
      );
      celebEntries.push(...entries);
    }

    const candidateIds = new Set<string>([
      ...pushed.map((e) => e.postId),
      ...celebEntries.map((e) => e.postId),
    ]);

    // Cold start / stale cache: backfill from every followee + self.
    if (!cursorObj && candidateIds.size < limit && followees.length > 0) {
      const backfill = await this.prisma.post.findMany({
        where: { authorId: { in: [...followees, viewerId] } },
        select: { id: true },
        orderBy: { createdAt: 'desc' },
        take: limit * 3,
      });
      for (const row of backfill) candidateIds.add(row.id);
    }

    const hydrated = await this.posts.hydrateIds([...candidateIds]);

    const ordered = hydrated
      .sort(comparePostsDesc)
      .filter((p) => (cursorObj ? isOlderThan(p, cursorObj) : true));

    const hasMore = ordered.length > limit;
    const pageRows = hasMore ? ordered.slice(0, limit) : ordered;
    const items = await this.posts.serializeMany(pageRows, viewerId);

    const last = pageRows[pageRows.length - 1];
    return {
      items,
      nextCursor:
        hasMore && last
          ? encodeCursor([last.createdAt.getTime(), last.id])
          : null,
    };
  }

  private async celebrityFollowees(followeeIds: string[]): Promise<string[]> {
    if (followeeIds.length === 0) return [];
    const rows = await this.prisma.user.findMany({
      where: { id: { in: followeeIds }, isCelebrity: true },
      select: { id: true },
    });
    return rows.map((r) => r.id);
  }
}

function comparePostsDesc(a: PostWithAuthor, b: PostWithAuthor): number {
  const t = b.createdAt.getTime() - a.createdAt.getTime();
  if (t !== 0) return t;
  return b.id < a.id ? -1 : b.id > a.id ? 1 : 0;
}

function isOlderThan(post: PostWithAuthor, cursor: Cursor): boolean {
  const t = post.createdAt.getTime();
  if (t !== cursor.createdAtMs) return t < cursor.createdAtMs;
  return post.id < cursor.id;
}
