import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MessageDocument = HydratedDocument<Message>;

@Schema({ timestamps: true }) // Auto-adds createdAt, updatedAt
export class Message {
  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  senderId: number; // ID from Postgres User

  @Prop({ default: false })
  isRead: boolean;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
