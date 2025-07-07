import { Prop, SchemaFactory } from '@nestjs/mongoose';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { HydratedDocument } from 'mongoose';

export type MovieDocument = HydratedDocument<Movie>;

export class Movie {
  // ****** Essentials fields ******
  @Prop({ required: true, trim: true })
  @IsNotEmpty()
  @IsString()
  title: string;

  @Prop({ required: true, trim: true })
  @IsNotEmpty()
  @IsString()
  description: string;

  @Prop({ required: true })
  @IsNotEmpty()
  duration: number; // seconds

  @Prop({ required: true })
  // @IsNotEmpty()
  videoUrl: string;

  @Prop({ min: 0, max: 10 })
  @Min(1, { message: 'Rating cannot be lower than 0' })
  @Max(5, { message: 'Rating cannot be higher than 10' })
  rating: number;

  // ****** Optional fields ******
  @Prop()
  @IsOptional()
  poster: string;

  @Prop()
  @IsOptional()
  trailer: string;

  @Prop({ required: true })
  @IsOptional()
  releaseDate: Date;

  @Prop([String])
  @IsArray()
  @IsOptional()
  genres: string[];

  @Prop([String])
  @IsArray()
  @IsOptional()
  cast: string[];

  @Prop()
  @IsOptional()
  director: string;

  // ****** Server interact only ******
  @Prop({ default: 0 })
  views: number;

  @Prop({ default: 'active' })
  status: string;
}

export const MovieSchema = SchemaFactory.createForClass(Movie);
