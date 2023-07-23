import { create } from "zustand"
import { UserInfoType } from "../interfaces/user"

type State = {
  userinfo: UserInfoType
}

type Actions = {
  setUserInfo: (userinfo: UserInfoType) => void
}

export const useBaseStore = create<State & Actions>(set => ({
  userinfo: {},
  setUserInfo: userinfo => set({ userinfo }),
}))
