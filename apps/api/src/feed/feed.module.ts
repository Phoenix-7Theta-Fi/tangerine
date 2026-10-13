import { Module } from '@nestjs/common';
import { TimelineModule } from '../timeline/timeline.module';
import { PostsModule } from '../posts/posts.module';
import { UsersModule } from '../users/users.module';
import { FeedController } from './feed.controller';
import { FeedService } from './feed.service';

@Module({
  imports: [TimelineModule, PostsModule, UsersModule],
  controllers: [FeedController],
  providers: [FeedService],
})
export class FeedModule {}
