import React, { useState } from "react";

interface propsType {
  type?: "text" | "password";
  style?: string;
  text?: string;
  onChange?: Function;
  validate?: Function;
}

export default function input(props: propsType) {
  let { text, type: typeName, validate } = props;
  const [status, setStatus] = useState(null as unknown as Boolean);

  // console.log(props);
  const customStyle = () => {
    // 默认样式表
    let styleList = [
      "outline-none rounded border-2 p-2 px-2 text-xs hover:border-blue-200 focus:border-blue-200",
    ] as string[];

    // 如果用户自定义样式存在则导入其中
    const { style } = props;
    if (style) styleList.push(style);

    return styleList.join(" ");
  };

  const changeHangle = (e: any) => {
    const { onChange } = props;
    const val = e.target.value;
    onChange?.(val);
    if (validate) {
      if (validate(val)) {
        setStatus(true);
      } else {
        setStatus(false);
      }
    }
  };

  const styleList = customStyle();

  return (
    <input
      type={typeName ?? "text"}
      placeholder={text ?? "请输入..."}
      className={
        styleList +
        (status === null
          ? ""
          : status === true
          ? " border-lime-400"
          : " border-red-400")
      }
      onChange={changeHangle}
    />
  );
}
