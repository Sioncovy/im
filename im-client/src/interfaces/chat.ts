export interface Messgae {}

export interface Chat {
  chatId: string;
  from: string;
  to: string;
  last_msg?: string;
  last_msg_id?: string;
  chat_name?: string;
  last_user_name?: string;
  last_time?: number;
  chat_type?: number;
  message_type?: number;
  unread_count?: number;
}
