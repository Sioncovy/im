import React, { useEffect, useState } from 'react'
import Button from '../../components/button/button'
import { Link } from 'react-router-dom'

export default function SettingSide() {
  const [currentIndex, setCurrentIndex] = useState<number>(0)

  const sideList = [
    {
      name: '个人资料',
      to: '/setting/profile',
      icon: '/src/assets/contact/request.svg'
    }
  ]
  return (
    <div className="p-2 space-y-1">
      {/* 侧边选项 */}
      {sideList.map((item, index) => (
        <Link
          to={item.to}
          key={item.name}
          onClick={() => setCurrentIndex(index)}
        >
          <div
            className={
              'flex items-center px-3 space-x-3 text-sm w-full h-12 rounded-md cursor-pointer hover:bg-slate-200 ' +
              (index === currentIndex ? 'bg-slate-200' : ' ')
            }
          >
            <div className="w-6 h-6 overflow-hidden">
              <img src={item.icon} alt="" />
            </div>
            <div className="">{item.name}</div>
          </div>
        </Link>
      ))}
    </div>
  )
}
