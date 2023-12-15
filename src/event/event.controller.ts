import {
  Body,
  Controller,
  Post,
  Get,
  Req,
  UseGuards,
  Put,
  Param,
} from '@nestjs/common';
import { EventService } from './event.service';
import { JwtGuard } from 'src/auth/guard';
import { EventDto, FindEventDto } from './dto';

@UseGuards(JwtGuard)
@Controller('event')
export class EventController {
  constructor(private eventService: EventService) {}

  @Post('create')
  create(@Body() dto: EventDto, @Req() req: any) {
    let id = req.user.id;
    return this.eventService.create(dto, id);
  }
  //return event by tags then filter with locaiton
  @Get('search')
  searchEvent(@Body() dto: FindEventDto, @Req() req: any) {
    //let id = req.user.id;
    return this.eventService.searchEvent(dto);
  }
  //nearby event
  @Get('nearby')
  findNearbyEvent(@Req() req: any) {
    let city = req.user.city;
    console.log(city);

    return this.eventService.nearbyEvent(city);
  }
  //join request
  @Put('joinrequest/:id')
  joinRequest(@Param() eId: any, @Req() req: any) {
    let id = req.user.id;
    let eventId = eId.id.slice(1);
    return this.eventService.joinRequest(eventId, id);
  }
  //my events
  @Get('myevent')
  fetchMyEvent(@Req() req: any) {
    return this.eventService.fetchMyEvents(req.user.id);
  }
  //admin action fetch user
  @Get('pendinguser/:id')
  fetchPenUser(@Param() eid: any, @Req() req: any) {
    let eventId = eid.id.slice(1);
    typeof eventId === 'string'
      ? (eventId = parseInt(eventId))
      : new Error('fix int conversion');
    return this.eventService.fetchPenUser(eventId);
  }
  //admin action add user
  @Put('confirmuser/:id/:userid')
  addMyEventUser(@Param() eid: any, @Req() req: any) {
    let id = req.user.id;
    let eventId = eid.id.slice(1);
    let userId = eid.userid.slice(1);
    return this.eventService.addMyEventUser(eventId, id, userId);
  }
}
