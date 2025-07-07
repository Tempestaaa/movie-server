import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { HydratedDocument } from 'mongoose';

export type GenreDocument = HydratedDocument<Genre>;

@Schema({ timestamps: true })
export class Genre {
  @Prop({ required: true, unique: true, trim: true })
  @IsNotEmpty({ message: 'Name cannot be empty' })
  @IsString()
  name: string;

  @Prop()
  @IsString()
  description: string;

  @Prop()
  @IsOptional()
  image: string;
}

export const GenreSchema = SchemaFactory.createForClass(Genre);
