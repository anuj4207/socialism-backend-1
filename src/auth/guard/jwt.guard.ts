import { CanActivate, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { WsException } from '@nestjs/websockets';
import { PrismaService } from 'src/prisma/prisma.service';

export class JwtGuard extends AuthGuard('jwt') {
  constructor() {
    super();
  }
}

// export class WsGuard extends AuthGuard('ws') {
//   constructor() {
//     super();
//   }
// }
