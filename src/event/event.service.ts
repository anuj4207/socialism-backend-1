import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { EventDto, FindEventDto } from './dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class EventService {
  constructor(private prismaService: PrismaService) {}
  //create new event link eventId with admin
  async create(dto: EventDto, id: number) {
    let nDto = { adminId: id, ...dto, confirmedUser: [id] };
    console.log('type', dto.maxMembers, typeof nDto.maxMembers, new Date());
    //console.log(nDto);
    typeof nDto.maxMembers === 'string'
      ? (nDto.maxMembers = parseInt(nDto.maxMembers))
      : new Error('fix string issue ');
    try {
      let event = await this.prismaService.event.create({
        data: nDto,
      });

      try {
        await this.prismaService.user.update({
          where: { id: id },
          data: {
            eventId: {
              push: event.id,
            },
          },
        });
      } catch (error) {
        throw error;
        //return { msg: 'error', error: error };
      }
      return { msg: 'success' };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError)
        throw new ForbiddenException('Event creation failed | Unauthorzied');
      else throw error;
    }
  }
  //find event by location then use tags as filter
  async searchEvent(dto: FindEventDto) {
    try {
      let eventFetch = await this.prismaService.event.findMany({
        where: { tag: dto.tag },
      });
      eventFetch = eventFetch.filter((e) => (e.city = dto.city));
      return { msg: 'success', data: eventFetch };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError)
        throw new ForbiddenException('Unauthorized');
      else throw error;
    }
  }
  //add request to event db
  async joinRequest(eventId: string, id: number) {
    let eid: number;
    typeof eventId === 'string'
      ? (eid = parseInt(eventId))
      : new Error('fix int conversion');
    try {
      let checkSpot = await this.prismaService.event.findFirst({
        where: { id: eid },
      });
      console.log(checkSpot.pendingUser.filter((v) => v == id));

      if (
        checkSpot.maxMembers - checkSpot.confirmedUser.length > 0 &&
        checkSpot.pendingUser.filter((v) => v === id).length === 0
      ) {
        try {
          await this.prismaService.event.update({
            where: { id: eid },
            data: {
              pendingUser: [id, ...checkSpot.pendingUser],
            },
          });
          return { msg: 'success' };
        } catch (error) {
          if (error instanceof PrismaClientKnownRequestError)
            throw new ForbiddenException('Unauthorizrd');
          else return { msg: 'error', error: error };
        }
      } else {
        return { msg: 'noslot' };
      }
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError)
        throw new ForbiddenException('Unauthorized');
      else return { msg: 'error', error: error };
    }
  }

  //admin
  //fetch all pending user
  async fetchPenUser(eventId: number) {
    try {
      let data = await this.prismaService.event.findFirst({
        where: { id: eventId },
        select: { pendingUser: true },
      });

      if (data.pendingUser.length > 0) {
        let profile = await this.prismaService.user.findMany({
          where: { id: { in: data.pendingUser } },
        });
        console.log(profile);

        return { msg: 'success', data: profile };
      } else {
        return { msg: 'success', data: [] };
      }
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError)
        throw new ForbiddenException('Unauthorized');
      else return { msg: 'error', error: error };
    }
  }
  //add user to confirmed user
  async addMyEventUser(eventId: string, id: number, userId: string) {
    let eid: number;
    let uid: number;
    typeof eventId === 'string'
      ? (eid = parseInt(eventId))
      : new Error('fix int conversion');
    typeof userId === 'string'
      ? (uid = parseInt(userId))
      : new Error('fix int conversion');
    try {
      //check admin?
      let check = await this.prismaService.event.findFirst({
        where: { id: eid, adminId: id },
      });
      if (!check) return { msg: 'error', error: 'unauthorized' };
      //update user role
      let penUser = check.pendingUser.filter((v) => v != uid);
      await this.prismaService.event.update({
        where: { id: eid },
        data: {
          confirmedUser: {
            push: uid,
          },
          pendingUser: penUser,
        },
      });
      await this.prismaService.user.update({
        where: { id: uid },
        data: {
          eventId: {
            push: eid,
          },
        },
      });
      return { msg: 'success' };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError)
        throw new ForbiddenException('unauthorized');
      return { msg: 'error', error: error };
    }
  }
  //fetch my events
  async fetchMyEvents(id: any) {
    try {
      let data = await this.prismaService.event.findMany({
        where: {
          confirmedUser: {
            hasEvery: [parseInt(id)],
          },
        },
      });
      return { msg: 'success', data: data };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError)
        throw new ForbiddenException('unauthorized');
      return { msg: 'error', error: error };
    }
  }
  //find event by profile
  async nearbyEvent(city: string) {
    try {
      let eventFetch = await this.prismaService.event.findMany({
        where: { city: city },
      });
      console.log(eventFetch);
      eventFetch = eventFetch.filter(
        (v) => v.confirmedUser.length < v.maxMembers,
      );
      return { msg: 'success', data: eventFetch };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError)
        throw new ForbiddenException('Unauthorized');
      else throw error;
    }
  }
  //remove user
  async removeUser(eId: number, id: number, userId: number) {
    try {
      let pendingUser = await this.prismaService.event.findFirst({
        where: { id: eId },
      });

      if (pendingUser) {
        let pen = pendingUser.pendingUser.filter((v) => v != userId);
        await this.prismaService.event.update({
          where: { id: eId },
          data: {
            pendingUser: pen,
          },
        });
        return { msg: 'success' };
      }
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError)
        throw new ForbiddenException('unauthorized');
      return { msg: 'error', error: error };
    }
  }
  //delete event
  async deleteEvent(eId: number, uId: number) {
    let admin = false;
    try {
      let data = await this.prismaService.event.findFirst({
        where: { id: eId },
      });
      if (data) {
        if (data.adminId === uId) {
          await this.prismaService.event.delete({ where: { id: eId } });
        } else {
          let user = await this.prismaService.event.findFirst({
            where: { id: eId },
          });
          let confirmedUser = user.confirmedUser;
          await this.prismaService.event.update({
            where: { id: eId },
            data: {
              confirmedUser: {
                set: confirmedUser.filter((v) => {
                  v !== uId;
                }),
              },
            },
          });
        }
        return { msg: 'success' };
      }
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError)
        throw new ForbiddenException('Unauthorized');
      else throw error;
    }
  }
}
