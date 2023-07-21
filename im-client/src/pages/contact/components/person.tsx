import React from 'react'
import Request from '../../../utils/axios'
import { Link, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../../hooks/storeHook'
import { message } from '../../../components/message/message'
import { Chat } from '../../../interfaces/chat'
import { UserInfoType } from '../../../interfaces/user'

interface PropsType {
  user: UserInfoType
}

export default function Person(props: PropsType) {
  const { user } = props
  const { userinfo } = useAppSelector((store) => store.user)

  const router = useNavigate()

  const startChat = async () => {
    Request.get(`/chat/query/${user.username}`).then((res) => {
      const { chatInfo } = res.data
      const { chatId }: Chat = chatInfo
      console.log(chatInfo)
      router(`/${chatId}`, { state: user })
    })
  }

  return (
    <div
      className="flex items-center space-x-2 py-2 px-4 rounded w-full cursor-pointer hover:bg-slate-200"
      onClick={startChat}
    >
      <div className="w-10 h-10 rounded-full overflow-hidden">
        <img src={user?.avatar} alt="" />
      </div>
      <div className="space-y-1">
        <div className="text-sm font-semibold">{user?.nickname}</div>
        <div className="text-xs text-gray-500">
          {user?.bio ?? '该用户什么也没写呢'}
        </div>
      </div>
    </div>
  )
}
