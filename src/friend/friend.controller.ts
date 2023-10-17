import {
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { FriendService } from './friend.service';

@UseGuards(JwtGuard)
@Controller('friend')
export class FriendController {
  constructor(private friendService: FriendService) {}
  //follow user
  @Put('follow/:id')
  follow(@Param() param: any, @Req() req: any) {
    let id = req.user.id;
    let fId = param.id.slice(1);
    typeof fId === 'string'
      ? (fId = parseInt(fId))
      : new Error('fix int conversion');
    return this.friendService.follow(fId, id);
  }
  //fetch my followers
  @Get('/:type')
  fetchFollow(@Param() param: any, @Req() req: any) {
    let id = req.user.id;
    let typ = param.type.slice(1);
    if (typ === 'follow' || typ === 'followers') {
      return this.friendService.fetchFollow(typ, id);
    } else return { msg: 'error', error: 'incorrect params' };
  }
  //unfollow user
  @Put('unfollow/:id')
  unfollow(@Param() param: any, @Req() req: any) {
    let id = req.user.id;
    let fId = param.id.slice(1);
    typeof fId === 'string'
      ? (fId = parseInt(fId))
      : new Error('fix int conversionm');
    return this.friendService.unfollow(fId, id, req.user.followId);
  }
}
