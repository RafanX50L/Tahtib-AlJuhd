
import api from './api'
import { AUTH_ROUTES } from "../../utils/constant";
import { OtpData } from '../interface/IAuthService';
import { toast } from 'sonner';
import { AxiosError } from "axios";
import { useAuth } from '@/hooks/Auth.hook';

export const AuthService = {

  registerUser: async (formData: any) => {
    try {
      console.log("Registering user with data:", formData);
      const response = await api.post(AUTH_ROUTES.REGISTER, formData);
      console.log("Registration response:", response.data);
      return { data: response.data, error: null };
    } catch (error: unknown) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage = err.response?.data?.error || "Registration failed. Please try again.";
      toast.error(errorMessage);
      return { data: null, error: errorMessage };
    }
  },

  login: async (formData: any) => {
    try {
      console.log("Logging in user with data:", formData);
      const response = await api.post(AUTH_ROUTES.LOGIN, formData);
      console.log("Login response:", response.data);
      return { data: response.data, error: null, status: response.status };
    } catch (error: unknown) {
      console.log("Error during login:", error);
      const err = error as AxiosError<{ error: string }>;
      const errorMessage = err.response?.data.error || "Login failed. Please try again.";
      throw new Error(errorMessage);
    }
  },

  verifyOtp: async (data: OtpData) => {
    try {
      console.log("Verifying OTP with data:", data);
      const response = await api.post(AUTH_ROUTES.VERIFY_OTP, data);
      return { data: response.data };
    } catch (error: unknown) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage = err.response?.data.error || "OTP verification failed. Please try again.";
      console.log("Error during OTP verification:", err);
      throw new Error(errorMessage);
    }
  },

  resentOtp : async (email: string) => {
    try {
      console.log("Resending OTP to email:", email);
      const response = await api.post(AUTH_ROUTES.RESEND_OTP, { email });
      return {data: response.data};
    } catch (error: unknown) {
      const err = error as AxiosError<{error: string}>;
      const errorMessage = err.response?.data.error || "Failed to resend OTP. Please try again.";
      return { data: null, error: errorMessage };
    }
  },
  forgotPassword : async (email: string) => {
    try {
      console.log("Sending password reset email to:", email);
      const response = await api.post(AUTH_ROUTES.FORGOT_PASSWORD, { email });
      return {data: response.data};
    } catch (error: unknown) {
      const err = error as AxiosError<{error: string}>;
      const errorMessage = err.response?.data.error || "Failed to send password reset email. Please try again.";
      throw new Error(errorMessage);
    }
  },
  resetPassword : async (data: { token: string; password: string }) => { 
    try {
      console.log("Resetting password with data:", data);
      const response = await api.post(AUTH_ROUTES.RESET_PASSWORD, data);
      return {data: response.data};
    } catch (error: unknown) {
      const err = error as AxiosError<{error: string}>;
      const errorMessage = err.response?.data.error || "Failed to reset password. Please try again.";
      throw new Error(errorMessage);
    }
  },
  GoogleSignUP : async (data: any) => {
    try {
      console.log("Signing up with Google with data:", data);
      const response = await api.post(AUTH_ROUTES.GOOGLE_SIGNUP, data);
      return {data: response.data};
    } catch (error: unknown) {
      const err = error as AxiosError<{error: string}>;
      const errorMessage = err.response?.data.error || "Google signup failed. Please try again.";
      throw new Error(errorMessage);
    }
  },

   // Utility to handle authentication success (to be used in components)
   handleAuthSuccess: (token: string) => {
    const { login } = useAuth();
    login(token);
  },

  logout: () => {
    const { logout } = useAuth();
    logout();
  },

  refreshAcessToken : async () => {
    try {
      const response = await api.post(AUTH_ROUTES.REFRESH_ACESS_TOKEN);
      return {accessToken: response.data}
    } catch (error) {
      const err = error as AxiosError<{error: string}>;
      const errorMessage = err.response?.data.error || "Creating new Acess Token failed";
      throw new Error(errorMessage);
    }
  }

}


