import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  IsMongoId,
  IsNotEmpty,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';
import mongoose, { HydratedDocument } from 'mongoose';

export type CommentDocument = HydratedDocument<Comment>;

@Schema({ timestamps: true })
export class Comment extends Document {
  @Prop({ required: true, trim: true })
  @IsNotEmpty({ message: 'Comment cannot be empty' })
  @IsString()
  @Length(0, 200, { message: 'Maximum 200 characters' })
  content: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  @IsMongoId({ message: 'Invalid ID format' })
  userId: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true })
  @IsMongoId({ message: 'Invalid ID format' })
  movieId: string;

  @Prop({ min: 1, max: 5 })
  @Min(1, { message: 'Rating cannot be lower than 1' })
  @Max(5, { message: 'Rating cannot be higher than 5' })
  rating: number;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
