import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ChatDocument = Chat & Document;

@Schema()
export class Chat {
  @Prop({ required: true })
  chatId: string;

  @Prop({ required: true })
  from: string;

  @Prop({ required: true })
  to: string;

  @Prop()
  last_msg: string;

  @Prop()
  last_msg_id: string;

  @Prop()
  chat_name: string;

  @Prop()
  last_user_name: string;

  @Prop()
  last_time: number;

  @Prop()
  chat_type: number; // 0.系统消息/1.个人聊天/2.群组消息

  @Prop()
  message_type: number; // 文字/图片/文件/音乐

  @Prop()
  unread_count: number;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
