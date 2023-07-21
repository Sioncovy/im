import React, { useEffect, useState } from 'react'
import Input from '../../components/input/input'
import Button from '../../components/button/button'
import { Route, Routes } from 'react-router-dom'
import RequestItem from '../contact/components/request'
import PersonItem from '../contact/components/person'
import Request from '../../utils/axios'
import Profile from './profile'

export default function Setting() {
  return (
    <div className="flex flex-col px-10">
      <div className="flex flex-col space-y-2 items-center justify-between px-2 w-full rounded">
        <Routes>
          {/* 个人资料 */}
          <Route element={<Profile />} path="profile"></Route>
        </Routes>
      </div>
    </div>
  )
}
