import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../common/guards/auth.guard';
import { AuthUser, CurrentUser } from '../common/decorators/current-user.decorator';
import { PostsService } from './posts.service';
import { CreateCommentDto, CreatePostDto } from './dto/post.dto';

@ApiTags('posts')
@ApiBearerAuth('x-user-id')
@UseGuards(AuthGuard)
@Controller('posts')
export class PostsController {
  constructor(private readonly posts: PostsService) {}

  @Post()
  create(@CurrentUser() user: AuthUser, @Body() dto: CreatePostDto) {
    return this.posts.create({
      authorId: user.id,
      body: dto.body,
      mediaUrl: dto.mediaUrl,
    });
  }

  @Get(':id')
  get(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.posts.getPost(id, user.id);
  }

  @Delete(':id')
  async remove(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    await this.posts.remove(id, user.id);
    return { deleted: true };
  }

  @Post(':id/like')
  like(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.posts.like(id, user.id);
  }

  @Delete(':id/like')
  unlike(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.posts.unlike(id, user.id);
  }

  @Get(':id/comments')
  comments(@Param('id') id: string) {
    return this.posts.listComments(id);
  }

  @Post(':id/comments')
  addComment(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: CreateCommentDto,
  ) {
    return this.posts.addComment({ postId: id, authorId: user.id, body: dto.body });
  }
}
