import axios from "axios";
import { HOST } from "@/utils/constant";

const api = axios.create({
  baseURL: `${HOST}/api`,
  withCredentials: true,
});

api.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem('accessToken');

        if (accessToken) {
            config.headers.authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);


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
    console.log(error)
    return Promise.reject(error);
  }
);

export default api;
