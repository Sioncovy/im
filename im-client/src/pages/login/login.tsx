import React, { useState, useEffect, ReactDOM } from "react";
import Button from "../../components/button/button";
import Input from "../../components/input/input";
import Request from "../../utils/axios";
import { readLocalItem, saveLocalItem } from "../../utils/storage";
import { message } from "../../components/message/message";
import { useNavigate } from "react-router-dom";

export default function login() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [codeImg, setCodeImg] = useState<any>();
  const [code, setCode] = useState<any>();
  const [timestamp, setTimestamp] = useState(new Date().getTime());

  const router = useNavigate();

  const loginHandle = async () => {
    const res: any = await Request.post("/user/login", {
      username,
      password,
      code,
      timestamp,
    });
    if (res.code !== 200) {
      message.error(res.msg);
      getAuthCode();
      return;
    }
    saveLocalItem("token", res.data.token);
    message.success(res.msg);
    router("/");
  };

  const registerHandle = async () => {
    console.log("click");
    const res: any = await Request.post("/user/register", {
      username,
      password,
      code,
    });
    if (res.code !== 200) {
      message.error(res.msg);
      getAuthCode();
      return;
    }
    message.success(res.msg);
    setIsLogin(true);
  };

  const getAuthCode = async () => {
    const res = await Request.get(`/user/authCode?timestamp=${timestamp}`);
    setCodeImg(res);
  };

  const sendEmailCode = async () => {
    const res: any = await Request.post("/email/sendCode", {
      email: username,
    });
    if (res.code !== 200) {
      message.error(res.msg);
      return;
    }
    message.success(res.msg);
  };

  const validate = (
    str: string,
    type: "length" | "email",
    config?:
      | {
          len: number;
          method: "lt" | "le" | "eq" | "ne" | "gt" | "ge"; // < <= === !== > >=
        }
      | any
  ) => {
    if (type === "length") {
      const { len } = config;
      const slen = str.length;
      switch (config?.method) {
        case "lt":
          return slen < len;
        case "le":
          return slen <= len;
        case "eq":
          return slen === len;
        case "ne":
          return slen !== len;
        case "gt":
          return slen > len;
        case "ge":
          return slen >= len;
        default:
          return slen < len;
      }
    }
    if (type === "email") {
      return str.match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
    }
  };

  useEffect(() => {
    getAuthCode();
  }, []);

  return (
    <div className="flex justify-between items-center  h-[34rem] w-[60rem] px-12 py-10 bg-white rounded">
      <div className="flex justify-center h-[42rem] w-[20rem] bg-teal-700 rounded overflow-hidden"></div>
      <div className="flex flex-col box-border w-[20rem] mx-20 justify-center items-center">
        <div className="flex w-full justify-start">
          <span className="text-3xl text-teal-700">???????????? ??????</span>
        </div>
        <div className="flex flex-col w-full text-sm space-y-1 mt-10">
          <span className="">??????</span>
          <Input
            type="text"
            style="w-full"
            text="???????????????..."
            onChange={(e: any) => setUsername(e)}
            validate={(e: any) => validate(e, "email")}
          />
        </div>
        <div className="flex flex-col w-full text-sm space-y-1 mt-4">
          <span className="">??????</span>
          <Input
            type="password"
            style="w-full"
            text="???????????????..."
            onChange={(e: any) => setPassword(e)}
            validate={(e: any) =>
              validate(e, "length", { len: 6, method: "ge" }) &&
              validate(e, "length", { len: 16, method: "le" })
            }
          />
        </div>
        <div className="flex flex-col w-full text-sm space-y-1 mt-4">
          <span className="">?????????</span>
          <div className="flex justify-between w-full">
            <Input
              type="text"
              style="w-3/5"
              text="??????????????????..."
              onChange={(e: any) => setCode(e)}
            />
            {isLogin ? (
              <div
                className=""
                dangerouslySetInnerHTML={{ __html: codeImg }}
                onClick={getAuthCode}
              ></div>
            ) : (
              <Button type="success" onClick={sendEmailCode}>
                ??????
              </Button>
            )}
          </div>
        </div>
        {isLogin ? (
          <>
            <div className="text-sm flex justify-center items-center space-x-3 mt-10">
              <Button type="primary" onClick={loginHandle} style="w-80">
                ??????
              </Button>
            </div>
            <div className="text-xs text-gray-400 flex justify-center items-center space-x-3 mt-3">
              ???????????????
              <span
                onClick={() => setIsLogin(false)}
                className="text-indigo-400 cursor-pointer transition-all select-none hover:text-indigo-600 active:scale-95"
              >
                ????????????
              </span>
            </div>
          </>
        ) : (
          <>
            <div className="text-sm flex justify-center items-center space-x-3 mt-10">
              <Button type="primary" onClick={registerHandle} style="w-80">
                ??????
              </Button>
            </div>
            <div className="text-xs text-gray-400 flex justify-center items-center space-x-3 mt-3">
              ???????????????
              <span
                onClick={() => setIsLogin(true)}
                className="text-indigo-400 cursor-pointer transition-all select-none hover:text-indigo-600 active:scale-95"
              >
                ????????????
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
