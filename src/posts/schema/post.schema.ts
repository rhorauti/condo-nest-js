import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { POST_TYPE } from '../../common/enum/post.enum';

export type PostDocument = HydratedDocument<Post>;

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

  @Prop({ default: 0 })
  commentsQty: number;

  @Prop({ default: 0 })
  likesQty: number;

  @Prop({ required: true, index: true })
  senderId: number; // ID from Postgres User
}

export const PostSchema = SchemaFactory.createForClass(Post);
