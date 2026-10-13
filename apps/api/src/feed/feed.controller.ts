import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../common/guards/auth.guard';
import { AuthUser, CurrentUser } from '../common/decorators/current-user.decorator';
import { PaginationQueryDto } from '../common/dto/pagination.dto';
import { FeedService } from './feed.service';

@ApiTags('feed')
@ApiBearerAuth('x-user-id')
@UseGuards(AuthGuard)
@Controller('feed')
export class FeedController {
  constructor(private readonly feed: FeedService) {}

  @Get()
  home(@CurrentUser() user: AuthUser, @Query() query: PaginationQueryDto) {
    return this.feed.getHomeFeed({
      viewerId: user.id,
      cursor: query.cursor,
      limit: query.limit ?? 20,
    });
  }
}
