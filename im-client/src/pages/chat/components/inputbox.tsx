import React, { SyntheticEvent, useState } from "react"
import Input from "../../../components/input/input"
import Button from "../../../components/button/button"
import Request from "../../../utils/axios"
import { socket } from "../../../utils/socket"
import { message } from "../../../components/message/message"

interface InputBoxProps {
  chatId?: string
  from?: string
  to?: string
}

const InputBox: React.FC<InputBoxProps> = props => {
  const [msg, setMsg] = useState("")
  const [msgType, setMsgType] = useState(0)
  const { chatId, from, to } = props
  const [img, setImg] = useState(null as unknown as File)

  const sendMsg = () => {
    // Request.post("/chat/send", { chatId, from, msg });
    socket.emit("sendMessage", { chatId, from, msg, type: msgType })
    setMsg("")
    setMsgType(0)
  }

  const isValidImgType = (file: File | undefined) => {
    return file && file["type"].split("/")[0] === "image"
  }

  const uploadImg = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!isValidImgType(file)) {
      message.error("请上传图片")
      return
    }
    const res = await Request.post(
      "/file/upload",
      { file },
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    )
    setMsg(res.data.url)
    setMsgType(1)
  }

  return (
    <div className="relative flex align-top space-x-4 w-full h-10">
      {msgType === 1 ? (
        <div className="absolute top-[-7rem] left-[1rem] h-24 rounded overflow-hidden bg-amber-500">
          <img className="h-20 w-20" src={msg} alt="" />
          {/*<img*/}
          {/*  className="h-24"*/}
          {/*  src="http://localhost:4000/1690212197134-5049255379.png"*/}
          {/*  alt=""*/}
          {/*/>*/}
        </div>
      ) : null}
      <Input
        style="w-full"
        onChange={(e: any) => {
          if (msgType === 1) {
            setMsg("")
          } else {
            setMsg(e)
          }
        }}
        value={msg}
      />

      <label htmlFor="imgMsgUpload">
        <img className="h-full" src="/src/assets/chat/addImage.svg" alt="" />
      </label>
      <input
        className="hidden"
        id="imgMsgUpload"
        type="file"
        accept="image/*"
        onChange={uploadImg}
      />
      <Button type="primary" style="w-32" onClick={sendMsg}>
        发送
      </Button>
    </div>
  )
}

export default InputBox
