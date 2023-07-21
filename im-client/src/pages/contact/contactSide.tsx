/*
 * @Author: Sioncovy 1298184727@qq.com
 * @Date: 2022-10-26 02:07:07
 * @LastEditors: Sioncovy 1298184727@qq.com
 * @LastEditTime: 2022-10-26 12:23:28
 * @FilePath: \im\im-client\src\pages\contact\contactSide.tsx
 * @Description:
 *
 * Copyright (c) 2022 by Sioncovy 1298184727@qq.com, All Rights Reserved.
 */
import React, { useEffect, useState } from "react";
import RequestItem from "./components/request";
import PersonItem from "./components/person";
import Request from "../../utils/axios";
import { readLocalItem, saveLocalItem } from "../../utils/storage";
import { Routes, Route, Link } from "react-router-dom";

interface RequestType {
  friend_username: string;
  id: string;
  reason: string;
  type: 0;
}

interface ContactType {
  username: string;
  avatar: string;
  nickname: string;
}

export default function ContactSide() {
  const [currentIndex, setCurrentIndex] = useState<number>(1);

  const sideList = [
    {
      name: "好友申请",
      to: "/contact/request",
      icon: "/src/assets/contact/request.svg",
    },
    {
      name: "联系人",
      to: "/contact",
      icon: "/src/assets/contact/contacts.svg",
    },
  ];
  return (
    <div className="p-2 space-y-1">
      {/* 侧边选项 */}
      {sideList.map((item, index) => (
        <Link
          to={item.to}
          key={item.name}
          onClick={() => setCurrentIndex(index)}
        >
          <div
            className={
              "flex items-center px-3 space-x-3 text-sm w-full h-12 rounded-md cursor-pointer hover:bg-slate-200 " +
              (index === currentIndex ? "bg-slate-200" : " ")
            }
          >
            <div className="w-6 h-6 overflow-hidden">
              <img src={item.icon} alt="" />
            </div>
            <div className="">{item.name}</div>
          </div>
        </Link>
      ))}
    </div>
  );
}
