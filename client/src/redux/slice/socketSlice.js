import { createSlice } from "@reduxjs/toolkit";
import { io } from "socket.io-client";

const initialState = {
  socket: null,
};

const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    setSocket: (state, action) => {
      state.socket = action.payload;
    },
  },
  // Allow non-serializable data in this slice
  extraReducers: (builder) => {
    builder.addCase("socket/setSocket", (state, action) => {
      state.socket = action.payload;
    });
  },
});

export const { setSocket } = socketSlice.actions;

export default socketSlice.reducer;