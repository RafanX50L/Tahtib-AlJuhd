import { AppDispatch } from "@/store/store";
import { refreshAccessToken } from "@/store/slices/authSlice";


export const setupInterceptors = (api: AxiosInstance, dispatch: AppDispatch) => {
  console.log("Entering setupInterceptors...");

  api.interceptors.request.use(
    (config) => {
      console.log("Request interceptor triggered for:", config.url);
      const token = localStorage.getItem("accessToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      console.error("Request interceptor error:", error);
      return Promise.reject(error);
    }
  );

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      console.log("Response interceptor caught error:", error.response?.status, error.config?.url);
      const originalRequest = error.config;

      if (!error.response) {
        console.log("No response received (network error?):", error.message);
        return Promise.reject(error);
      }
      console.log('error response',error.response);
      if(error.response.status === 401 && error.response.data.error === "User is Blocked"){
        console.log('enterd to blocked user');
        return Promise.reject(error);
      }

      if (error.response.status === 401 && !originalRequest._retry) {
        localStorage.removeItem('accessToken');
        console.log("Handling 401 error for:", originalRequest.url);
        originalRequest._retry = true;

        try {
          console.log("Attempting to refresh token...");
          const response = await dispatch(refreshAccessToken()).unwrap();
          console.log("Refresh token response:", response);

          const newToken = response.accessToken;
          console.log('newTokne',newToken)
          if (!newToken) {
            throw new Error("No access token in refresh response");
            
          }

          originalRequest.headers = {
            ...originalRequest.headers,
            Authorization: `Bearer ${newToken}`,
          };

          console.log("Retrying original request with new token...");
          return api(originalRequest);
        } catch (refreshError) {
          console.error("Token refresh failed:", refreshError);
          return Promise.reject(refreshError);
        }
      }

      console.log("Non-401 error, rejecting:", error.response.status);
      return Promise.reject(error);
    }
  );

  console.log("Interceptors fully set up");
};