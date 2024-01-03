import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { bucket } from './cloud.helper';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  PrismaClientKnownRequestError,
  empty,
} from '@prisma/client/runtime/library';

@Injectable()
export class PostService {
  private readonly logger = new Logger(PostService.name);
  constructor(private prismaService: PrismaService) {}

  //delete image
  async deleteImage(publicUrl: any, prefix: string) {
    let name = publicUrl.split('1/')[1];
    await bucket.deleteFiles({ prefix: `${prefix + name}` });
  }
  //upload image
  uploadImage = (postId: string, buffer: any): Promise<string> =>
    new Promise((resolve, reject) => {
      const blob = bucket.file(postId);
      const blobStream = blob.createWriteStream();
      let publicUrl = '';
      blobStream
        .on('finish', async () => {
          publicUrl = `https://storage.googleapis.com/socialism-post-image/${blob.name}`;
          resolve(publicUrl);
        })
        .on('error', (error) => {
          this.logger.log(`Upload file error: ${error.message}`);

          reject(`error+${error.message}`);
        })
        .end(buffer);
    });
  //upload file to cloud and return public url
  async save(originalname: any, buffer: any, id: number) {
    //change image file name
    const postId =
      id + '/' + Math.random().toString(36).substring(2, 10) + originalname;
    //upload file to cloud
    let resUpload = await this.uploadImage(postId, buffer);
    if (resUpload.split('+')[0] === 'error') {
      return { msg: 'error', error: resUpload.split('+')[1] };
    }
    return { msg: 'success', data: { publicUrl: resUpload } };
  }
  //create post
  async createPost(post: any, id: number) {
    const data = {
      userId: id,
      groupId: post.hasOwnProperty('groupId') ? parseInt(post.groupId) : null,
      postLink: post.postLink,
      location: post.location,
      eventId: post.hasOwnProperty('eventId') ? parseInt(post.eventId) : null,
      eventName: post.hasOwnProperty('eventName') ? post.eventName : null,
      tag: post.tag,
      title: post.hasOwnProperty('title') ? post.title : null,
      description: post.hasOwnProperty('describe') ? post.describe : null,
    };
    try {
      await this.prismaService.post.create({
        data: data,
      });
      return { msg: 'success' };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError)
        throw new ForbiddenException('DB error' + error.message);
      else throw new ForbiddenException('something went wrong' + error.message);
    }
  }
  //fetch post by user id
  async fetch(tag: any) {
    console.log(tag);

    try {
      let data = await this.prismaService.post.findMany({
        where: tag,
      });
      return { msg: 'success', data: data };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError)
        throw new ForbiddenException('DB error' + error.message);
      else throw new ForbiddenException('something went wrong' + error.message);
    }
  }
  //like post
  async likePost(postId: number, id: number) {
    try {
      await this.prismaService.post.update({
        where: { id: postId },
        data: {
          like: {
            push: id,
          },
        },
      });
      return { msg: 'success' };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError)
        throw new ForbiddenException('Database error');
      else return { msg: 'error', error: error.message };
    }
  }
  //commment post
  async postComment(postId: number, userId: number, msg: any) {
    try {
      await this.prismaService.comment.create({
        data: {
          postId: postId,
          userId: userId,
          comment: msg.comment,
        },
      });
      return { msg: 'success' };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError)
        throw new ForbiddenException('Database error');
      else return { msg: 'error', error: error.message };
    }
  }
  //delete post
  async deletePost(postId: number, userId: number) {
    try {
      const data = await this.prismaService.post.findFirst({
        where: { id: postId, userId: userId },
      });
      //delete image from cloud
      await this.deleteImage(data.postLink, `${userId}/`);
      //delete comment of post
      await this.prismaService.comment.deleteMany({
        where: { postId: postId },
      });
      //delete post
      await this.prismaService.post.delete({
        where: { id: postId, userId: userId },
      });
      return { msg: 'success' };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError)
        throw new ForbiddenException('Database error');
      else return { msg: 'error', error: error.message };
    }
  }
}
