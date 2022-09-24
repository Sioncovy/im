import React, { useEffect, useState } from "react";
import RequestItem from "./components/request";
import PersonItem from "./components/person";
import Request from "../../utils/axios";
import { readLocalItem, saveLocalItem } from "../../utils/storage";
import { Routes, Route, Link } from "react-router-dom";

interface RequestType {
  friend_id: string;
  id: string;
  reason: string;
  type: 0;
}

interface ContactType {
  username: string;
  avatar: string;
  nickname: string;
}

export default function contact() {
  const [requestList, setRequestList] = useState<RequestType[]>([]);
  const [contactList, setContactList] = useState<ContactType[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(1);

  const sideList = [
    {
      name: "好友申请",
      to: "/contact/request",
      icon: "request.svg",
    },
    {
      name: "联系人",
      to: "/contact",
      icon: "contact.svg",
    },
  ];

  useEffect(() => {
    const userinfo = readLocalItem("userinfo");
    Request.get(`/contact/getAllRequest?username=${userinfo.username}`).then(
      (res) => {
        // console.log(res);
        const data: { requests: RequestType[] } = res.data as unknown as {
          requests: RequestType[];
        };
        setRequestList(data.requests);
      }
    );
    Request.get(`/contact?id=${userinfo.username}`).then((res) => {
      const friends = res.data.friendsList as Array<any>;
      setContactList(friends);
    });
  }, []);

  return (
    <>
      <div className="p-2 space-y-1 w-1/4 bg-white">
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
              <div className="w-6 h-6 rounded-full overflow-hidden">
                <img src={`/src/assets/contact/${item.icon}`} alt="" />
              </div>
              <div className="">{item.name}</div>
            </div>
          </Link>
        ))}
      </div>
      <div className="w-3/4 bg-slate-50 px-2 py-1">
        <div className="flex items-center justify-between px-2 w-full rounded hover:bg-slate-200">
          <Routes>
            {/* 好友申请列表 */}
            <Route
              element={
                <>
                  {requestList?.map((item) => (
                    <RequestItem
                      key={item.friend_id}
                      questInfo={item}
                    ></RequestItem>
                  ))}
                </>
              }
              path="request"
            ></Route>
            {/* 好友列表 */}
            <Route
              element={
                <>
                  {contactList?.map((item) => (
                    <PersonItem key={item.username} user={item}></PersonItem>
                  ))}
                </>
              }
              path=""
            ></Route>
          </Routes>
        </div>
      </div>
    </>
  );
}
