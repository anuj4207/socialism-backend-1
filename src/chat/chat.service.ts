import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(private prismaService: PrismaService) {}

  async saveChat(rId: any, sId: any, message: string) {
    try {
      await this.prismaService.chat.create({
        data: {
          receipentId: parseInt(rId),
          senderId: parseInt(sId),
          seen: false,
          discussion: message,
        },
      });

      return { msg: 'success' };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError)
        throw new ForbiddenException('Unauthorized');
      else return { msg: 'error', error: error.message };
    }
  }
  async fetchNewChat(rId: any) {
    try {
      let chat = await this.prismaService.chat.findMany({
        where: { receipentId: rId, seen: false },
        orderBy: {
          createdAt: 'desc',
        },
      });
      console.log(chat);
      return { msg: 'success', data: chat };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError)
        throw new ForbiddenException('Unauthorized');
      else return { msg: 'error', error: error.message };
    }
  }
  async fetchChatById(uId: any, sId: any) {
    try {
      let da = [];
      let data = await this.prismaService.chat.findMany({
        where: { receipentId: parseInt(uId), senderId: parseInt(sId) },
      });
      let oData = await this.prismaService.chat.findMany({
        where: { receipentId: parseInt(sId), senderId: parseInt(uId) },
      });
      da.push(data, oData);
      return { msg: 'success', data: da };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError)
        throw new ForbiddenException('Unauthorized');
      else return { msg: 'error', error: error.message };
    }
  }
  async saveGroupChat(gId: any, uId: any, message: string) {
    try {
      await this.prismaService.chat.create({
        data: {
          receipentId: parseInt(gId),
          senderId: parseInt(uId),
          seen: false,
          discussion: message,
        },
      });
      return { msg: 'success' };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError)
        throw new ForbiddenException('Unauthorized');
      else return { msg: 'error', error: error.message };
    }
  }
}
