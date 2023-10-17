import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { GroupService } from './group.service';
import { GroupDto } from './dto';
@UseGuards(JwtGuard)
@Controller('group')
export class GroupController {
  constructor(private groupService: GroupService) {}
  //create a new group
  @Post('create')
  creteGroup(@Body() dto: GroupDto, @Req() req: any) {
    let id = req.user.id;
    let data = { adminId: id, ...dto };
    return this.groupService.create(data, id);
  }
  //fetch group by tags
  @Get('search/:tag')
  fetchGroupByTag(@Param() tags: any, @Req() req: any) {
    let location = req.user.location;
    let tag = tags.tag.slice(1);
    return this.groupService.fetchGroupByTag(tag, location);
  }
  //join group ->private/public
  @Put('join/:id')
  joinGroup(@Param() gid: any, @Req() req: any) {
    let gId = gid.id.slice(1);
    typeof gId === 'string'
      ? (gId = parseInt(gId))
      : new Error('fix int conversion');
    return this.groupService.joinGroup(gId, req.user.id);
  }
  //fetch my group
  @Get()
  fetchMyGroup(@Req() req: any) {
    return this.groupService.fetchMyGroup(req.user.id);
  }
  //remove member
  @Delete('delete/:gid/:uid')
  deleteUser(@Param() pData: any, @Req() req: any) {
    console.log(pData);

    let gId = parseInt(pData.gid.slice(1));
    let uId = parseInt(pData.uid.slice(1));
    console.log(gId, uId);

    return this.groupService.deleteUser(gId, uId, req.user.id);
  }
  //confirm uer private
  @Put('confirm/:gid/:uid')
  confirmUser(@Param() id: any, @Req() req: any) {
    let uId = parseInt(id.uid.slice(1));
    let gId = parseInt(id.gid.slice(1));
    return this.groupService.confirmUser(gId, uId, req.user.id);
  }
  //fetch pending user private
  @Get('pending/:gid')
  fetchPendingUser(@Param() id: any, @Req() req: any) {
    let gId = parseInt(id.gid.slice(1));
    return this.groupService.pendingUser(gId, req.user.id);
  }
}
