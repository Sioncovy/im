import React from "react";

interface propsType {
  type?: "text" | "password";
  style?: string;
  text?: string;
  onChange?: Function;
}

export default function input(props: propsType) {
  let { text, type: typeName } = props;
  // console.log(props);
  const customStyle = () => {
    // 默认样式表
    let styleList = [
      "outline-none rounded border-2 p-1 px-2 hover:border-blue-200 focus:border-blue-200",
    ] as string[];

    // 如果用户自定义样式存在则导入其中
    const { style } = props;
    if (style) styleList.push(style);

    return styleList.join(" ");
  };

  const changeHangle = (e: any) => {
    const { onChange } = props;
    onChange?.(e);
  };
  const styleList = customStyle();
  return (
    <input
      type={typeName ?? "text"}
      placeholder={text ?? "请输入..."}
      className={styleList}
      onChange={changeHangle}
    />
  );
}
