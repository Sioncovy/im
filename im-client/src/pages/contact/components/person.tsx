import React from "react";
import Request from "../../../utils/axios";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../hooks/storeHook";
import { message } from "../../../components/message/message";

interface PropsType {
  user: {
    username: string;
    avatar: string;
    nickname: string;
    signature?: string;
  };
}

export default function person(props: PropsType) {
  const { user } = props;
  const { userinfo } = useAppSelector((store) => store.user);

  const router = useNavigate();

  const startChat = async () => {
    Request.post("/chat/create", {
      from: userinfo?.username,
      to: user.username,
    }).then((res) => {
      if (res.code !== 200) return message.error(res.msg);
      // message.success(res.msg);
      router("/");
    });
    // console.log(userinfo);
  };

  return (
    <div
      className="flex items-center space-x-2 py-2 w-full cursor-pointer"
      onClick={startChat}
    >
      <div className="w-10 h-10 rounded-full overflow-hidden">
        <img src={user?.avatar} alt="" />
      </div>
      <div className="space-y-1">
        <div className="text-sm font-semibold">{user?.nickname}</div>
        <div className="text-xs text-gray-500">
          {user?.signature ?? "该用户什么也没写呢"}
        </div>
      </div>
    </div>
  );
}
