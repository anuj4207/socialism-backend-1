import { CanActivate, ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class WsGuard implements CanActivate {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async canActivate(context: any): Promise<boolean> {
    const bearerToken =
      context.args[0].handshake.headers.authorization.split(' ')[1];
    const secret = this.config.get('JWT_SECRET');
    const decoded = await this.jwt.verifyAsync(bearerToken, {
      secret: secret,
    });
    try {
      let user = await this.prisma.user.findFirst({
        where: { id: decoded.id },
      });
      if (!user) throw new ForbiddenException('Unauthorized access');
      delete user.hash;
      // context.args[0].handshake = {
      //   user,
      //   ...context.args[0].handshake.headers,
      // };

      return Boolean(user);
    } catch (error) {
      throw new WsException(error.message);
    }
  }
}
