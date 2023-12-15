import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  // @Post('signup')
  // signup(@Body() dto: AuthDto) {
  //   return this.authService.signup(dto);
  // }
  // @HttpCode(HttpStatus.OK)
  // @Post('signin')
  // signin(@Body() dto: AuthDto) {
  //   return this.authService.signin(dto);
  // }
  @Post('login')
  loginNumber(@Body() dto: any) {
    return this.authService.login(dto.number);
  }
  @Post('verify')
  verifyOtp(@Body() dto: any) {
    console.log('hello', dto);
    return this.authService.verifyOtp(dto.userNumber, parseInt(dto.otp));
  }
}
