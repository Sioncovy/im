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

  @Prop({ required: true })
  type: number; // 0：普通消息  1：图片  2：文件

  @Prop({ required: true })
  msg: string;

  @Prop({ required: true })
  send_time: number;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
