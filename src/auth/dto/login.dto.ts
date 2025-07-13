import { User } from '@/src/modules/user/schema/user.schema';
import { PickType } from '@nestjs/mapped-types';
import { IsNotEmpty, Length } from 'class-validator';

export class LoginDto extends PickType(User, ['email'] as const) {
  @IsNotEmpty({ message: 'Password cannot be empty' })
  @Length(8, 20, {
    message: 'Password length must be between 8 and 20 characters',
  })
  password: string;
}
