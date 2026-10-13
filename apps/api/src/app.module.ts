import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { PrismaModule } from './prisma/prisma.module';
import { RedisModule } from './redis/redis.module';
import { RealtimeModule } from './realtime/realtime.module';
import { TimelineModule } from './timeline/timeline.module';
import { UsersModule } from './users/users.module';
import { FollowModule } from './follow/follow.module';
import { PostsModule } from './posts/posts.module';
import { FeedModule } from './feed/feed.module';
import { ChatModule } from './chat/chat.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    PrismaModule,
    RedisModule,
    RealtimeModule,
    TimelineModule,
    UsersModule,
    FollowModule,
    PostsModule,
    FeedModule,
    ChatModule,
    HealthModule,
  ],
})
export class AppModule {}
