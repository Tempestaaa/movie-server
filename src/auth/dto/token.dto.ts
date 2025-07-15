import { User } from '@/src/modules/user/schema/user.schema';
import { PickType } from '@nestjs/mapped-types';
import { IsEmail, IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';

export class ActivationCodeDto extends PickType(User, [
  'activationCode',
] as const) {
  @IsMongoId({ message: 'Invalid ID format' })
  @IsNotEmpty({ message: 'ID cannot be empty' })
  _id: string;
}

export class ResendActiveDto {
  @IsMongoId({ message: 'Invalid ID format' })
  @IsOptional()
  _id: string;

  @IsEmail({}, { message: 'Invalid email format' })
  @IsOptional()
  email: string;
}

export class ForgotPasswordDto extends PickType(User, ['email'] as const) {}

export class RenewPasswordDto extends PickType(User, ['password'] as const) {
  @IsMongoId({ message: 'Invalid ID format' })
  @IsNotEmpty({ message: 'ID cannot be empty' })
  _id: string;
}
