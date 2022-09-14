import React, { useState } from "react";
import Button from "../../components/button/button";
import Input from "../../components/input/input";
import Request from "../../utils/axios";

export default function login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const loginHandle = async () => {
    const data = await Request.post("/users/login", {
      username,
      password,
    });
    console.log(data);
  };

  const registerHandle = async () => {
    const data = await Request.post("/users/register", {
      username,
      password,
    });
  };

  return (
    <div className="flex justify-center items-center h-auto w-[60rem] bg-white overflow-hidden rounded">
      <div className="w-80">
        <img src="/src/assets/login.svg" alt="" />
      </div>
      <div className="flex-1 flex flex-col justify-center items-center">
        <div className="">
          <span className="text-2xl text-green-600">欢迎使用 信笔</span>
        </div>
        <div className="flex flex-col text-sm space-y-2 mt-6">
          <span className="">账号</span>
          <Input
            type="text"
            style="w-80"
            text="请输入账号..."
            onChange={(e: any) => setUsername(e.target.value)}
          />
        </div>
        <div className="flex flex-col text-sm space-y-2 mt-4">
          <span className="">密码</span>
          <Input
            type="password"
            style="w-80"
            text="请输入密码..."
            onChange={(e: any) => setPassword(e.target.value)}
          />
        </div>
        <div className="text-sm flex justify-center items-center space-x-3 mt-6">
          <Button onClick={registerHandle}>注册</Button>
          <Button type="primary" onClick={loginHandle}>
            登录
          </Button>
        </div>
      </div>
    </div>
  );
}
