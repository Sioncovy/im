import { PartialType } from '@nestjs/mapped-types';
import { CreateChatDto } from './create-chat.dto';

export class UpdateChatDto extends PartialType(CreateChatDto) {
  last_msg?: string;
  last_msg_id?: string;
  chat_name?: string;
  last_user_name?: string;
  last_time?: number;
  chat_type?: number;
  message_type?: number;
  unread_count?: number;
}
