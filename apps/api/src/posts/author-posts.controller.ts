import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../common/guards/auth.guard';
import { AuthUser, CurrentUser } from '../common/decorators/current-user.decorator';
import { PaginationQueryDto } from '../common/dto/pagination.dto';
import { PostsService } from './posts.service';

@ApiTags('posts')
@ApiBearerAuth('x-user-id')
@UseGuards(AuthGuard)
@Controller('users/:userId/posts')
export class AuthorPostsController {
  constructor(private readonly posts: PostsService) {}

  @Get()
  list(
    @CurrentUser() user: AuthUser,
    @Param('userId') authorId: string,
    @Query() query: PaginationQueryDto,
  ) {
    return this.posts.listByAuthor({
      authorId,
      viewerId: user.id,
      cursor: query.cursor,
      limit: query.limit ?? 20,
    });
  }
}
