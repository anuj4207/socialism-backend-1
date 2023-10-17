import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Req,
  Res,
  ServiceUnavailableException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PostService } from './post.service';
import { JwtGuard } from 'src/auth/guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { StorageFile } from './storage-file';
import { log } from 'console';
import { PostDto } from './dto';
@UseGuards(JwtGuard)
@Controller('post')
export class PostController {
  constructor(private postService: PostService) {}

  //upload image for post
  @Post('uploadpostimage')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        files: 1,
        fileSize: 1024 * 1024,
      },
    }),
  )
  async uploadMedia(
    @UploadedFile() file: Express.Multer.File,
    @Body('mediaId') mediaId: string,
    @Req() req: any,
  ) {
    const { originalname, buffer } = file;
    return await this.postService.save(
      originalname,
      buffer,
      parseInt(req.user.id),
    );
  }

  //create post
  @Post('create')
  createPersonalPost(@Body() post: any, @Req() req: any) {
    return this.postService.createPost(post, req.user.id);
  }

  //fetch post by id of user/group/event
  @Get('fetch/:id/:type')
  fetchPostByUserId(@Param() tag: any) {
    let data = {};
    let id = tag.id.slice(':')[1];
    if (tag.type.slice(':')[1] !== 'tag') {
      id = parseInt(id);
    }

    switch (tag.type) {
      case ':user':
        data = { userId: id };
        break;
      case ':event':
        data = { eventId: id };
        break;
      case ':group':
        data = { groupId: id };
        break;
      case ':tag':
        data = { tag: id };
        break;
    }

    return this.postService.fetch(data);
    // switch(){
    //   case 'userId':
    //     data = {userId:}
    // }
    // return this.postService.fetchPostByUserId(id)
  }

  //fetch post by tags

  //fetch post by location

  //like post

  //comment post

  //get post
  // @Get('/:mediaId')
  // async downloadMedia(@Param('mediaId') mediaId: string, @Res() res: Response) {
  //   let storageFile: StorageFile;
  //   try {
  //     storageFile = await this.postService.get('media/' + mediaId);
  //   } catch (e) {
  //     if (e.message.toString().includes('No such object')) {
  //       throw new NotFoundException('image not found');
  //     } else {
  //       throw new ServiceUnavailableException('internal error');
  //     }
  //   }
  //   // res.set("Content-Type", storageFile.contentType);
  //   // res.setHeader("Cache-Control", "max-age=60d");
  //   // res.end(storageFile.buffer);
  //   return { msg: 'success', data: storageFile.buffer };
  // }
}
//create a event post in group

//show post (public) related to tags/location for user

//share post

//like post

//comment post
