/*
 * @Author: Sioncovy 1298184727@qq.com
 * @Date: 2022-10-22 00:22:38
 * @LastEditors: Sioncovy 1298184727@qq.com
 * @LastEditTime: 2022-10-26 14:23:49
 * @FilePath: \im\im-client\src\pages\home\home.tsx
 * @Description:
 *
 * Copyright (c) 2022 by Sioncovy 1298184727@qq.com, All Rights Reserved.
 */
/*
 * @Author: Sioncovy 1298184727@qq.com
 * @Date: 2022-10-22 00:22:38
 * @LastEditors: Sioncovy 1298184727@qq.com
 * @LastEditTime: 2022-10-26 02:30:36
 * @FilePath: \im\im-client\src\pages\home\home.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React, { useEffect, useState } from "react";
import { readLocalItem, saveLocalItem } from "../../utils/storage";
import { useNavigate } from "react-router";
import { message } from "../../components/message/message";
import Input from "../../components/input/input";
import Button from "../../components/button/button";
import { socket } from "../../utils/socket";
import Request from "../../utils/axios";
import Contact from "../contact/contact";
import { Routes, Route, Link, Navigate, useLocation } from "react-router-dom";
import Chat from "../chat/chat";
import { setUserinfo } from "../../store/features/userSlice";
import { useAppDispatch } from "../../hooks/storeHook";
import { UserInfoType } from "../../interfaces/user";
import ContactSide from "../contact/contactSide";
import ChatSide from "../chat/chatSide";

export default function home() {
  const router = useNavigate();
  const dispatch = useAppDispatch();

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [user, setUser] = useState<UserInfoType>();

  useEffect(() => {
    // message.error("哒咩哟");

    // console.log(useLocation());

    const token = readLocalItem("token");
    if (!token) {
      router("/login");
    }
    Request.get("/user").then((res: any) => {
      saveLocalItem("userinfo", res);
      setUser(res);
      dispatch(setUserinfo(res));
    });

    // console.log(msg);
  }, []);

  // const location = useLocation();
  // console.log(location);

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
  ];

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
        <div className="flex justify-center items-center">
          <Input
            style="h-8 w-full mx-3 mt-6 mb-3 px-3 border-1 text-center rounded-xl bg-white placeholder-gray-400 focus:text-left"
            text="搜索"
            value=""
          />
        </div>
        <div className="">
          <Routes>
            <Route element={<ChatSide></ChatSide>} path="/*"></Route>
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
        </Routes>
      </div>
    </div>
  );
}
