import React, { useState } from "react"
import { UserInfoType } from "../../../interfaces/user"
import time from "dayjs"

export interface MessageProps {
  msgInfo: {
    msg_id: string
    chatId: string
    from: string
    chat_type?: number
    msg: string
    type?: number
    send_time: number
  }
  userinfo: UserInfoType
  isSelf: Boolean
}

const Message: React.FC<MessageProps> = ({ msgInfo, userinfo, isSelf }) => {
  const [timeDisplay, setTimeDisplay] = useState(false)

  return (
    <div
      className={
        "flex w-full items-center " + (isSelf ? "flex-row-reverse" : "")
      }
      onMouseEnter={() => setTimeDisplay(true)}
      onMouseLeave={() => setTimeDisplay(false)}
    >
      <div className={"self-start h-10 w-10 rounded-full overflow-hidden "}>
        <img src={userinfo?.avatar} alt="" />
      </div>
      <div
        className={"flex flex-col max-w-[70%] mx-2 mt-1 " + (isSelf ? "" : "")}
      >
        <div className="flex text-sm text-gray-500">
          {isSelf ? null : (
            <div className={" " + (isSelf ? "text-right" : "")}>
              {userinfo?.nickname ?? userinfo?.username}
            </div>
          )}
        </div>
        <div className={"flex mt-1 " + (isSelf ? "flex-row-reverse" : "")}>
          {msgInfo.type === 0 ? (
            <div
              className={
                "break-all py-2 px-3 rounded  bg-slate-200 " +
                (isSelf ? "ml-2" : "mr-2")
              }
            >
              {/* <div className="">{msginfo.msg}</div> */}
              {msgInfo?.msg}
            </div>
          ) : (
            <img className="w-40" src={msgInfo.msg} alt="" />
          )}
          <div className="flex flex-col text-xs justify-end text-gray-500">
            {timeDisplay ? (
              <div className={"" + (isSelf ? "text-end" : "")}>
                {time(msgInfo?.send_time).calendar(null, {
                  sameDay: "A HH:mm", // The same day ( Today at 2:30 AM )
                  nextDay: "", // The next day ( Tomorrow at 2:30 AM )
                  nextWeek: "[下周] dddd", // The next week ( Sunday at 2:30 AM )
                  lastDay: "[昨天]", // The day before ( Yesterday at 2:30 AM )
                  lastWeek: "[上周] dddd", // Last week ( Last Monday at 2:30 AM )
                  sameElse: "YYYY/MM/DD", // Everything else ( 7/10/2011 )
                })}
              </div>
            ) : null}
            <div className={"w-20 " + (isSelf ? "text-right" : "")}>已读</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Message
