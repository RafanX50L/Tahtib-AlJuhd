import { IUser } from "@/models/interface/IUser.model";

export interface SignUpUser {
  role: "client" | "trainer" | "admin";
  email: string;
  password: string;
}

export interface verifyOtpReturnType {
  user: { _id: string | unknown; name: string; email: string; role: string, personalization:string | null };
  accessToken: string;
  refreshToken: string;
}

export interface signInReturnType {
  user: { _id: string | unknown ; name: string; email: string; role: string }|Partial<IUser>;
  accessToken: string;
  refreshToken: string;
}

export interface forgotPasswordReturnType {
  status: number;
  message: string;
}

export interface resetPasswordReturnType {
  status: number;
  message: string;
}

export interface getUserDataReturnType {
  user:{
    _id:string,
    name:string,
    email:string,
    role:string,
  }
}

export interface IAuthService {
  signUp(user: SignUpUser): Promise<string>;
  signIn(email: string, password: string): Promise<signInReturnType>;
  verifyOtp(email: string, otp: string): Promise<verifyOtpReturnType>;
  resendOtp(email: string): Promise<string>;
  forgotPassword(email: string): Promise<forgotPasswordReturnType>;
  resetPassword(
    token: string,
    password: string
  ): Promise<resetPasswordReturnType>;
  googleSignUp(
    email: string,
    name: string,
    role: "client" | "trainer" | "admin"
  ): Promise<verifyOtpReturnType>;
  refreshAccessToken: (
    refreshToken: string
  ) => Promise<{ accessToken: string }>;
  getUserData(id:string):Promise<getUserDataReturnType>;
  getUserById( id: string): Promise<IUser | null>;
}
