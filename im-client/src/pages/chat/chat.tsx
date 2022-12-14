/*
 * @Author: Sioncovy 1298184727@qq.com
 * @Date: 2022-10-22 00:22:38
 * @LastEditors: Sioncovy 1298184727@qq.com
 * @LastEditTime: 2022-10-26 14:23:26
 * @FilePath: \im\im-client\src\pages\chat\chat.tsx
 * @Description:
 *
 * Copyright (c) 2022 by Sioncovy 1298184727@qq.com, All Rights Reserved.
 */
import React, { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/storeHook";
import { useParams, useLocation } from "react-router";
import Request from "../../utils/axios";
import { UserInfoType } from "../../interfaces/user";
import Message from "./components/message";
import InputBox from "./components/inputbox";
import { socket } from "../../utils/socket";
import Button from "../../components/button/button";

interface MsgResponse {
  chatId: string;
  from: string;
  msg: string;
  msg_id: string;
  send_time: number;
}

export default function ChatMain() {
  const { chatId } = useParams();
  const { state } = useLocation();
  const friendinfo = state as UserInfoType;
  const { userinfo } = useAppSelector((store) => store.user);

  const [msgList, setMsgList] = useState([]);
  const msgListRef = useRef<HTMLDivElement>(null);

  const scollToBottom = () => {
    if (msgListRef && msgListRef.current) {
      msgListRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    // console.log(state);
    Request.get(`/chat/msg/${chatId}`).then((res) => {
      setMsgList(res.data.msgList);
      scollToBottom();
    });
    socket.emit("updateChat", (res: any) => {
      console.log(res);
    });
    // socket.on("updateChat", (res) => {-+++++++++
    //   console.log(res);
    // });
  }, []);

  useEffect(() => {
    scollToBottom();
  }, [msgList]);

  return (
    <div className="flex flex-col relative w-full h-full bg-slate-50">
      <div className="h-16 px-4 space-x-3 flex items-center border-b-2">
        <div className="w-10 h-10 rounded-full overflow-hidden">
          <img src={friendinfo?.avatar} alt="" />
        </div>
        <div className="text-lg font-semibold">{friendinfo?.nickname}</div>
      </div>
      <div className="flex-1 flex flex-col px-4 py-2 space-y-4 w-full overflow-auto">
        {msgList?.map((item: MsgResponse) => (
          <Message
            key={item.msg_id}
            msginfo={item}
            userinfo={item.from === userinfo?.username ? userinfo : friendinfo}
            isSelf={item.from === userinfo?.username}
          />
        ))}
        <div ref={msgListRef}></div>
      </div>
      {/* <div className="absolute left-4 right-4 bottom-4"> */}
      <div className="h-20 px-4 w-full self-end flex items-center">
        <InputBox chatId={chatId!} from={userinfo!.username}></InputBox>
      </div>
    </div>
  );
}
