import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import type { AppConfig } from '../config/configuration';

export interface PostCreated {
  id: string;
  authorId: string;
  createdAt: Date;
  authorIsCelebrity: boolean;
}

export interface TimelineEntry {
  postId: string;
  score: number;
}

/**
 * Owns the materialized timeline layer in Redis.
 *
 * Home timelines are Redis sorted sets keyed `timeline:{userId}`, scored by the
 * post's creation epoch-ms. Each entry is a bare *pointer* (post id), never a
 * copy of the post body — edit/delete and counter changes then don't require
 * rewriting millions of timelines. Post content is hydrated at read time.
 *
 * Fan-out is hybrid:
 *   - normal authors  -> pushed into every follower's timeline on write (O(1) reads)
 *   - celebrity authors -> skipped, their own outbox is pulled at read time
 * This keeps the read path cheap without letting a single high-follower
 * practitioner turn one post into millions of writes.
 */
@Injectable()
export class TimelineService {
  private readonly logger = new Logger(TimelineService.name);
  private readonly maxLength: number;

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    config: ConfigService<AppConfig, true>,
  ) {
    this.maxLength = config.get('timelineMaxLength', { infer: true });
  }

  private key(userId: string): string {
    return `timeline:${userId}`;
  }

  /**
   * Called after a post row is committed. Fans the post out to followers unless
   * the author is over the celebrity threshold. Symmetric multi-writer
   * token-bucket: pipelined ZADD + trim in one round trip.
   */
  async fanoutPost(post: PostCreated): Promise<{ pushed: number; celebrity: boolean }> {
    const score = post.createdAt.getTime();

    // The author's own outbox is always materialized: it backs profile views
    // and the read-time pull for celebrity authors.
    const pipeline = this.redis.client.pipeline();
    pipeline.zadd(this.key(post.authorId), score, post.id);
    pipeline.zremrangebyrank(this.key(post.authorId), 0, -(this.maxLength + 1));

    if (post.authorIsCelebrity) {
      await pipeline.exec();
      this.logger.debug(`Skipped fan-out for celebrity ${post.authorId}`);
      return { pushed: 0, celebrity: true };
    }

    const followers = await this.prisma.follow.findMany({
      where: { followingId: post.authorId },
      select: { followerId: true },
    });

    for (const { followerId } of followers) {
      pipeline.zadd(this.key(followerId), score, post.id);
      pipeline.zremrangebyrank(this.key(followerId), 0, -(this.maxLength + 1));
    }
    await pipeline.exec();

    return { pushed: followers.length, celebrity: false };
  }

  /**
   * Reads pushed timeline entries strictly older than the cursor.
   * Returns newest-first.
   */
  async getPushedEntries(
    userId: string,
    cursor: { score: number; id: string } | null,
    take: number,
  ): Promise<TimelineEntry[]> {
    const max = cursor ? cursor.score : '+inf';
    const raw = (await this.redis.client.zrevrangebyscore(
      this.key(userId),
      max,
      '-inf',
      'WITHSCORES',
      'LIMIT',
      0,
      take,
    )) as string[];

    const entries: TimelineEntry[] = [];
    for (let i = 0; i < raw.length; i += 2) {
      entries.push({ postId: raw[i], score: Number(raw[i + 1]) });
    }
    // Keyset tie-break: at the exact cursor score, drop ids that aren't
    // strictly less than the cursor id (lexicographic, matching member order).
    if (cursor) {
      return entries.filter(
        (e) => e.score < cursor.score || (e.score === cursor.score && e.postId < cursor.id),
      );
    }
    return entries;
  }

  async clearTimeline(userId: string): Promise<void> {
    await this.redis.client.del(this.key(userId));
  }
}
