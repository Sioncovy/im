/*
 * @Author: Sioncovy 1298184727@qq.com
 * @Date: 2022-10-26 11:31:49
 * @LastEditors: Sioncovy 1298184727@qq.com
 * @LastEditTime: 2022-10-26 12:00:25
 * @FilePath: \im\im-client\src\pages\chat\chatSide.tsx
 * @Description:
 *
 * Copyright (c) 2022 by Sioncovy 1298184727@qq.com, All Rights Reserved.
 */
import React, { useState, useEffect } from "react";
import { Route, Routes, Link, useNavigate } from "react-router-dom";
import Request from "../../utils/axios";
import ChatMain from "./chatMain";
import { setFriendinfo } from "../../store/features/userSlice";
import { useAppDispatch, useAppSelector } from "../../hooks/storeHook";
import { UserInfoType } from "../../interfaces/user";
import time from "../../utils/time";
import { socket } from "../../utils/socket";

interface Chat {
  chatId: string;
  from: string;
  to: string;
  friendInfo: UserInfoType[];
  last_msg?: string;
  last_msg_id?: string;
  chat_name?: string;
  last_user_name?: string;
  last_time?: number;
  chat_type?: number;
  message_type?: number;
  unread_count?: number;
}

export default function ChatSide() {
  const { userinfo } = useAppSelector((store) => store.user);

  const [chatList, setChatList] = useState<Chat[]>([]);
  const [currentFriendInfo, setCurrentFriendInfo] = useState<UserInfoType>({
    nickname: "小月",
    avatar: "http://182.61.49.77:3000//imgs/3.jpg",
    signature: "嘻嘻，你有觉得我很可爱吗？",
    username: "2529035255@qq.com",
  });

  const router = useNavigate();

  const dispatch = useAppDispatch();

  useEffect(() => {
    Request.get("/chat").then((res) => {
      setChatList(res.data.chatList);
    });
  }, []);

  const startChat = (friendinfo: UserInfoType, chatId: string) => {
    setCurrentFriendInfo(friendinfo);
    router(`/${chatId}`, { state: friendinfo });
  };

  return (
    <div className="p-2 space-y-1 w-full ">
      {chatList.map((item) => {
        const friendInfo = item?.friendInfo[0];
        return (
          <div
            key={item.chatId}
            onClick={() => startChat(friendInfo, item.chatId)}
            className={
              "flex items-center space-x-2 px-2 py-2 rounded-md cursor-pointer hover:bg-slate-200 " +
              (currentFriendInfo.username === friendInfo.username
                ? "bg-slate-200"
                : "")
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
                    sameDay: "A HH:mm", // The same day ( Today at 2:30 AM )
                    nextDay: "", // The next day ( Tomorrow at 2:30 AM )
                    nextWeek: "[下周] dddd", // The next week ( Sunday at 2:30 AM )
                    lastDay: "[昨天]", // The day before ( Yesterday at 2:30 AM )
                    lastWeek: "[上周] dddd", // Last week ( Last Monday at 2:30 AM )
                    sameElse: "DD/MM/YYYY", // Everything else ( 7/10/2011 )
                  }) ?? "未知"}
                </div>
              </div>
              <div className="text-xs max-w-full h-4 overflow-hidden text-gray-500">
                {item?.last_msg ?? ""}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
