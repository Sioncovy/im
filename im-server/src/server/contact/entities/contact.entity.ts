import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ContactDocument = Contact & Document;

@Schema()
export class Contact {
  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  friend_username: string;

  @Prop()
  relation_count: number; // 亲密度

  @Prop()
  relation: string;

  @Prop()
  type: number; // 0.申请中 1.正常好友 2.拉黑
}

export const ContactSchema = SchemaFactory.createForClass(Contact);
