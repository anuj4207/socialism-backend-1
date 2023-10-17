import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { ChatService } from './chat.service';

@UseGuards(JwtGuard)
@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Get('newchat')
  fetchNewChat(@Req() req: any) {
    return this.chatService.fetchNewChat(req.user.id);
  }
  @Get('/:sId')
  fetchChatById(@Param() param: any, @Req() req: any) {
    let sId = param.sId.slice(1);
    return this.chatService.fetchChatById(req.user.id, sId);
  }
}
