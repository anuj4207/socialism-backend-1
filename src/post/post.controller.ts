import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PostService } from './post.service';
import { JwtGuard } from 'src/auth/guard';
import { FileInterceptor } from '@nestjs/platform-express';
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
  //fetch post by location

  //like post
  @Put('like/:id')
  likePost(@Param() tag: any, @Req() req: any) {
    let postId = parseInt(tag.id.slice(':')[1]);
    return this.postService.likePost(postId, req.user.id);
  }
  //comment post
  @Put('comment/:id')
  commentPost(@Param('id') tag: any, @Req() req: any, @Body() msg: any) {
    let postId = parseInt(tag.slice(':')[1]);
    return this.postService.postComment(postId, req.user.id, msg);
  }
  //delete post
  @Delete('delete/:id')
  deletePost(@Param('id') tag: any, @Req() req: any) {
    let postId = parseInt(tag.slice(':')[1]);
    return this.postService.deletePost(postId, req.user.id);
  }
}
