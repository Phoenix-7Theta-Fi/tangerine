import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { randomUUID } from 'node:crypto';
import { AuthGuard } from '../common/guards/auth.guard';
import { AuthUser, CurrentUser } from '../common/decorators/current-user.decorator';
import { PaginationQueryDto } from '../common/dto/pagination.dto';
import { ChatService } from './chat.service';
import {
  MarkReadDto,
  SendMessageDto,
  StartDirectConversationDto,
} from './dto/chat.dto';

@ApiTags('chat')
@ApiBearerAuth('x-user-id')
@UseGuards(AuthGuard)
@Controller('conversations')
export class ChatController {
  constructor(private readonly chat: ChatService) {}

  @Get()
  list(@CurrentUser() user: AuthUser) {
    return this.chat.listConversations(user.id);
  }

  @Post('direct')
  startDirect(
    @CurrentUser() user: AuthUser,
    @Body() dto: StartDirectConversationDto,
  ) {
    return this.chat.getOrCreateDirect(user.id, dto.userId);
  }

  @Get(':id')
  get(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.chat.getConversation(id, user.id);
  }

  @Get(':id/messages')
  messages(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Query() query: PaginationQueryDto,
  ) {
    return this.chat.listMessages({
      userId: user.id,
      conversationId: id,
      cursorSeq: query.cursor ? Number(query.cursor) : undefined,
      limit: query.limit ?? 30,
    });
  }

  /** REST send path — same guarantees as the socket path (idempotent, sequenced). */
  @Post(':id/messages')
  async send(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: SendMessageDto,
  ) {
    const { message } = await this.chat.sendMessage({
      conversationId: id,
      senderId: user.id,
      body: dto.body,
      clientMsgId: dto.clientMsgId ?? randomUUID(),
    });
    return message;
  }

  @Post(':id/read')
  read(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: MarkReadDto,
  ) {
    return this.chat.markRead({
      userId: user.id,
      conversationId: id,
      seq: dto.seq,
    });
  }
}
