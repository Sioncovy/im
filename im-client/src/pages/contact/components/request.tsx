import React, { useEffect, useState } from "react";
import Button from "../../../components/button/button";
import Request from "../../../utils/axios";
import { message } from "../../../components/message/message";

interface PropsType {
  questInfo: {
    friend_id: string;
    id: string;
    reason: string;
    type: 0;
  };
}

interface UserType {
  username: string;
  avatar: string;
  nickname: string;
}

export default function request(props: PropsType) {
  const { questInfo } = props;

  const [user, setUser] = useState<UserType>();

  useEffect(() => {
    Request.get(`/user/query?username=${questInfo.id}`).then((res) => {
      const t = res.data as unknown as { users: UserType[] };
      setUser(t.users[0]);
    });
  }, []);

  const agreeHandle = async () => {
    const res = await Request.get(
      `/contact/agree?id=${questInfo.id}&fid=${questInfo.friend_id}`
    );
    if (res.code !== 200) {
      message.error(res.msg);
    }
    message.success(res.msg);
  };

  return (
    <>
      <div className="flex items-center space-x-2 py-2">
        <div className="w-10 h-10 rounded-full overflow-hidden">
          <img
            src={user?.avatar ?? "http://182.61.49.77:3000//imgs/4.jpg"}
            alt=""
          />
        </div>
        <div className="space-y-1">
          <div className="text-sm font-semibold">{user?.nickname}</div>
          <div className="text-xs text-gray-500">{questInfo.reason}</div>
        </div>
      </div>
      <div className="">
        <Button type="primary" size="small" onClick={agreeHandle}>
          同意
        </Button>
      </div>
    </>
  );
}
