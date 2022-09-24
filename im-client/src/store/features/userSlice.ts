import { createSlice } from "@reduxjs/toolkit";

interface User {
  avatar: string;
  nickname: string;
  username: string;
  signature?: string;
}

export interface userState {
  userinfo?: User;
  friends?: User[];
}

const initialState: userState = {
  userinfo: {
    avatar: "http://182.61.49.77:3000//imgs/4.jpg",
    nickname: "小熊",
    username: "1298184727@qq.com",
    signature: "芜湖~起飞",
  },
  friends: [],
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserinfo: (state, action) => {
      state.userinfo = action.payload;
    },
    setFriendinfo: (state, action) => {
      const { payload }: { payload: User } = action;
      state.friends?.push(payload);
    },
  },
});

export const { setUserinfo, setFriendinfo } = userSlice.actions;
export default userSlice.reducer;
