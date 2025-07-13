import { User } from '@/src/modules/user/schema/user.schema';
import { PickType } from '@nestjs/mapped-types';
import { IsMongoId, IsNotEmpty } from 'class-validator';

export class ActivationTokenDto extends PickType(User, [
  'activationToken',
] as const) {
  @IsMongoId({ message: 'Invalid ID format' })
  @IsNotEmpty({ message: 'ID cannot be empty' })
  _id: string;
}

export class ForgotPasswordDto extends PickType(User, ['email'] as const) {}

export class NewPasswordDto extends PickType(User, [
  'password',
  'forgotPasswordToken',
] as const) {
  @IsMongoId({ message: 'Invalid ID format' })
  @IsNotEmpty({ message: 'ID cannot be empty' })
  _id: string;
}
