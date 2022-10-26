import React, { useState } from "react";
import Input from "../../../components/input/input";
import Button from "../../../components/button/button";
import Request from "../../../utils/axios";
import { socket } from "../../../utils/socket";

interface InputBoxProps {
  chatId: string;
  from: string;
}

const InputBox: React.FC<InputBoxProps> = (props) => {
  const [msg, setMsg] = useState("");
  const { chatId, from } = props;

  const sendMsg = () => {
    Request.post("/chat/send", { chatId, from, msg });
    setMsg("");
  };

  return (
    <div className="flex space-x-4 w-full">
      <Input
        style="w-full"
        onChange={(e: any) => {
          setMsg(e);
        }}
        value={msg}
      />
      <Button type="primary" style="w-32" onClick={sendMsg}>
        发送
      </Button>
    </div>
  );
};

export default InputBox;
