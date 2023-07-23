import { create } from "zustand"
import { MessageType, ChatType } from "../interfaces/chat"

type State = {
  msgList: MessageType[]
  chatUnreadMsgMap: Map<string, number>
  count: number
}

type Actions = {
  setMsgList: (msgList: MessageType[]) => void
  setChatUnreadMsgMap: (
    key: string,
    type: "set" | "change" | undefined,
    unread_count: number
  ) => void
  increase: () => void
}

export const useChatStore = create<State & Actions>(set => ({
  msgList: [],
  setMsgList: msgList => set({ msgList: [...msgList] }),

  chatUnreadMsgMap: new Map(),
  setChatUnreadMsgMap: (key, type, unread_count) => {
    set(state => {
      const newMap = new Map(state.chatUnreadMsgMap)
      if (type === "change") {
        newMap.set(key, (newMap.get(key) ?? 0) + unread_count)
      } else {
        newMap.set(key, unread_count)
      }
      return {
        chatUnreadMsgMap: newMap,
      }
    })
  },

  count: 0,
  increase: () => {
    set(state => ({
      count: state.count + 1,
    }))
  },
}))
