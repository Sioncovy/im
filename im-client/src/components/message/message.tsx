import React, {
  Component,
  useState,
  useRef,
  useImperativeHandle,
  useEffect,
  useReducer,
} from "react";
// import MessageItem from "./messageItem";

interface MsgType {
  msgText: string;
  type: "info" | "success" | "error" | "warning";
  timeStamp?: number;
}

const MessageItem = ({ msgText, type }: MsgType) => {
  // console.log(msgText, type);
  let outStyle = "";
  let innerStyle = "";
  switch (type) {
    case "info":
      outStyle = "bg-gray-400";
      innerStyle = "text-gray-600 bg-slate-50";
      break;
    case "success":
      outStyle = "bg-emerald-400";
      innerStyle = "text-emerald-600 bg-green-50";
      break;
    case "error":
      outStyle = "bg-rose-400";
      innerStyle = "text-rose-600 bg-rose-50";
      break;
    case "warning":
      outStyle = "bg-amber-400";
      innerStyle = "text-amber-600 bg-amber-50";
      break;
  }
  return (
    <div className={"animate-fadeIn px-5 mt-2 rounded-sm " + outStyle}>
      <div className={"px-3 py-1 text-sm " + innerStyle}>{msgText}</div>
    </div>
  );
};

const MessageContainer = React.forwardRef((props, ref) => {
  const [msgList, setMsgList] = useState<MsgType[]>([]);
  const msgListRef = useRef(msgList);
  msgListRef.current = msgList;

  const handleMsg = (msgInfo: MsgType, time: number = 3000) => {
    const timeStamp = new Date().getTime();
    setMsgList((x) => [...x, { ...msgInfo, timeStamp }]);

    setTimeout(() => {
      msgListRef.current.shift();
      setMsgList([...msgListRef.current]);
    }, time);
  };

  useImperativeHandle(ref, () => {
    return {
      info: (msgText: string, time?: number) =>
        handleMsg({ msgText, type: "info" }, time),
      success: (msgText: string, time?: number) =>
        handleMsg({ msgText, type: "success" }, time),
      error: (msgText: string, time?: number) =>
        handleMsg({ msgText, type: "error" }, time),
      warning: (msgText: string, time?: number) =>
        handleMsg({ msgText, type: "warning" }, time),
    };
  });
  return (
    <>
      {msgList.map((msg, index) => (
        <MessageItem
          key={index}
          msgText={msg.msgText}
          type={msg.type}
        ></MessageItem>
      ))}
    </>
  );
});

interface MsgApiType {
  info: Function;
  success: Function;
  error: Function;
  warning: Function;
}

export const message: MsgApiType = {
  info: () => {},
  success: () => {},
  error: () => {},
  warning: () => {},
};

export default function messageProvider() {
  // state = {
  //   isShowMask: false, // 当前 mask 是否显示
  //   toastList: [] as any[], // 当前 Toast item 列表
  // };
  const ref = useRef<any>();
  useEffect(() => {
    message.info = ref.current.info;
    message.success = ref.current.success;
    message.error = ref.current.error;
    message.warning = ref.current.warning;
  }, []);

  return <MessageContainer ref={ref}></MessageContainer>;
}
