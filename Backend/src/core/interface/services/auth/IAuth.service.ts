import IUser from "@/core/interface/model/IUser.model"; 

export interface SignUpUser {
  role: "client" | "trainer" | "admin";
  email: string;
  password: string;
}

export interface verifyOtpReturnType {
  user: Partial<IUser> & { status: string | null };
  accessToken: string;
  refreshToken: string;
  tokenVersion: number;
}

export interface signInReturnType {
  user: Partial<IUser> & { status: string | null };
  accessToken: string;
  refreshToken: string;
  tokenVersion: number;
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
  user: Partial<IUser>;
  tokenVersion: number;
}

export interface refreshTokenReturnType {
  user: Partial<IUser> & { status: string | null };
  accessToken: string;
  refreshToken: string;
  tokenVersion: number;
}

export interface IAuthService {
  signUp(user: SignUpUser): Promise<string>;
  signIn(email: string, password: string): Promise<signInReturnType>;
  verifyOtp(email: string, otp: string): Promise<verifyOtpReturnType>;
  resendOtp(email: string): Promise<string>;
  forgotPassword(email: string): Promise<forgotPasswordReturnType>;
  resetPassword(token: string, password: string): Promise<resetPasswordReturnType>;
  googleSignUp(email: string, name: string, role: "client" | "trainer" | "admin"): Promise<verifyOtpReturnType>;
  refreshAccessToken(refreshToken: string): Promise<refreshTokenReturnType>;
  updateTokenVersion(userId: string, newVersion: number): Promise<void>;
  getUserData(id: string): Promise<getUserDataReturnType>;
  getUserById(id: string): Promise<IUser | null>;
}