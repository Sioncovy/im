import React, { useState, useEffect } from 'react'
import { Route, Routes, Link, useNavigate } from 'react-router-dom'
import Request from '../../utils/axios'
// import ChatMain from "./chatMain";
import { setFriendinfo } from '../../store/features/userSlice'
import { useAppDispatch, useAppSelector } from '../../hooks/storeHook'
import { UserInfoType } from '../../interfaces/user'
import time from '../../utils/time'
import { socket } from '../../utils/socket'

interface Chat {
  chatId: string
  from: string
  to: string
  friendInfo: UserInfoType[]
  last_msg?: string
  last_msg_id?: string
  chat_name?: string
  last_user_name?: string
  last_time?: number
  chat_type?: number
  message_type?: number
  unread_count?: number
}

export default function ChatSide() {
  const { userinfo } = useAppSelector((store) => store.user)

  const [chatList, setChatList] = useState<Chat[]>([])
  const [currentFriendInfo, setCurrentFriendInfo] = useState<UserInfoType>({
    nickname: '',
    avatar: '',
    bio: '',
    username: ''
  })
  const [currentChatId, setCurrentChatId] = useState<string>('')
  // 未读消息，map<chatId, number>
  const [unreadMsg, setUnreadMsg] = useState<Map<string, number>>(new Map())

  const router = useNavigate()

  const dispatch = useAppDispatch()

  useEffect(() => {
    Request.get('/chat').then((res) => {
      console.log('chatList', res.data.chatList)

      setChatList(res.data.chatList)
      res.data.chatList.forEach((chat: Chat) => {
        socket.emit('joinChat', chat.chatId)
        setUnreadMsg((prev) => {
          const map = new Map(prev)
          map.set(chat.chatId, 0)
          return map
        })
      })
    })
    socket.on('notifyMessage', (res) => {
      setUnreadMsg((prev) => {
        const map = new Map(prev)
        if (currentChatId === res.data.chatId) {
          map.set(res.data.chatId, 0)
        } else {
          map.set(res.data.chatId, prev.get(res.data.chatId)! + 1)
        }
        return map
      })
    })
  }, [])

  const startChat = (friendinfo: UserInfoType, chatId: string) => {
    setUnreadMsg((prev) => {
      const map = new Map(prev)
      map.set(chatId, 0)
      return map
    })
    setCurrentChatId(chatId)
    setCurrentFriendInfo(friendinfo)
    router(`/${chatId}`, { state: friendinfo })
  }

  return (
    <div className="p-2 space-y-1 w-full ">
      {chatList.map((item) => {
        const friendInfo = item?.friendInfo[0]
        return (
          <div
            key={item.chatId}
            onClick={() => startChat(friendInfo, item.chatId)}
            className={
              'flex items-center space-x-2 px-2 py-2 rounded-md cursor-pointer hover:bg-slate-200 ' +
              (currentFriendInfo.username === friendInfo.username
                ? 'bg-slate-200'
                : '')
            }
          >
            <div className="w-10 h-10 rounded-full overflow-hidden">
              <img src={friendInfo?.avatar} alt="" />
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex justify-between items-center text-sm ">
                <div className="font-semibold tracking-wide">
                  {friendInfo?.nickname}
                </div>
                <div className="text-xs text-gray-400">
                  {time(time(item?.last_time!)).calendar(null, {
                    sameDay: 'A HH:mm', // The same day ( Today at 2:30 AM )
                    nextDay: '', // The next day ( Tomorrow at 2:30 AM )
                    nextWeek: '[下周] dddd', // The next week ( Sunday at 2:30 AM )
                    lastDay: '[昨天]', // The day before ( Yesterday at 2:30 AM )
                    lastWeek: '[上周] dddd', // Last week ( Last Monday at 2:30 AM )
                    sameElse: 'DD/MM/YYYY' // Everything else ( 7/10/2011 )
                  }) ?? '未知'}
                </div>
              </div>
              <div className="flex justify-between text-xs max-w-full h-4 overflow-hidden text-gray-500">
                <div>{item?.last_msg ?? ''}</div>
                {unreadMsg.get(item.chatId) ? (
                  <div className="flex justify-center text-white rounded-full bg-red-400 border-box px-1 min-w-[1rem]">
                    {unreadMsg.get(item.chatId)}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
