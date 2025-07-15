import {
  ForgotPasswordDto,
  RenewPasswordDto,
  ActivationCodeDto,
  ResendActiveDto,
} from '@/src/auth/dto/token.dto';
import { hashPasswordHelper } from '@/src/helpers/utils';
import { CreateUserDto } from '@/src/modules/user/dto/create-user.dto';
import { User, UserDocument } from '@/src/modules/user/schema/user.schema';
import { MailerService } from '@nestjs-modules/mailer';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { randomInt } from 'crypto';
import dayjs from 'dayjs';
import { Request } from 'express';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private UserModel: Model<User>,
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  // ****** Utility functions ******
  async isEmailExist(email: string) {
    const user = await this.UserModel.exists({ email });
    if (user) return true;
    return false;
  }

  async findByEmail(email: string) {
    return await this.UserModel.findOne({ email });
  }

  generateToken() {
    return randomInt(100_000, 1_000_000).toString();
  }

  sendEmail(
    user: UserDocument,
    subject: string,
    template: string,
    others?: {
      token?: string;
      passwordResetLink?: string;
    },
  ) {
    const currentYear = dayjs().get('year').toString();
    this.mailerService.sendMail({
      to: user.email,
      subject,
      template: template ?? 'register',
      context: {
        username: user.username ?? user.email,
        activationCode: others?.token,
        passwordResetLink: others?.passwordResetLink,
        currentYear,
      },
    });
  }

  // ****** Main functions ******
  async createUser(data: CreateUserDto) {
    const { email, username, password } = data;

    const isExist = await this.isEmailExist(email);
    if (isExist) throw new BadRequestException('Email already registered');

    const hashPassword = await hashPasswordHelper(password);
    const token = this.generateToken();

    const user = await this.UserModel.create({
      email,
      username,
      password: hashPassword,
      isActive: false,
      activationCode: token,
      activationCodeExpired: dayjs().add(5, 'minutes').toString(),
    });

    this.sendEmail(user, 'Activate your account at Flix', 'register', {
      token,
    });

    return { _id: user._id, message: 'Account created successfully' };
  }

  async verifyActivationCode(data: ActivationCodeDto) {
    const { _id, activationCode } = data;

    const user = await this.UserModel.findOne({ _id });
    if (!user) throw new BadRequestException('Invalid credentials');

    if (user.isActive)
      throw new BadRequestException('Account is already active');

    if (
      dayjs().isBefore(user.activationCodeExpired) &&
      activationCode === user.activationCode
    ) {
      await user.updateOne({ isActive: true });
      return { message: 'Account is active, you can login' };
    } else {
      throw new BadRequestException('Verify token is invalid or expired');
    }
  }

  async resendActive(data: ResendActiveDto) {
    const { email, _id } = data;
    let user;

    if (email) {
      user = await this.UserModel.findOne({ email });
    } else {
      user = await this.UserModel.findOne({ _id });
    }
    if (!user) throw new BadRequestException('Account does not exist');

    if (user.isActive)
      throw new BadRequestException('Account is already active');

    const token = this.generateToken();
    await user.updateOne({
      activationCode: token,
      activationCodeExpired: dayjs().add(5, 'minutes').toString(),
    });

    this.sendEmail(user, token, 'Activate your account at Flix');

    return { _id: user._id, message: 'Activation email has been sent' };
  }

  async forgotPassword(data: ForgotPasswordDto, request: Request) {
    const { email } = data;

    const user = await this.UserModel.findOne({ email });
    if (!user) throw new BadRequestException('Account does not exist');

    const frontendUrl =
      this.configService.get<string>('FRONTEND_URL') +
      request.originalUrl.replace('/api/v1', '') +
      `/${user._id}`;

    this.sendEmail(user, 'Reset password', 'reset-password', {
      passwordResetLink: frontendUrl,
    });

    return { message: 'Check your email' };
  }

  async renewPassword(data: RenewPasswordDto) {
    const { _id, password } = data;

    const user = await this.UserModel.findOne({ _id });
    if (!user) throw new BadRequestException('Account does not exist');

    const hashPassword = await hashPasswordHelper(password);
    await user.updateOne({ password: hashPassword });

    return { message: 'Password successfully updated' };
  }
}
