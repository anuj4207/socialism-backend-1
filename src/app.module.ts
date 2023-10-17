import { Logger, Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MetadataModule } from './metadata/metadata.module';
import { EventModule } from './event/event.module';
import { FriendModule } from './friend/friend.module';
import { GroupModule } from './group/group.module';
import { ChatModule } from './chat/chat.module';
import { PostController } from './post/post.controller';
import { PostService } from './post/post.service';
import { PostModule } from './post/post.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    PrismaModule,
    MetadataModule,
    EventModule,
    FriendModule,
    GroupModule,
    ChatModule,
    PostModule,
  ],
  controllers: [PostController],
  providers: [PostService, Logger, ConfigService],
})
export class AppModule {}
