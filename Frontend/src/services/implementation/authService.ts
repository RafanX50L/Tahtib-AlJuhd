import api from "./api";
import { AUTH_ROUTES } from "../../utils/constant";
import { OtpData } from "../interface/IAuthService";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { UserInterface } from "@/types/user";


//verify otp, GoogleSignup,login,refreshToken

export const AuthService = {
  registerUser: async (formData: any) => {
    try {
      const response = await api.post(AUTH_ROUTES.REGISTER, formData);
      return { data: response.data, error: null };
    } catch (error: unknown) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage =
        err.response?.data?.error || "Registration failed. Please try again.";
      toast.error(errorMessage);
      return { data: null, error: errorMessage };
    }
  },

  login: async (formData: any) => {
    try {
      const res = await api.post<{message:string,user:UserInterface,accessToken:string}>(AUTH_ROUTES.LOGIN, formData);
      const response = res.data;
      return { user: response.user, message: response.message,accessToken:response.accessToken, status: res.status };
    } catch (error: unknown) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage =
        err.response?.data.error || "Login failed. Please try again.";
      throw new Error(errorMessage);
    }
  },

  verifyOtp: async (data: OtpData) => {
    try {
      const res = await api.post<{ message: string; user: UserInterface, accessToken:string }>(AUTH_ROUTES.VERIFY_OTP, data);
      const response = res.data;
      return { user: response.user, message: response.message,accessToken:response.accessToken, status:res.status };
    } catch (error: unknown) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage =
        err.response?.data.error ||
        "OTP verification failed. Please try again.";
      throw new Error(errorMessage);
    }
  },

  resentOtp: async (email: string) => {
    try {
      const response = await api.post(AUTH_ROUTES.RESEND_OTP, { email });
      return { data: response.data };
    } catch (error: unknown) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage =
        err.response?.data.error || "Failed to resend OTP. Please try again.";
      return { data: null, error: errorMessage };
    }
  },
  forgotPassword: async (email: string) => {
    try {
      const response = await api.post(AUTH_ROUTES.FORGOT_PASSWORD, { email });
      return { data: response.data };
    } catch (error: unknown) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage =
        err.response?.data.error ||
        "Failed to send password reset email. Please try again.";
      throw new Error(errorMessage);
    }
  },
  resetPassword: async (data: { token: string; password: string }) => {
    try {
      const response = await api.post(AUTH_ROUTES.RESET_PASSWORD, data);
      return { data: response.data };
    } catch (error: unknown) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage =
        err.response?.data.error ||
        "Failed to reset password. Please try again.";
      throw new Error(errorMessage);
    }
  },
  GoogleSignUP: async (data: any) => {
    try {
      const res = await api.post<{message:string, user:UserInterface, accessToken:string}>(AUTH_ROUTES.GOOGLE_SIGNUP, data);
      const response = res.data;
      return { message: response.message, user: response.user, accessToken:response.accessToken, status: res.status };
    } catch (error: unknown) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage =
        err.response?.data.error || "Google signup failed. Please try again.";
      throw new Error(errorMessage);
    }
  },

 
  refreshToken: async () => {
    return new Promise(async(resolve,reject)=>{
      try {
      const response = await api.post(AUTH_ROUTES.REFRESH_ACESS_TOKEN);
      resolve( response.data )
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage =
        err.response?.data.error || "Creating new Acess Token failed";
      throw new Error(errorMessage);
    }
    })
  },
};
