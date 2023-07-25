import React, { useEffect, useRef, useState } from "react"
import { useParams, useLocation } from "react-router"
import Request from "../../utils/axios"
import { UserInfoType } from "../../interfaces/user"
import Message from "./components/message"
import InputBox from "./components/inputbox"
import { socket } from "../../utils/socket"
import { useBaseStore, useChatStore } from "../../store"
import Button from "../../components/button/button"
import { useScroll } from "../../hooks/useScroll"
import { debounce } from "lodash"

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

  const chatBoxRef = useRef<HTMLDivElement>(null)

  const [pageNum, setPageNum] = useState<number | undefined>(undefined)
  // const pageNumRef = useRef(pageNum)
  const [pageSize, setPageSize] = useState(20)

  const [chatHeight, setChatHeight] = useState(0)
  const [displayLoadMore, setDisplayLoadMore] = useState(true)

  const scrollToBottom = () => {
    if (msgListRef && msgListRef.current) {
      msgListRef.current.scrollIntoView()
    }
  }

  const scrollToBefore = () => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTo(
        0,
        chatBoxRef.current.scrollHeight - chatHeight
      )
    }
  }

  const getMsgList = async () => {
    const res = await Request.get(
      `/chat/msg/${chatId}?pageNum=${pageNum}&pageSize=${pageSize}`
    )
    if (res.data.msgList.length === 0) {
      setDisplayLoadMore(false)
    } else {
      setDisplayLoadMore(true)
    }
    setMsgList(prev => [...res.data.msgList, ...prev])
  }

  useEffect(() => {
    if (pageNum === undefined) return
    getMsgList()
  }, [pageNum])

  useEffect(() => {
    console.log("chatId", chatId)
    const cleanup = () => {
      setMsgList([])
      if (pageNum !== 0) {
        setPageNum(0)
      } else {
        console.log("pageNum", pageNum)
        getMsgList()
      }
    }
    cleanup()

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
    if (pageNum === 0) {
      scrollToBottom()
    } else {
      scrollToBefore()
    }
    setChatHeight(chatBoxRef.current!.scrollHeight)
  }, [msgList])

  return (
    <div className="flex flex-col relative w-full h-full bg-slate-50">
      <div className="h-16 px-4 space-x-3 flex items-center border-b-2">
        <div className="w-10 h-10 rounded-full overflow-hidden">
          <img src={friendInfo?.avatar} alt="" />
        </div>
        <div className="text-lg font-semibold">{friendInfo?.nickname}</div>
      </div>
      <div
        ref={chatBoxRef}
        className="flex-1 flex flex-col px-4 py-2 space-y-4 w-full overflow-auto"
      >
        <Button
          style={displayLoadMore ? "" : "hidden"}
          onClick={() => setPageNum(prev => prev! + 1)}
        >
          加载更多
        </Button>
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
