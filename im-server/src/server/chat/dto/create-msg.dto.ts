export class CreateMsgDto {
  msg_id: string;
  chatId: string;
  from: string;
  chat_type?: number;
  msg: string;
  message_type?: number;
  send_time: number;
}
