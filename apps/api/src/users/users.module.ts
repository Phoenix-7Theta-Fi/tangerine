import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { SessionController } from './session.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController, SessionController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
