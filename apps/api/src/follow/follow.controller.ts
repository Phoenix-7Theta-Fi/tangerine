import { Controller, Delete, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../common/guards/auth.guard';
import { AuthUser, CurrentUser } from '../common/decorators/current-user.decorator';
import { FollowService } from './follow.service';

@ApiTags('follows')
@ApiBearerAuth('x-user-id')
@UseGuards(AuthGuard)
@Controller('users/:id')
export class FollowController {
  constructor(private readonly follow: FollowService) {}

  @Post('follow')
  followUser(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.follow.follow(user.id, id);
  }

  @Delete('follow')
  unfollowUser(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.follow.unfollow(user.id, id);
  }
}
