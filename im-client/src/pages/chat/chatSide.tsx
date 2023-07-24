import React, { useState, useEffect } from "react"
import { Route, Routes, Link, useNavigate, useLocation } from "react-router-dom"
import Request from "../../utils/axios"
// import ChatMain from "./chatMain";
import { UserInfoType } from "../../interfaces/user"
import time from "../../utils/time"
import { socket } from "../../utils/socket"
import { ChatType } from "../../interfaces/chat"
import { useChatStore, useBaseStore } from "../../store"

export default function ChatSide() {
  const { pathname } = useLocation()
  const [chatList, setChatList] = useState<ChatType[]>([])
  const [currentFriendInfo, setCurrentFriendInfo] = useState<UserInfoType>({
    nickname: "",
    avatar: "",
    bio: "",
    username: "",
  })
  const [currentChatId, setCurrentChatId] = useState<string>("")
  // 未读消息，map<chatId, number>
  // const [unreadMsg, setUnreadMsg] = useState<Map<string, number>>(new Map())
  const { setChatUnreadMsgMap, chatUnreadMsgMap } = useChatStore(state => state)
  const { userinfo } = useBaseStore()
  const router = useNavigate()

  useEffect(() => {
    console.log(pathname.split("/")[1])
    setCurrentChatId(pathname.split("/")[1])
    Request.get("/chat").then(res => {
      console.log("chatList", res.data.chatList)

      setChatList(res.data.chatList)
      res.data.chatList.forEach((chat: ChatType) => {
        socket.emit("joinChat", chat.chatId)
        if (chat.chatId != null) {
          setChatUnreadMsgMap(chat.chatId, "set", 0)
        }
      })
    })
    socket.on("notifyMessage", res => {
      const chatId = res.data.chatId
      if (currentChatId === chatId || userinfo.username === res.data.from) {
        setChatUnreadMsgMap(chatId, "set", 0)
      } else {
        setChatUnreadMsgMap(chatId, "change", 1)
      }
      setChatList(prev => {
        const index = prev.findIndex(item => item.chatId === chatId)
        if (index !== -1) {
          const newChatList = [...prev]
          newChatList[index].last_time = res.data.send_time
          newChatList[index].last_msg = res.data.msg
          newChatList[index].last_msg_id = res.data.msg_id
          newChatList[index].last_user_name = res.data.from
          return newChatList
        } else {
          return prev
        }
      })
    })
  }, [])

  const startChat = (friendInfo: UserInfoType, chatId: string) => {
    setChatUnreadMsgMap(chatId, "set", 0)
    setCurrentChatId(chatId)
    setCurrentFriendInfo(friendInfo)
    router(`/${chatId}`, { state: friendInfo })
  }

  return (
    <div className="p-2 space-y-1 w-full ">
      {chatList.map(item => {
        const friendInfo = item.friendInfo![0]
        return (
          <div
            key={item.chatId}
            onClick={() => startChat(friendInfo, item.chatId!)}
            className={
              "flex items-center space-x-2 px-2 py-2 rounded-md cursor-pointer hover:bg-slate-200 " +
              (currentChatId === item.chatId ? "bg-slate-200" : "")
            }
          >
            <div className="w-10 min-w-[2.5rem] h-10 rounded-full overflow-hidden">
              <img src={friendInfo?.avatar} alt="" />
            </div>
            <div className="flex-1 space-y-1 overflow-hidden">
              <div className="flex justify-between items-center text-sm ">
                <div className="font-semibold tracking-wide">
                  {friendInfo?.nickname}
                </div>
                <div className="text-xs text-gray-400">
                  {time(time(item?.last_time!)).calendar(null, {
                    sameDay: "A HH:mm", // The same day ( Today at 2:30 AM )
                    nextDay: "", // The next day ( Tomorrow at 2:30 AM )
                    nextWeek: "[下周] dddd", // The next week ( Sunday at 2:30 AM )
                    lastDay: "[昨天]", // The day before ( Yesterday at 2:30 AM )
                    lastWeek: "[上周] dddd", // Last week ( Last Monday at 2:30 AM )
                    sameElse: "DD/MM/YYYY", // Everything else ( 7/10/2011 )
                  }) ?? "未知"}
                </div>
              </div>
              <div className="flex justify-between text-xs max-w-full h-4 overflow-hidden text-gray-500">
                <div>
                  {item.last_msg_type === 0 ? item?.last_msg ?? "" : "[图片]"}
                </div>
                {chatUnreadMsgMap.get(item.chatId!) ? (
                  <div className="flex justify-center text-white rounded-full bg-red-400 border-box px-1 min-w-[1rem]">
                    {chatUnreadMsgMap.get(item.chatId!)}
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
