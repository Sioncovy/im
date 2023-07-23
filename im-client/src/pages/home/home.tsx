import React, { useEffect, useState } from "react"
import { readLocalItem, saveLocalItem } from "../../utils/storage"
import { useNavigate } from "react-router"
import { message } from "../../components/message/message"
import Input from "../../components/input/input"
import Button from "../../components/button/button"
import { socket } from "../../utils/socket"
import Request from "../../utils/axios"
import Contact from "../contact/contact"
import { Routes, Route, Link, Navigate, useLocation } from "react-router-dom"
import Chat from "../chat/chat"
import { UserInfoType } from "../../interfaces/user"
import ContactSide from "../contact/contactSide"
import ChatSide from "../chat/chatSide"
import Setting from "../user/setting"
import SettingSide from "../user/settingSide"
import { useBaseStore } from "../../store"

export default function home() {
  const router = useNavigate()

  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const [user, setUser] = useState<UserInfoType>()
  const { setUserInfo } = useBaseStore()

  useEffect(() => {
    const token = readLocalItem("token")
    if (!token) {
      router("/login")
    }
    Request.get("/user").then((res: any) => {
      saveLocalItem("userinfo", res)
      setUser(res)
      setUserInfo(res)
    })
  }, [])

  const sideList = [
    {
      name: "消息",
      to: "/",
      icon: "/src/assets/homeSide/msg.svg",
    },
    {
      name: "联系人",
      to: "/contact",
      icon: "/src/assets/homeSide/contacts.svg",
    },
    {
      name: "设置",
      to: "/setting",
      icon: "/src/assets/homeSide/setting.svg",
    },
  ]

  return (
    <div className="flex h-[900px] w-[1440px] bg-slate-300">
      {/* 侧边栏 */}
      <div className="flex flex-col justify-between items-center w-[5%] py-6">
        <div className="flex justify-center items-center left-4 top-2 w-8 h-8 rounded-full overflow-hidden  z-10">
          <img className="" src={user?.avatar} alt="" />
        </div>

        <div className="text-white w-16 flex flex-col justify-center items-center space-y-4 text-xs">
          {sideList.map((item, index) => (
            <Link
              to={item.to}
              key={item.name}
              onClick={() => setCurrentIndex(index)}
              className="flex justify-center"
            >
              <div className="w-1/2 rounded-full overflow-hidden">
                <img src={item.icon} alt="" />
              </div>
            </Link>
          ))}
        </div>
      </div>
      {/* 消息栏 */}
      <div className=" bg-white w-[20%] border-1">
        {/*<div className="flex justify-center items-center">*/}
        {/*  <Input*/}
        {/*    style="h-8 w-full mx-3 mt-6 mb-3 px-3 border-1 text-center rounded-xl bg-white placeholder-gray-400 focus:text-left"*/}
        {/*    text="搜索"*/}
        {/*    value=""*/}
        {/*  />*/}
        {/*</div>*/}
        <div className="">
          <Routes>
            <Route element={<ChatSide></ChatSide>} path="/*"></Route>
            <Route
              element={<SettingSide></SettingSide>}
              path="/setting/*"
            ></Route>
            <Route
              element={<ContactSide></ContactSide>}
              path="/contact/*"
            ></Route>
          </Routes>
        </div>
      </div>
      {/* 主要内容 */}
      <div className="flex-5 w-[75%] bg-gray-100">
        <Routes>
          <Route element={<Chat></Chat>} path=":chatId"></Route>
          <Route element={<Contact></Contact>} path="/contact/*"></Route>
          <Route element={<Setting></Setting>} path="/setting/*"></Route>
        </Routes>
      </div>
    </div>
  )
}
