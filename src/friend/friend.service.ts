import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FriendService {
  constructor(private prismaService: PrismaService) {}
  async follow(fId: number, id: number) {
    try {
      await this.prismaService.user.update({
        where: { id: id },
        data: {
          followId: {
            push: fId,
          },
        },
      });
      await this.prismaService.user.update({
        where: { id: fId },
        data: {
          followerId: {
            push: id,
          },
        },
      });
      return { msg: 'success' };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError)
        throw new ForbiddenException('unauthorized');
      else return { msg: 'error', error: error };
    }
  }
  async fetchFollow(type: string, id: number) {
    try {
      let data = await this.prismaService.user.findFirst({
        where: { id: id },
      });
      if (type === 'followers') {
        return { msg: 'success', data: data.followerId };
      } else return { msg: 'success', data: data.followId };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError)
        throw new ForbiddenException('unauthorized');
      else return { msg: 'error', error: error };
    }
  }
  async unfollow(fId: number, id: number, followId: number[]) {
    try {
      let fData = await this.prismaService.user.findFirst({
        where: { id: fId },
      });
      let followerId = fData.followerId;
      followerId = followerId.filter((v) => v != id);
      await this.prismaService.user.update({
        where: { id: fId },
        data: {
          followerId: followerId,
        },
      });
      let followUserId = followId.filter((v) => v != fId);
      await this.prismaService.user.update({
        where: { id: id },
        data: {
          followId: followUserId,
        },
      });
      return { msg: 'success' };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError)
        throw new ForbiddenException('unautorized');
      else return { msg: 'error', error: error };
    }
  }
}
