import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { POST_TYPE } from '../../core/enum/post.enum';

export type PostDocument = HydratedDocument<Post>;

@Schema({ timestamps: true })
export class Comment {
  @Prop({ required: true })
  senderId: number;

  @Prop({ required: true })
  description: string;
}

const CommentSchema = SchemaFactory.createForClass(Comment);

@Schema({ timestamps: true }) // Auto-adds createdAt, updatedAt
export class Post {
  @Prop({ type: String, enum: POST_TYPE })
  type: POST_TYPE;

  @Prop()
  profileFallback: string;

  @Prop()
  profileUrl: string;

  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop({ type: [String] })
  mediaList?: string[];

  @Prop({ default: false })
  isSaved: boolean;

  @Prop({ type: [CommentSchema], default: [] })
  comments: Comment[];

  @Prop({ type: [Number], default: [] })
  likedBy: number[];

  @Prop({ required: true, index: true })
  senderId: number;
}

export const PostSchema = SchemaFactory.createForClass(Post);
