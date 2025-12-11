import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Post } from './post.schema';

@Schema()
export class Comment {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Post.name,
    required: true,
  })
  post: Post;

  @Prop({ required: true })
  senderId: number;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
