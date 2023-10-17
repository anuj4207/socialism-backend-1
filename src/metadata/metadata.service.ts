import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { MetadataDto } from './dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class MetadataService {
  constructor(private prisma: PrismaService) {}
  //create or update profile
  async create(data: MetadataDto, id: any) {
    try {
      await this.prisma.user.update({
        where: { id: parseInt(id) },
        data: data,
      });
      return { msg: 'success' };
    } catch (error) {
      console.log(error);

      throw new Error('something went wrong');
    }
  }
  //delete
  async delete(id: any) {
    try {
      await this.prisma.user.delete({
        where: { id: id },
      });
      return { msg: 'success' };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new ForbiddenException('You are not allowed to delete');
      }
      throw error;
    }
  }
  //add tag
  async tag(tags: any, id: any) {
    try {
      await this.prisma.tags.create({
        data: {
          name: tags,
          userId: id,
        },
      });

      return { msg: 'success' };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new ForbiddenException('You are not allowed to add');
      }
      throw error;
    }
  }

  //update wsId
  async updateWsId(uId: any, wsId: any, status: boolean) {
    try {
      await this.prisma.user.update({
        where: { id: parseInt(uId) },
        data: { wsId: wsId, status: status },
      });
      return { msg: 'success' };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new ForbiddenException('Unauthorized');
      }
      throw error;
    }
  }
  //fetch wsId or null status offline
  async fetchWsId(uId: any) {
    try {
      let id = await this.prisma.user.findFirst({
        where: { id: parseInt(uId) },
      });
      return { msg: 'success', data: { wsId: id.wsId } };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new ForbiddenException('Unauthorized');
      }
      throw error;
    }
  }

  //fetch wsId group
  async fetchWsIds(gId: any, uId: any) {
    try {
      let data = [];
      let check = await this.prisma.group.findFirst({
        where: { id: parseInt(gId) },
      });
      if (check.membersId.includes(parseInt(uId))) {
        for (let i = 0; i < check.membersId.length; i++) {
          let d = await this.prisma.user.findFirst({
            where: { id: check.membersId[i] },
          });
          data.push(d.wsId);
        }
        return data;
      } else {
        throw new ForbiddenException('Unauthorized');
      }
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new ForbiddenException('Unauthorized');
      }
      throw error;
    }
  }
}
