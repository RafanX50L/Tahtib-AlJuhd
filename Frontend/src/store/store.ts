// store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import schedulingReducer from "./slices/schedulingSlice";
import api from "@/services/implementation/api";
import { setupInterceptors } from "@/services/implementation/interceptor";

const store = configureStore({
  reducer: {
    auth: authReducer,
    scheduling: schedulingReducer,
  },
});

setupInterceptors(api, store.dispatch);

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
