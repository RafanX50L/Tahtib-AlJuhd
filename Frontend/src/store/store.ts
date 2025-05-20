// store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import api from "@/services/implementation/api";
import { setupInterceptors } from "@/services/implementation/interceptor";

console.log("Initializing store...");
console.log("API instance ID:", (api as any).__instanceId);

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

console.log("Calling setupInterceptors...");
setupInterceptors(api, store.dispatch);
console.log("Interceptors set up for API instance");

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;