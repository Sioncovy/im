import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MessageDocument = Message & Document;

@Schema()
export class Message {
  @Prop({ required: true })
  msg_id: string;

  @Prop({ required: true })
  chatId: string; // 会话 id

  @Prop({ required: true })
  from: string; // 发送者 id

  @Prop()
  chat_type: number; // 0.系统消息/1.个人聊天/2.群组消息

  @Prop({ required: true })
  msg: string;

  @Prop()
  message_type: number; // 文字/图片/文件/音乐

  @Prop({ required: true })
  send_time: number;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
