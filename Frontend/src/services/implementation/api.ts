import axios from "axios";
import { HOST } from "@/utils/constant";

const api = axios.create({
  baseURL: `${HOST}/api`,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { response } = error;
    if (response && response.status === 401) {
      // Handle unauthorized access, e.g., redirect to login page
      console.error("Unauthorized access - redirecting to login");
    }
    return Promise.reject(error);
  }
);

export default api;
