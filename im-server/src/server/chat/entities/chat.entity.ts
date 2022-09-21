import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export type ChatDocument = Chat & Document;

@Schema()
export class Chat {
  @Prop({ required: true })
  chatId: string;

  @Prop({ required: true })
  from: string;

  @Prop({ required: true })
  to: string;

  @Prop({ required: true })
  last_msg: string;

  @Prop({ required: true })
  last_msg_id: string;

  @Prop({ required: true })
  chat_name: string;

  @Prop({ required: true })
  last_user_name: string;

  @Prop({ required: true })
  last_time: number;

  @Prop({ required: true })
  chat_type: number; // 0.系统消息/1.个人聊天/2.群组消息

  @Prop({ required: true })
  message_type: number; // 文字/图片/文件/音乐

  @Prop({ required: true })
  unread_count: number;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
