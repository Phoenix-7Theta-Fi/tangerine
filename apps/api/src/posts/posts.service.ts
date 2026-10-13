import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { TimelineService } from '../timeline/timeline.service';
import { decodeCursor, encodeCursor } from '../common/cursor';
import { Page } from '../common/dto/pagination.dto';

export const POST_INCLUDE = {
  author: {
    select: {
      id: true,
      handle: true,
      displayName: true,
      avatarUrl: true,
      role: true,
      headline: true,
      isCelebrity: true,
    },
  },
} satisfies Prisma.PostInclude;

export type PostWithAuthor = Prisma.PostGetPayload<{ include: typeof POST_INCLUDE }>;

export interface PostDto {
  id: string;
  body: string;
  mediaUrl: string | null;
  createdAt: Date;
  author: PostWithAuthor['author'];
  likeCount: number;
  commentCount: number;
  shareCount: number;
  liked: boolean;
}

@Injectable()
export class PostsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly timeline: TimelineService,
  ) {}

  async create(params: {
    authorId: string;
    body: string;
    mediaUrl?: string;
  }): Promise<PostDto> {
    const post = await this.prisma.post.create({
      data: {
        authorId: params.authorId,
        body: params.body,
        mediaUrl: params.mediaUrl,
      },
      include: POST_INCLUDE,
    });

    // Write-time fan-out. Kept synchronous here for clarity; in production this
    // is a transactional-outbox row consumed by a fan-out worker so the post
    // write never blocks on follower count.
    await this.timeline.fanoutPost({
      id: post.id,
      authorId: post.authorId,
      createdAt: post.createdAt,
      authorIsCelebrity: post.author.isCelebrity,
    });

    return this.serialize(post, params.authorId);
  }

  async listByAuthor(params: {
    authorId: string;
    viewerId: string;
    cursor?: string;
    limit: number;
  }): Promise<Page<PostDto>> {
    const { authorId, viewerId, cursor, limit } = params;
    const decoded = decodeCursor(cursor);
    const cursorDate = decoded ? new Date(Number(decoded[0])) : null;

    const where: Prisma.PostWhereInput = {
      authorId,
      ...(cursorDate
        ? {
            OR: [
              { createdAt: { lt: cursorDate } },
              { createdAt: cursorDate, id: { lt: decoded![1] } },
            ],
          }
        : {}),
    };

    const rows = await this.prisma.post.findMany({
      where,
      include: POST_INCLUDE,
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      take: limit + 1,
    });

    const hasMore = rows.length > limit;
    const pageRows = hasMore ? rows.slice(0, limit) : rows;
    const items = await this.serializeMany(pageRows, viewerId);

    return {
      items,
      nextCursor: hasMore
        ? encodeCursor([
            pageRows[pageRows.length - 1].createdAt.getTime(),
            pageRows[pageRows.length - 1].id,
          ])
        : null,
    };
  }

  async getPost(id: string, viewerId: string): Promise<PostDto> {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: POST_INCLUDE,
    });
    if (!post) throw new NotFoundException('Post not found');
    return this.serialize(post, viewerId);
  }

  async remove(id: string, viewerId: string): Promise<void> {
    const post = await this.prisma.post.findUnique({
      where: { id },
      select: { authorId: true },
    });
    if (!post) throw new NotFoundException('Post not found');
    if (post.authorId !== viewerId) {
      throw new ForbiddenException('You can only delete your own posts');
    }
    await this.prisma.post.delete({ where: { id } });
  }

  async like(postId: string, userId: string): Promise<{ liked: boolean; likeCount: number }> {
    await this.prisma
      .$transaction(async (tx) => {
        await tx.like.create({ data: { postId, userId } });
        await tx.post.update({
          where: { id: postId },
          data: { likeCount: { increment: 1 } },
        });
      })
      .catch((err) => {
        // Idempotent double-tap: already liked is not an error.
        if (
          err instanceof Prisma.PrismaClientKnownRequestError &&
          err.code === 'P2002'
        ) {
          return;
        }
        throw err;
      });
    return this.likeState(postId, userId);
  }

  async unlike(postId: string, userId: string): Promise<{ liked: boolean; likeCount: number }> {
    const existing = await this.prisma.like.findUnique({
      where: { postId_userId: { postId, userId } },
    });
    if (existing) {
      await this.prisma.$transaction(async (tx) => {
        await tx.like.delete({ where: { id: existing.id } });
        await tx.post.update({
          where: { id: postId },
          data: { likeCount: { decrement: 1 } },
        });
      });
    }
    return this.likeState(postId, userId);
  }

  private async likeState(postId: string, userId: string) {
    const [post, like] = await Promise.all([
      this.prisma.post.findUniqueOrThrow({
        where: { id: postId },
        select: { likeCount: true },
      }),
      this.prisma.like.findUnique({
        where: { postId_userId: { postId, userId } },
      }),
    ]);
    return { liked: !!like, likeCount: post.likeCount };
  }

  async addComment(params: { postId: string; authorId: string; body: string }) {
    const post = await this.prisma.post.findUnique({
      where: { id: params.postId },
      select: { id: true },
    });
    if (!post) throw new NotFoundException('Post not found');

    const [comment] = await this.prisma.$transaction([
      this.prisma.comment.create({
        data: {
          postId: params.postId,
          authorId: params.authorId,
          body: params.body,
        },
        include: {
          author: {
            select: { id: true, handle: true, displayName: true, avatarUrl: true },
          },
        },
      }),
      this.prisma.post.update({
        where: { id: params.postId },
        data: { commentCount: { increment: 1 } },
      }),
    ]);
    return comment;
  }

  async listComments(postId: string, limit = 50) {
    return this.prisma.comment.findMany({
      where: { postId },
      include: {
        author: {
          select: { id: true, handle: true, displayName: true, avatarUrl: true },
        },
      },
      orderBy: { createdAt: 'asc' },
      take: limit,
    });
  }

  async serializeMany(posts: PostWithAuthor[], viewerId: string): Promise<PostDto[]> {
    if (posts.length === 0) return [];
    const liked = await this.prisma.like.findMany({
      where: { userId: viewerId, postId: { in: posts.map((p) => p.id) } },
      select: { postId: true },
    });
    const likedSet = new Set(liked.map((l) => l.postId));
    return posts.map((p) => this.toDto(p, likedSet.has(p.id)));
  }

  serialize(post: PostWithAuthor, viewerId: string): Promise<PostDto> {
    return this.serializeMany([post], viewerId).then((r) => r[0]);
  }

  hydrateIds(ids: string[]): Promise<PostWithAuthor[]> {
    if (ids.length === 0) return Promise.resolve([]);
    return this.prisma.post.findMany({
      where: { id: { in: ids } },
      include: POST_INCLUDE,
    });
  }

  private toDto(post: PostWithAuthor, liked: boolean): PostDto {
    return {
      id: post.id,
      body: post.body,
      mediaUrl: post.mediaUrl,
      createdAt: post.createdAt,
      author: post.author,
      likeCount: post.likeCount,
      commentCount: post.commentCount,
      shareCount: post.shareCount,
      liked,
    };
  }
}
