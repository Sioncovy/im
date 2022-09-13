import React, { useEffect } from "react";

interface propsType {
  type?: string;
  onClick?: Function;
  children?: string;
  size?: "small" | "medium" | "large";
  style?: string;
}

export default function button(props: propsType) {
  // console.log(props);
  let { children: name } = props;

  const customStyle = () => {
    const { type, size, style } = props;
    // 默认样式
    let styleList = ["box-border py-1 rounded"] as string[];

    // 按钮大小
    let sizeClass = "px-6";
    if (size === "small") {
      sizeClass = "px-4";
    } else if (size === "large") {
      sizeClass = "px-8";
    }
    styleList.push(sizeClass);

    // 按钮类型
    let typeClass =
      "border-2 border-gray-200 hover:border-blue-200 hover:text-blue-500";
    if (type === "primary") {
      typeClass =
        "border-2 border-blue-300 bg-blue-400 text-slate-50 hover:bg-blue-300 hover:border-blue-200 ";
    }
    styleList.push(typeClass);

    // 用户自定义样式
    if (style) styleList.push(style);

    return styleList.join(" ");
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const { onClick } = props;
    (onClick as React.MouseEventHandler<HTMLButtonElement>)?.(e);
  };

  const styleList = customStyle();
  // console.log(type);
  // {classes}
  return (
    <button className={styleList} onClick={handleClick}>
      {name}
    </button>
  );
}
