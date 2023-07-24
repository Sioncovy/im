import React, { useEffect, useState } from "react"
import Input from "../../components/input/input"
import Button from "../../components/button/button"
import Request from "../../utils/axios"
import { message } from "../../components/message/message"
import { readLocalItem } from "../../utils/storage"

type profileType = {
  avatar?: string
  nickname?: string
  bio?: string
}

export default function Profile() {
  const [profile, setProfile] = useState<profileType>({
    avatar: "",
    nickname: "",
    bio: "",
  })
  useEffect(() => {
    const userinfo = readLocalItem("userinfo")
    setProfile({
      avatar: userinfo.avatar,
      nickname: userinfo.nickname,
      bio: userinfo.bio,
    })
  }, [])
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    const res = await Request.post(
      "/file/upload",
      { file },
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    )
    if (res.code === 200) {
      setProfile({ ...profile, avatar: res.data.url })
      message.success("上传成功")
    } else {
      message.error("上传失败")
    }
  }

  const handleUpdateProfile = async () => {
    const res = await Request.post("/user/update", profile)
    if (res.code === 200) {
      message.success("修改成功")
    } else {
      message.error("修改失败")
    }
  }
  return (
    <div className="w-full space-y-4">
      {/* 展示当前头像 并 点击上传头像 */}
      <div className="flex justify-center items-center space-x-4">
        <div className="w-32 h-32 rounded-full overflow-hidden">
          <img src="" alt="" />
        </div>
        <input type="file" onChange={handleAvatarChange} />
      </div>
      {/* 昵称 */}
      <div className="flex items-center space-x-4">
        <div className="w-20">昵称</div>
        <Input
          style="w-4/5"
          text="请输入昵称"
          value={profile.nickname}
          onChange={(e: any) => setProfile({ ...profile, nickname: e })}
        ></Input>
      </div>
      <div className="flex items-center space-x-4">
        <div className="w-20">个人签名</div>
        <Input
          style="w-4/5"
          text="请输入个人签名"
          value={profile.bio}
          onChange={(e: any) => setProfile({ ...profile, bio: e })}
        ></Input>
      </div>
      <Button type="primary" onClick={handleUpdateProfile}>
        保存信息
      </Button>
    </div>
  )
}
