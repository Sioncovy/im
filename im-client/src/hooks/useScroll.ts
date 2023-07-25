import React, { useEffect } from "react"

export function useScroll(
  ref: React.RefObject<HTMLElement>,
  callback: () => void
) {
  useEffect(() => {
    ref.current!.addEventListener("scroll", callback)
    return () => ref.current!.removeEventListener("scroll", callback)
  }, [])
}
