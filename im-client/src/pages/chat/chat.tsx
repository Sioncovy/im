import React, { useEffect, useRef, useState } from "react"
import { useParams, useLocation } from "react-router"
import Request from "../../utils/axios"
import { UserInfoType } from "../../interfaces/user"
import Message from "./components/message"
import InputBox from "./components/inputbox"
import { socket } from "../../utils/socket"
import { useBaseStore, useChatStore } from "../../store"
import Button from "../../components/button/button"

interface MsgResponse {
  chatId: string
  from: string
  msg: string
  msg_id: string
  send_time: number
  type: number
}

export default function ChatMain() {
  const { chatId } = useParams()
  const { state } = useLocation()
  const friendInfo = state as UserInfoType
  // const userinfo = readLocalItem('userinfo')
  const userinfo = useBaseStore(state => state.userinfo)

  const chatStore = useChatStore(state => state)

  const [msgList, setMsgList] = useState<MsgResponse[]>([])
  const msgListRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    if (msgListRef && msgListRef.current) {
      msgListRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }

  useEffect(() => {
    console.log("chatId", chatId)

    Request.get(`/chat/msg/${chatId}`).then(res => {
      setMsgList(res.data.msgList)
      scrollToBottom()
    })
    socket.on("notifyMessage", (res: any) => {
      console.log(res)
      if (chatId === res.data.chatId) {
        // const store = useChatStore(state => state)
        setMsgList(prev => [...prev, res.data])
        chatStore.setChatUnreadMsgMap(chatId!, "set", 0)
      }
    })
    return () => {
      socket.off("notifyMeesage")
    }
  }, [chatId])

  useEffect(() => {
    console.log(chatStore.count)
    scrollToBottom()
  }, [msgList, chatStore.count])

  return (
    <div className="flex flex-col relative w-full h-full bg-slate-50">
      <div className="h-16 px-4 space-x-3 flex items-center border-b-2">
        <div className="w-10 h-10 rounded-full overflow-hidden">
          <img src={friendInfo?.avatar} alt="" />
        </div>
        <div className="text-lg font-semibold">{friendInfo?.nickname}</div>
      </div>
      <div className="flex-1 flex flex-col px-4 py-2 space-y-4 w-full overflow-auto">
        {msgList?.map((item: MsgResponse) => (
          <Message
            key={item.msg_id}
            msgInfo={item}
            userinfo={item.from === userinfo?.username ? userinfo : friendInfo}
            isSelf={item.from === userinfo?.username}
          />
        ))}
        <div ref={msgListRef}></div>
      </div>
      {/* <div className="absolute left-4 right-4 bottom-4"> */}
      <div className="h-20 px-4 w-full self-end flex items-center">
        <InputBox
          chatId={chatId}
          from={userinfo.username}
          to={friendInfo.username}
        ></InputBox>
      </div>
    </div>
  )
}
