
import axios from "axios";
import { HOST } from "@/utils/constant";
import { AppDispatch, RootState } from "@/store/store";
import { refreshAccessToken, setCredentials } from "@/store/slices/authSlice";
import { useSelector } from "react-redux";
import { AxiosInstance } from "axios";
import { UserInterface } from "@/types/user";

interface TokenData {
  token: string;
  version: number;
}


export const secureTokenStorage = {
  get: (): TokenData | null => {
    try {

      const { tokenVersion, accessToken } = JSON.parse(localStorage.getItem("accessTokenData") || "{}");
      if (!accessToken) {
        console.log('No token found in local storage');
        return null;
      }

      return { token: accessToken, version: tokenVersion };
    } catch (error) {
      console.error('Failed to retrieve token:', error);
      return null;
    }
  },

  set: (user: UserInterface, token: string, version: number, dispatch: AppDispatch) => {
    try {
      dispatch(setCredentials({ user, accessToken: token, tokenVersion: version }));
      console.log('Token stored successfully, version:', version);
    } catch (error) {
      console.error('Failed to store token:', error);
    }
  },

  remove: () => {
    localStorage.removeItem('accessTokenData');
    localStorage.removeItem('sessionActive');
    console.log('Token removed from storage');
  }
};


const api: AxiosInstance = axios.create({
  baseURL: `${HOST}/api`,
  withCredentials: true,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

console.log("API instance created:", api.defaults.baseURL);
(api as any).__instanceId = "main-api-instance";



export default api;