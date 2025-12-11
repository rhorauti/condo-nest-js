import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Post } from './post.schema';

export type LikeDocument = HydratedDocument<Like>;

@Schema()
export class Like {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Post.name,
    required: true,
  })
  post: Post;

  @Prop({ required: true })
  senderId: number;
}

export const LikeSchema = SchemaFactory.createForClass(Like);
