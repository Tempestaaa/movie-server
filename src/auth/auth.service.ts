import {
  ActivationCodeDto,
  ForgotPasswordDto,
  RenewPasswordDto,
  ResendActiveDto,
} from '@/src/auth/dto/token.dto';
import { comparePasswordsHelper } from '@/src/helpers/utils';
import { CreateUserDto } from '@/src/modules/user/dto/create-user.dto';
import { UserService } from '@/src/modules/user/user.service';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.findByEmail(email);
    if (!user) return null;

    const isMatch = await comparePasswordsHelper(pass, user.password);
    if (!isMatch) return null;

    return user;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user._id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(data: CreateUserDto) {
    return await this.userService.createUser(data);
  }

  async verifyActivationCode(data: ActivationCodeDto) {
    return await this.userService.verifyActivationCode(data);
  }

  async resendActive(data: ResendActiveDto) {
    return await this.userService.resendActive(data);
  }

  async forgotPassword(data: ForgotPasswordDto, request: Request) {
    return await this.userService.forgotPassword(data, request);
  }

  async renewPassword(data: RenewPasswordDto) {
    return await this.userService.renewPassword(data);
  }
}
