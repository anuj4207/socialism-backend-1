import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}
  async signup(dto: AuthDto) {
    //generate hash
    const hash = await argon.hash(dto.password);
    //upload to db
    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
        },
      });
      return this.signToken(user.id, user.email);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new ForbiddenException('credentials taken');
      } else {
        throw error;
      }
    }
  }
  async signin(dto: AuthDto) {
    //find user
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    //if not throw exception
    if (!user) throw new ForbiddenException('credentials not found');
    //check password
    const pwMatch = await argon.verify(user.hash, dto.password);
    //if not throw exception
    if (!pwMatch) throw new ForbiddenException('credentials not found');
    return this.signToken(user.id, user.email);
  }
  async signToken(userId: number, email: string) {
    const payload = {
      sub: userId,
      email,
    };
    const secret = this.config.get('JWT_SECRET');
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '16h',
      secret: secret,
    });
    return { access_token: token };
  }
}
