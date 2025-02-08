import authReducer from "./slice/authSlice";
import socketReducer from "./slice/socketSlice";
import { configureStore } from "@reduxjs/toolkit";
export default configureStore({
  reducer: {
    auth: authReducer,
    socket: socketReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["socket/setSocket"],
        ignoredPaths: ["socket.socket"],
      },
    }),
});
