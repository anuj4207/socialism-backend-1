import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { bucket } from './cloud.helper';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PostDto } from './dto';

@Injectable()
export class PostService {
  private readonly logger = new Logger(PostService.name);
  constructor(private prismaService: PrismaService) {}
  uploadImage = (postId: string, buffer: any): Promise<string> =>
    new Promise((resolve, reject) => {
      const blob = bucket.file(postId);
      const blobStream = blob.createWriteStream();
      let publicUrl = '';
      blobStream
        .on('finish', async () => {
          publicUrl = `https://storage.googleapis.com/socialism_post/${blob.name}`;
          resolve(publicUrl);
        })
        .on('error', (error) => {
          this.logger.log(`Upload file error: ${error.message}`);

          reject(`error+${error.message}`);
        })
        .end(buffer);
    });
  //upload file to cloud and link in DB
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
      groupId: post.hasOwnProperty('groupId') ? post.groupId : null,
      postLink: post.postLink,
      location: post.location,
      eventId: post.hasOwnProperty('eventId') ? post.eventId : null,
      eventName: post.hasOwnProperty('eventName') ? post.eventName : null,
      tag: post.tag,
      title: post.hasOwnProperty('title') ? post.title : null,
      describe: post.hasOwnProperty('describe') ? post.describe : null,
    };
    try {
      console.log(post);
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
  async fetchPostById(tag: any) {
    let id = parseInt(userId);
    try {
      let data = await this.prismaService.post.findMany({
        where: { : id },
      });
      return { msg: 'success', data: data };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError)
        throw new ForbiddenException('DB error' + error.message);
      else throw new ForbiddenException('something went wrong' + error.message);
    }
  }
}

// async delete(path: string) {
//   await this.storage
//     .bucket(this.bucket)
//     .file(path)
//     .delete({ ignoreNotFound: true });
// }

// async get(path: string): Promise<StorageFile> {
//   const fileResponse: DownloadResponse = await this.storage
//     .bucket(this.bucket)
//     .file(path)
//     .download();
//   const [buffer] = fileResponse;
//   const storageFile = new StorageFile();
//   storageFile.buffer = buffer;
//   storageFile.metadata = new Map<string, string>();
//   return storageFile;

//   async getWithMetaData(path: string): Promise<StorageFile> {
//     const [metadata] = await this.storage
//       .bucket(this.bucket)
//       .file(path)
//       .getMetadata();
//     const fileResponse: DownloadResponse = await this.storage
//       .bucket(this.bucket)
//       .file(path)
//       .download();
//     const [buffer] = fileResponse;

//     const storageFile = new StorageFile();
//     storageFile.buffer = buffer;
//     storageFile.metadata = new Map<string, string>(
//       Object.entries(metadata || {})
//     );
//     storageFile.contentType = storageFile.metadata.get("contentType");
//     return storageFile;
//   }
