import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsMongoId } from 'class-validator';
import mongoose, { HydratedDocument } from 'mongoose';

export type FavouriteDocument = HydratedDocument<Favourite>;

@Schema({ timestamps: true })
export class Favourite extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  @IsMongoId({ message: 'Invalid ID format' })
  userId: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true })
  @IsMongoId({ message: 'Invalid ID format' })
  movieId: string;
}

export const FavouriteSchema = SchemaFactory.createForClass(Favourite);
