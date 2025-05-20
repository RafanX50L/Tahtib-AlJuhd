// services/implementation/api.ts
import axios from "axios";
import { HOST } from "@/utils/constant";

const api = axios.create({
  baseURL: `${HOST}/api`,
  withCredentials: true,
});

console.log("API instance created:", api.defaults.baseURL);
(api as any).__instanceId = "main-api-instance"; // Add identifier

export default api;