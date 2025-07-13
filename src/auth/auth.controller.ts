import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { LocalAuthGuard } from '@/src/auth/passport/local-auth.guard';
import { AuthService } from '@/src/auth/auth.service';
import { Public } from '@/src/decorators/customize';
import { CreateUserDto } from '@/src/modules/user/dto/create-user.dto';
import {
  ForgotPasswordDto,
  NewPasswordDto,
  ActivationTokenDto,
} from '@/src/auth/dto/token.dto';
import { TransformInterceptor } from '@/src/common/transform.interceptor';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // ****** LOGIN ******
  @Post('login')
  @Public()
  @UseGuards(LocalAuthGuard)
  login(@Request() req) {
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
  getProfile(@Request() req) {
    return req.user;
  }

  // ****** CHECK ACTIVATION TOKEN ******
  @Post('check-activation-token')
  @UseInterceptors(TransformInterceptor)
  @Public()
  checkCode(@Body() data: ActivationTokenDto) {
    return this.authService.checkToken(data);
  }

  // ****** RESEND ACTIVATION TOKEN VIA EMAIL ******
  @Post('retry-active')
  @UseInterceptors(TransformInterceptor)
  @Public()
  retryActive(@Body('email') email: string) {
    return this.authService.retryActive(email);
  }

  // ****** FORGOT PASSWORD ******
  @Post('forgot-password')
  @UseInterceptors(TransformInterceptor)
  @Public()
  forgotPassword(@Body() data: ForgotPasswordDto) {
    return this.authService.forgotPassword(data);
  }

  // ****** CHANGE TO NEW PASSWORD ******
  @Post('new-password')
  @UseInterceptors(TransformInterceptor)
  @Public()
  newPassword(@Body() data: NewPasswordDto) {
    return this.authService.newPassword(data);
  }
}
