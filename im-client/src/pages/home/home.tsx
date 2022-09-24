import React, { useEffect, useState } from "react";
import { readLocalItem, saveLocalItem } from "../../utils/storage";
import { useNavigate } from "react-router";
import { message } from "../../components/message/message";
import Input from "../../components/input/input";
import Button from "../../components/button/button";
import { socket } from "../../utils/soket";
import Request from "../../utils/axios";
import Contact from "../contact/contact";
import { Routes, Route, Link, Navigate } from "react-router-dom";
import Chat from "../chat/chat";
import { setUserinfo } from "../../store/features/userSlice";
import { useAppDispatch } from "../../hooks/storeHook";

export default function home() {
  const router = useNavigate();
  const dispatch = useAppDispatch();

  const [currentIndex, setCurrentIndex] = useState<number>(0);

  useEffect(() => {
    // message.error("哒咩哟");
    const token = readLocalItem("token");
    if (!token) {
      router("/login");
    }
    Request.get("/user").then((res) => {
      saveLocalItem("userinfo", res);
      dispatch(setUserinfo(res));
    });

    // console.log(msg);
  }, []);

  const sideList = [
    {
      name: "消息",
      to: "/",
    },
    {
      name: "联系人",
      to: "/contact",
    },
  ];

  return (
    <div className="relative h-[80vh] w-3/4 bg-cyan-900">
      {/* 顶部功能 */}
      <div className="flex justify-center items-center h-11 ">
        {/* <div>消息</div> */}
        <Input
          style="h-7 px-3 border-0 text-center rounded-xl bg-white bg-opacity-20 text-white placeholder-white focus:text-left"
          text="搜索"
        ></Input>
      </div>
      {/* 侧边功能 */}
      <div className="text-white w-16 flex flex-col justify-center items-center space-y-1 text-xs">
        {sideList.map((item, index) => (
          <Link
            to={item.to}
            key={item.name}
            onClick={() => setCurrentIndex(index)}
          >
            <div
              className={
                "flex items-center justify-center h-12 w-12 rounded hover:bg-cyan-700 cursor-pointer hover:text-cyan-200 " +
                (currentIndex === index ? "bg-cyan-700" : "")
              }
            >
              {item.name}
            </div>
          </Link>
        ))}
      </div>
      {/* 主要界面 */}
      <div className="absolute flex right-0 bottom-0 top-11 left-16 rounded-tl-lg bg-white overflow-hidden">
        <Routes>
          {/* 消息 */}
          <Route element={<Chat></Chat>} path="/*"></Route>
          {/* 联系人 */}
          <Route element={<Contact></Contact>} path="/contact/*"></Route>
          <Route element={<Navigate to={"/"} />} path="*"></Route>
        </Routes>
      </div>
    </div>
  );
}
