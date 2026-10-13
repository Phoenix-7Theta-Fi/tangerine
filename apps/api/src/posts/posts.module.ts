import { Module } from '@nestjs/common';
import { OutboxModule } from '../outbox/outbox.module';
import { PostsController } from './posts.controller';
import { AuthorPostsController } from './author-posts.controller';
import { PostsService } from './posts.service';

@Module({
  imports: [OutboxModule],
  controllers: [PostsController, AuthorPostsController],
  providers: [PostsService],
  exports: [PostsService],
})
export class PostsModule {}
