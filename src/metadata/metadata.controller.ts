import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { MetadataDto } from './dto';
import { MetadataService } from './metadata.service';
import { Location } from './location/location';
@UseGuards(JwtGuard)
@Controller('metadata')
export class MetadataController {
  constructor(private metdataService: MetadataService) {}

  //create profile first time
  @Post('create')
  create(@Body() dto: MetadataDto, @Req() req: any) {
    let id = req.user.id;
    return this.metdataService.create(dto, id);
  }
  //delete profile
  @Delete('delete')
  delete(@Req() req: any) {
    let id = req.user.id;
    return this.metdataService.delete(id);
  }
  //tags
  @Post('tags')
  addTag(@Body() tags: any, @Req() req: any) {
    let id = req.user.id;
    return this.metdataService.tag(tags.tag, id);
  }

  @Post('location')
  addLocation(@Body() dto: any, @Req() req: any) {
    let id = req.user.id;

    return this.metdataService.addLocation(dto, id);
  }

  @Get('myDetails')
  myDetails(@Req() req: any) {
    let id = req.user.id;

    return this.metdataService.myDetails(id);
  }

  @Get('otherDetails/:id')
  otherDetails(@Req() req: any) {
    let id = parseInt(req.params.id.slice(1));
    return this.metdataService.otherDetails(id);
  }
}
