import {
  ForgotPasswordDto,
  NewPasswordDto,
  ActivationTokenDto,
} from '@/src/auth/dto/token.dto';
import { hashPasswordHelper } from '@/src/helpers/utils';
import { CreateUserDto } from '@/src/modules/user/dto/create-user.dto';
import { User, UserDocument } from '@/src/modules/user/schema/user.schema';
import { MailerService } from '@nestjs-modules/mailer';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { randomInt } from 'crypto';
import dayjs from 'dayjs';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private UserModel: Model<User>,
    private readonly mailerService: MailerService,
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
    token: string,
    subject: string,
    template?: string,
  ) {
    this.mailerService.sendMail({
      to: user.email,
      subject: 'Activate your account at Flix',
      template: 'register',
      context: {
        username: user.username ?? user.email,
        activationCode: token,
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
      activationToken: token,
      activationTokenExpired: dayjs().add(5, 'minutes').toString(),
    });

    this.sendEmail(user, token, 'Activate your account at Flix');

    return { _id: user._id };
  }

  async checkToken(data: ActivationTokenDto) {
    const { _id, activationToken } = data;

    const user = await this.UserModel.findOne({ _id });
    if (!user) throw new BadRequestException('Invalid credentials');

    if (user.isActive) {
      return { message: 'Account is already active' };
    }

    if (
      dayjs().isBefore(user.activationTokenExpired) &&
      activationToken === user.activationToken
    ) {
      await user.updateOne({ isActive: true });
      return { message: 'Account is active, you can login' };
    } else {
      throw new BadRequestException('Verify token is invalid or expired');
    }
  }

  async retryActive(email: string) {
    const user = await this.UserModel.findOne({ email });
    if (!user) throw new BadRequestException('Account does not exist');

    if (user.isActive)
      throw new BadRequestException('Account is already active');

    const token = this.generateToken();
    await user.updateOne({
      verifyToken: token,
      verifyTokenExpired: dayjs().add(5, 'minutes').toString(),
    });

    this.sendEmail(user, token, 'Activate your account at Flix');

    return { message: user._id };
  }

  async forgotPassword(data: ForgotPasswordDto) {
    const { email } = data;

    const user = await this.UserModel.findOne({ email });
    if (!user) throw new BadRequestException('Account does not exist');

    const token = this.generateToken();
    await user.updateOne({
      forgotPasswordToken: token,
      forgotPasswordTokenExpired: dayjs().add(5, 'minutes').toString(),
    });

    this.sendEmail(user, token, 'Forgot password email');

    return { message: user._id };
  }

  async newPassword(data: NewPasswordDto) {
    const { _id, forgotPasswordToken, password } = data;

    const user = await this.UserModel.findOne({ _id });
    if (!user) throw new BadRequestException('Account does not exist');

    if (
      dayjs().isBefore(user.forgotPasswordTokenExpired) &&
      forgotPasswordToken === user.forgotPasswordToken
    ) {
      const hashPassword = await hashPasswordHelper(password);
      await user.updateOne({ password: hashPassword });
      return { message: 'Password updated' };
    } else {
      throw new BadRequestException('Token is invalid or expired');
    }
  }
}
