import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { AuthGuard } from '../common/guards/auth.guard';
import { AuthUser, CurrentUser } from '../common/decorators/current-user.decorator';
import { PaginationQueryDto } from '../common/dto/pagination.dto';
import { UsersService } from './users.service';

export class UserSearchQueryDto extends PaginationQueryDto {
  @IsOptional() @IsString() q?: string;
  @IsOptional() @IsEnum(Role) role?: Role;
}

@ApiTags('users')
@ApiBearerAuth('x-user-id')
@UseGuards(AuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get('me')
  me(@CurrentUser() user: AuthUser) {
    return this.users.getProfile(user.id, user.id);
  }

  @Get()
  search(@CurrentUser() user: AuthUser, @Query() query: UserSearchQueryDto) {
    return this.users.search({
      viewerId: user.id,
      q: query.q,
      role: query.role,
      cursor: query.cursor,
      limit: query.limit ?? 20,
    });
  }

  @Get(':id')
  profile(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.users.getProfile(id, user.id);
  }
}
