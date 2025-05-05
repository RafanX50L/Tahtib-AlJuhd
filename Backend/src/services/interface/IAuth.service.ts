import { IUserModel } from "../../models/implementation/user.model";
// import { IUser } from "../../models/interface/IUser.model";

export interface SignUpUser {
  role: "client" | "trainer" | "admin";
  email: string;
  password: string;
}

export interface verifyOtpReturnType {
  user: IUserModel;
  accessToken: string;
  refreshToken: string;
}

export interface signInReturnType {
  role: string;
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

export interface IAuthService {
  signUp(user: SignUpUser): Promise<string>;
  signIn(email: string, password: string): Promise<signInReturnType>;
  verifyOtp(email: string, otp: string): Promise<verifyOtpReturnType>;
  resendOtp(email: string): Promise<string>;
  forgotPassword(email: string): Promise<forgotPasswordReturnType>;
  resetPassword(token: string, password: string): Promise<resetPasswordReturnType>;
  googleSignUp(email: string, name: string, role: "client" | "trainer" | "admin"): Promise<verifyOtpReturnType>;
}