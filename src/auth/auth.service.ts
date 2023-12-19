import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Twilio } from 'twilio';
import { log } from 'console';
import { use } from 'passport';
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
      let checkUser = await this.prisma.user.findFirst({
        where: { email: dto.email },
      });
      if (checkUser) {
        return { msg: 'error', error: 'User already exists' };
      } else {
        const user = await this.prisma.user.create({
          data: {
            email: dto.email,
            hash,
          },
        });
        return this.signToken(user.id, user.email);
      }
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new ForbiddenException('credentials taken');
      } else {
        throw error;
      }
    }
  }
  async signin(dto: AuthDto) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email: dto.email,
        },
      });
      //if not throw exception
      if (!user) {
        return { msg: 'error', error: 'User not exist' };
      }
      //check password
      const pwMatch = await argon.verify(user.hash, dto.password);
      //if not throw exception
      if (!pwMatch) {
        return { msg: 'error', error: 'Incorrect Password' };
      }
      return this.signToken(user.id, user.email);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new ForbiddenException('credentials taken');
      } else {
        throw error;
      }
    }
    //find user
  }
  async signToken(userId: number, email: string) {
    const payload = {
      sub: userId,
      email,
    };
    const secret = this.config.get('JWT_SECRET');
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '20d',
      secret: secret,
    });
    let date = new Date();
    const expAt = date.getTime() + 20 * 24 * 60 * 1000;
    return { msg: 'success', access_token: token, expAt: expAt };
  }
  // async login(userNumber: any) {
  //   try {
  //     let data = await this.prisma.user.findFirst({
  //       where: {
  //         number: userNumber,
  //       },
  //     });
  //     console.log(data);

  //     //existed user
  //     if (data) {
  //       let otp = this.generateOtp();
  //       let msg = await this.sendOtp(userNumber, otp);
  //       if (msg.msg == 'error') {
  //         return { msg: 'error', error: 'invaild' };
  //       }
  //       this.addOtp(otp, userNumber);
  //       return { msg: 'success', data: 'exist' };
  //     }
  //     //new user
  //     if (!data) {
  //       let otp = this.generateOtp();
  //       let msg = await this.sendOtp(userNumber, otp);
  //       if (msg.msg == 'error') {
  //         return { msg: 'error', error: 'invaild' };
  //       }
  //       try {
  //         data = await this.prisma.user.create({
  //           data: {
  //             number: userNumber,
  //           },
  //         });
  //         await this.addOtp(otp, userNumber);
  //         return { msg: 'success', data: 'new' };
  //       } catch (error) {
  //         if (error instanceof PrismaClientKnownRequestError) {
  //           throw new ForbiddenException('credentials taken');
  //         } else {
  //           throw error;
  //         }
  //       }
  //     }
  //   } catch (error) {
  //     if (error instanceof PrismaClientKnownRequestError) {
  //       throw new ForbiddenException('credentials taken');
  //     } else {
  //       throw error;
  //     }
  //   }
  // }
  // async sendOtp(userNumber: string, otp: any) {
  //   const client = new Twilio(
  //     this.config.get('ACCOUNT_SID'),
  //     this.config.get('AUTH_TOKEN'),
  //   );
  //   try {
  //     console.log(userNumber, otp);

  //     await client.messages.create({
  //       body: `OTP for SOCIALISM ACCOUNT : ${otp}`,
  //       from: this.config.get('PHONE_NUMBER'),
  //       to: userNumber,
  //     });
  //     return { msg: 'success' };
  //   } catch (error) {
  //     console.log(error);

  //     return { msg: 'error', error: 'invalid' };
  //   }
  // }
  // generateOtp() {
  //   let minm = 100000;
  //   let maxm = 999999;
  //   return Math.floor(Math.random() * (maxm - minm + 1)) + minm;
  // }
  // async addOtp(otp: number, userNumber: string) {
  //   try {
  //     await this.prisma.user.update({
  //       where: {
  //         number: userNumber,
  //       },
  //       data: {
  //         otp: otp,
  //       },
  //     });
  //   } catch (error) {
  //     if (error instanceof PrismaClientKnownRequestError) {
  //       throw new ForbiddenException('credentials taken');
  //     } else {
  //       throw error;
  //     }
  //   }
  // }
  // async verifyOtp(userNumber: string, otp: number) {
  //   try {
  //     let data = await this.prisma.user.findFirst({
  //       where: {
  //         number: userNumber,
  //       },
  //     });
  //     if (data) {
  //       if (data.otp === otp) {
  //         console.log(data.otp, otp);

  //         return this.signToken(data.id, userNumber);
  //       } else {
  //         return { msg: 'error', data: 'invalid' };
  //       }
  //     }
  //   } catch (error) {
  //     if (error instanceof PrismaClientKnownRequestError) {
  //       throw new ForbiddenException('credentials taken');
  //     } else {
  //       throw error;
  //     }
  //   }
  // }
}
