import { Logger, Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';

import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [PostController],
  providers: [PostService, Logger, ConfigService],
  imports: [],
})
export class PostModule {}
