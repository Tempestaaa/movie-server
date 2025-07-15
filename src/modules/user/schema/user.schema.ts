import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

export enum Role {
  User = 'user',
  Admin = 'admin',
}

@Schema({ timestamps: true })
export class User {
  // ****** Essentials fields ******
  @Prop({ required: true, unique: true, trim: true })
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email cannot be empty' })
  email: string;

  @Prop({ required: true, trim: true })
  @IsNotEmpty({ message: 'Password cannot be empty' })
  @IsString()
  password: string;

  @Prop({ required: true, trim: true, maxlength: 50 })
  @IsNotEmpty({ message: 'Username cannot be empty' })
  @IsString()
  @Length(1, 50, { message: 'Maximum 50 characters' })
  username: string;

  // ****** Optional fields ******
  @Prop({ trim: true, maxlength: 50 })
  @IsString()
  @IsOptional()
  firstName: string;

  @Prop({ trim: true, maxlength: 50 })
  @IsString()
  @IsOptional()
  lastName: string;

  @Prop()
  @IsOptional()
  avatar: string;

  // ****** Server interact only ******
  @Prop({ default: false })
  @IsBoolean()
  isActive: boolean;

  @Prop({ enum: Role, default: Role.User })
  @IsEnum(Role)
  role: string;

  // ****** Token && expired date ******
  @Prop()
  @IsNotEmpty({ message: 'Code cannot be empty' })
  activationCode: string;

  @Prop()
  activationCodeExpired: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
