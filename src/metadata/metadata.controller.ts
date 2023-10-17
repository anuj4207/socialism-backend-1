import { Body, Controller, Delete, Post, Req, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { MetadataDto } from './dto';
import { MetadataService } from './metadata.service';

@UseGuards(JwtGuard)
@Controller('metadata')
export class MetadataController {
  constructor(private metdataService: MetadataService) {}

  //create profile first time
  @Post('update')
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
}
