import { Module } from '@nestjs/common';
import { TimelineModule } from '../timeline/timeline.module';
import { PostsController } from './posts.controller';
import { AuthorPostsController } from './author-posts.controller';
import { PostsService } from './posts.service';

@Module({
  imports: [TimelineModule],
  controllers: [PostsController, AuthorPostsController],
  providers: [PostsService],
  exports: [PostsService],
})
export class PostsModule {}
