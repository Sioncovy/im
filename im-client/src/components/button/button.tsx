import React, { useEffect } from "react"

interface propsType {
  type?: "" | "primary" | "success" | "icon"
  onClick?: Function
  children?: string | React.ReactNode
  size?: "small" | "medium" | "large"
  style?: string
  icon?: string
}

export default function Button(props: propsType) {
  // console.log(props);
  let { children, icon } = props

  const customStyle = () => {
    const { type, size, style } = props
    // 默认样式
    let styleList = [
      "box-border h-9 py-1 rounded transition-all active:scale-95 ripple",
    ] as string[]
    if (type !== "icon") {
      styleList.push("border-2")
    }
    // 按钮大小
    let sizeClass = ""
    if (type !== "icon") {
      sizeClass = "px-6"
      if (size === "small") {
        sizeClass = "px-4 h-8 text-sm"
      } else if (size === "large") {
        sizeClass = "px-8"
      }
    }
    styleList.push(sizeClass)

    // 按钮类型
    let typeClass = "border-gray-200 hover:border-blue-200 hover:text-blue-500"
    if (type === "primary") {
      typeClass =
        "border-blue-300 bg-blue-400 text-slate-50 hover:bg-blue-300 hover:border-blue-200 "
    } else if (type === "success") {
      typeClass =
        "border-emerald-400 bg-emerald-500 text-white hover:border-emerald-300 hover:bg-emerald-400"
    }
    styleList.push(typeClass)

    // 用户自定义样式
    if (style) styleList.push(style)

    return styleList.join(" ")
  }

  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const { onClick } = props
    // 阻止事件冒泡
    e.stopPropagation()
    ;(onClick as React.MouseEventHandler<HTMLButtonElement>)?.(e)
  }

  const styleList = customStyle()
  // console.log(type);
  // {classes}
  return (
    <button className={styleList} onClick={handleClick}>
      {icon ? <img className="h-full" src={icon} alt="" /> : children}
    </button>
  )
}
