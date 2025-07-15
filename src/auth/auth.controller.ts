import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from '@/src/auth/passport/local-auth.guard';
import { AuthService } from '@/src/auth/auth.service';
import { Public } from '@/src/decorators/customize';
import { CreateUserDto } from '@/src/modules/user/dto/create-user.dto';
import {
  ForgotPasswordDto,
  RenewPasswordDto,
  ActivationCodeDto,
  ResendActiveDto,
} from '@/src/auth/dto/token.dto';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // ****** LOGIN ******
  @Post('login')
  @Public()
  @UseGuards(LocalAuthGuard)
  login(@Req() req) {
    return this.authService.login(req.user);
  }

  // ****** REGISTER ******
  @Post('register')
  @Public()
  register(@Body() data: CreateUserDto) {
    return this.authService.register(data);
  }

  // ****** GET PROFILE ******
  @Get('profile')
  getProfile(@Req() req) {
    return req.user;
  }

  // ****** VERIFY ACTIVATION CODE ******
  @Post('verify-activation-token')
  @Public()
  verifyActivationCode(@Body() data: ActivationCodeDto) {
    return this.authService.verifyActivationCode(data);
  }

  // ****** RESEND ACTIVATION TOKEN VIA EMAIL ******
  @Post('resend-active')
  @Public()
  retryActive(@Body() data: ResendActiveDto) {
    return this.authService.resendActive(data);
  }

  // ****** FORGOT PASSWORD ******
  @Post('forgot-password')
  @Public()
  forgotPassword(@Body() data: ForgotPasswordDto, @Req() request: Request) {
    return this.authService.forgotPassword(data, request);
  }

  // ****** CHANGE TO NEW PASSWORD ******
  @Post('renew-password')
  @Public()
  newPassword(@Body() data: RenewPasswordDto) {
    return this.authService.renewPassword(data);
  }
}
