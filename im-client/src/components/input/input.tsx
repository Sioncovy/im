import React from "react";

export default function input(props: any) {
  let { text, type: typeName } = props;
  // console.log(props);
  const customStyle = () => {
    const { style } = props;
    let styleList = [
      "outline-none rounded border-2 p-1 px-2 hover:border-blue-200 focus:border-blue-200",
    ] as string[];
    styleList.push(style);
    return styleList.join(" ");
  };
  const styleList = customStyle();
  return <input type={typeName} placeholder={text} className={styleList} />;
}
