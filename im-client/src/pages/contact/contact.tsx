import React, { useEffect, useState } from 'react'
import RequestItem from './components/request'
import PersonItem from './components/person'
import Request from '../../utils/axios'
import { readLocalItem, saveLocalItem } from '../../utils/storage'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import Input from '../../components/input/input'
import Button from '../../components/button/button'
import { UserInfoType } from '../../interfaces/user'
// import { useAppSelector } from "../../hooks/storeHook";

interface RequestType {
  friend_username: string
  username: string
  reason: string
  type: 0
}

interface ContactType {
  username: string
  avatar: string
  nickname: string
}

export default function Contact() {
  const [requestList, setRequestList] = useState<RequestType[]>([])
  const [contactList, setContactList] = useState<ContactType[]>([])
  const [queryList, setQueryList] = useState<UserInfoType[]>([])
  const [inputValue, setInputValue] = useState<string>('')
  const [currentIndex, setCurrentIndex] = useState<number>(1)

  const sideList = [
    {
      name: '好友申请',
      to: '/contact/request',
      icon: 'request.svg'
    },
    {
      name: '联系人',
      to: '/contact',
      icon: 'contacts.svg'
    }
  ]
  const location = useLocation()

  const queryUsers = async (username: string) => {
    console.log(location.pathname)

    if (location.pathname === '/contact') {
      const res = contactList.filter(
        (item) =>
          item.username.includes(inputValue) ||
          item.nickname.includes(inputValue)
      )
      setQueryList(res)
    } else {
      const res = await Request.get(`/user/query?username=${username}`)
      setQueryList(res.data.users)
    }
  }

  const applyAddRequest = async (friend_username: string) => {
    /*
     * @TODO: redux 不存在用户信息判断
     */
    const res = await Request.post(`/contact/add`, {
      friend_username: friend_username
    })
  }

  useEffect(() => {
    const userinfo = readLocalItem('userinfo')
    Request.get(`/contact/getAllRequest?username=${userinfo.username}`).then(
      (res) => {
        // console.log(res);
        const data: { requests: RequestType[] } = res.data as unknown as {
          requests: RequestType[]
        }
        setRequestList(data.requests)
      }
    )
    Request.get(`/contact?username=${userinfo.username}`).then((res) => {
      const friends = res.data.friendsList as Array<any>
      setContactList(friends)
    })
  }, [])

  return (
    <div className="flex flex-col px-10">
      <div className="flex justify-center my-16 space-x-4">
        <Input
          style="w-3/5"
          value={inputValue}
          onChange={(e: any) => setInputValue(e)}
        ></Input>
        <Button onClick={() => queryUsers(inputValue)}>查找</Button>
      </div>
      <div className="flex flex-col space-y-2 items-center justify-between px-2 w-full rounded">
        <Routes>
          {/* 好友申请列表 */}
          <Route
            element={
              <>
                {inputValue === ''
                  ? requestList?.map((item) => (
                      <RequestItem
                        key={item.friend_username}
                        questInfo={item}
                      ></RequestItem>
                    ))
                  : queryList?.map((item) => (
                      <div
                        key={item.username}
                        className="flex w-full items-center space-x-4"
                      >
                        <PersonItem user={item}></PersonItem>
                        <Button
                          style="w-32"
                          onClick={() => applyAddRequest(item.username)}
                        >
                          申请好友
                        </Button>
                      </div>
                    ))}
              </>
            }
            path="request"
          ></Route>
          {/* 好友列表 */}
          <Route
            element={
              <>
                {inputValue === ''
                  ? contactList?.map((item) => (
                      <PersonItem key={item.username} user={item}></PersonItem>
                    ))
                  : queryList?.map((item) => (
                      <PersonItem key={item.username} user={item}></PersonItem>
                    ))}
              </>
            }
            path=""
          ></Route>
        </Routes>
      </div>
    </div>
  )
}
