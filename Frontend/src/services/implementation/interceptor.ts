import {
  AxiosInstance,
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
import { AppDispatch } from "@/store/store";
import { secureTokenStorage } from "./api"; // Adjust import as needed
import { refreshAccessToken } from "@/store/slices/authSlice";

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: string) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  console.log("Processing failed queue, error:", error, "token:", token);
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

const setupInterceptors = (api: AxiosInstance, dispatch: AppDispatch) => {
  console.log("Setting up Axios interceptors...");

  // Request Interceptor
   api.interceptors.request.use(
    (config: AxiosRequestConfig) => {
      console.log(
        `Request interceptor triggered for: ${config.url} [${config.method?.toUpperCase()}]`
      );
      const tokens = secureTokenStorage.get() as { token: string;};
      if (tokens && tokens.token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${tokens.token}`;
      } else {
        console.log("No token found in secureTokenStorage");
      }
      return config;
    },
    (error: AxiosError) => {
      console.error("Request interceptor error:", error.message);
      return Promise.reject(error);
    }
  );

  // Response Interceptor
  api.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as AxiosRequestConfig & {
        _retry?: boolean;
      };
      const frontendUrl = window.location.pathname + window.location.search;
      console.log(
        `Response interceptor caught error: ${error.response?.status} for backend ${originalRequest.url} on frontend page ${frontendUrl}`
      );

      if (!error.response) {
        console.error(
          `No response received (network error?) on ${frontendUrl}:`,
          error.message
        );
        return Promise.reject(error);
      }

      const { status, data } = error.response;
      if (
        (status === 401 &&
          (data?.error === "User is Blocked" ||
            data?.error === "Invalid token ")) ||
        (status === 403 && data?.error === "Unauthorized")
      ) {
        console.log(
          `Authentication error on ${frontendUrl}, redirecting to /auth?path=login&from=${encodeURIComponent(frontendUrl)}`
        );
        secureTokenStorage.remove();
        window.location.href = `/auth?path=login&from=${encodeURIComponent(frontendUrl)}`;
        return Promise.reject(error);
      }

      if (status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          console.log(
            `Token refresh in progress for ${frontendUrl}, queuing request for ${originalRequest.url}`
          );
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest.headers = originalRequest.headers || {};
              originalRequest.headers.Authorization = `Bearer ${token}`;
              console.log(
                `Retrying queued request for ${originalRequest.url} from ${frontendUrl}`
              );
              return api(originalRequest);
            })
            .catch((err) => {
              console.error(
                `Failed to retry queued request for ${originalRequest.url}:`,
                err
              );
              return Promise.reject(err);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          console.log(`Attempting to refresh token from ${frontendUrl}...`);
          const response = await dispatch(refreshAccessToken()).unwrap();
          console.log("Refresh token response:", response);

          const { accessToken, user, notifications } = response;
          if (!accessToken) {
            throw new Error(
              "Invalid refresh response: missing accessToken"
            );
          }

          // Update token storage with new token
          secureTokenStorage.set(user, notifications, accessToken, dispatch);
          
          // Update the original request headers with new token
          originalRequest.headers = {
            ...originalRequest.headers,
            Authorization: `Bearer ${accessToken}`,
          };

          console.log(
            `Retrying original request for ${originalRequest.url} from ${frontendUrl} with new token`
          );
          
          // Process queued requests with new token
          processQueue(null, accessToken);
          
          // Retry the original request
          return api(originalRequest);
        } catch (refreshError: any) {
          console.error(
            `Token refresh failed on ${frontendUrl}:`,
            refreshError.message || refreshError
          );
          
          // Clear token storage and redirect to login
          secureTokenStorage.remove();
          processQueue(refreshError);
          window.location.href = `/auth?path=login&from=${encodeURIComponent(frontendUrl)}`;
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      console.log(`Non-401 error on ${frontendUrl}, status: ${status}`);
      return Promise.reject(error);
    }
  );

  console.log("Axios interceptors fully set up");
};

export { setupInterceptors };
