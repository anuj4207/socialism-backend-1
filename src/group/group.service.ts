import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaService } from 'src/prisma/prisma.service';
import { GroupDto } from './dto';

@Injectable()
export class GroupService {
  constructor(private prismaService: PrismaService) {}
  async create(dto: GroupDto, id: number) {
    try {
      let data = await this.prismaService.group.create({
        data: dto,
      });
      await this.prismaService.user.update({
        where: { id: id },
        data: {
          groupId: {
            push: data.id,
          },
        },
      });
      let gId = data.id;
      await this.prismaService.group.update({
        where: { id: gId },
        data: {
          membersId: {
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
  async fetchGroupByTag(tag: string, location: string) {
    try {
      let data = await this.prismaService.group.findMany({
        where: { tag: tag },
      });
      data = data.filter((v) => v.location === location);
      return { msg: 'success', data: data };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError)
        throw new ForbiddenException('unautorzied');
      else return { msg: 'error', error: error };
    }
  }
  async joinGroup(gId: number, id: number) {
    try {
      let data = await this.prismaService.group.findFirst({
        where: { id: gId },
      });
      //add notification to admin
      if (data.type === 'private') {
        await this.prismaService.group.update({
          where: { id: gId },
          data: {
            pendingId: {
              push: id,
            },
          },
        });
      } else {
        await this.prismaService.group.update({
          where: { id: gId },
          data: {
            membersId: {
              push: id,
            },
          },
        });
        await this.prismaService.user.update({
          where: { id: id },
          data: {
            groupId: {
              push: gId,
            },
          },
        });
        return { msg: 'success' };
      }
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError)
        throw new ForbiddenException('unauthorized');
      else {
      }
      return { msg: 'error', error: error };
    }
  }
  async fetchMyGroup(id: number) {
    try {
      let gData = await this.prismaService.group.findMany({
        where: {
          membersId: {
            has: id,
          },
        },
      });
      return { msg: 'success', data: gData };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError)
        throw new ForbiddenException('unauthorized');
      else {
      }
      return { msg: 'error', error: error };
    }
  }
  async deleteUser(gId: number, uId: number, id: number) {
    try {
      let check = await this.prismaService.group.findFirst({
        where: { id: gId },
      });
      if (check.adminId == id) {
        let membertId = check.membersId.filter((v) => v != uId);
        await this.prismaService.group.update({
          where: { id: gId },
          data: {
            membersId: membertId,
          },
        });
        let uData = await this.prismaService.user.findFirst({
          where: { id: uId },
        });
        let ugD = uData.groupId.filter((v) => v != gId);
        await this.prismaService.user.update({
          where: { id: uId },
          data: {
            groupId: ugD,
          },
        });
        return { msg: 'success' };
      }
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError)
        throw new ForbiddenException('unathorized');
      else return { msg: 'error', error: error };
    }
  }
  async confirmUser(gId: number, uId: number, id: number) {
    try {
      let data = await this.prismaService.group.findFirst({
        where: { id: gId, adminId: id },
      });
      let d = data.pendingId.filter((v) => v != uId);
      await this.prismaService.group.update({
        where: { id: gId, adminId: id, type: 'private' },
        data: {
          membersId: {
            push: uId,
          },
          pendingId: d,
        },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError)
        throw new ForbiddenException('unathorized');
      else return { msg: 'error', error: error };
    }
  }
  async pendingUser(gId: number, id: number) {
    try {
      let data = await this.prismaService.group.findFirst({
        where: { id: gId, adminId: id, type: 'private' },
      });
      return { msg: 'success', data: data.pendingId };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError)
        throw new ForbiddenException('unathorized');
      else return { msg: 'error', error: error };
    }
  }
}
