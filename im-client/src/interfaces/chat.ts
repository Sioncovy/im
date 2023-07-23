import { UserInfoType } from "./user"

export interface MessageType {
  msg_id: string
  chatId: string
  from: string // 发送者 id
  type: number // 0：普通消息  1：图片  2：文件
  msg: string
  send_time: number
}

export interface ChatType {
  chatId?: string
  from?: string
  to?: string
  friendInfo?: UserInfoType[]
  last_msg?: string
  last_msg_id?: string
  chat_name?: string
  last_user_name?: string
  last_time?: number
  chat_type?: number
  message_type?: number
  unread_count?: number
}
