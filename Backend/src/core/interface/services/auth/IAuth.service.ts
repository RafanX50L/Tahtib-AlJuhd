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
}

export interface signInReturnType {
  user: Partial<IUser> & { status: string | null };
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
  user: Partial<IUser>;
}

export interface refreshTokenReturnType {
  user: Partial<IUser> & { status: string | null };
  accessToken: string;
  refreshToken: string;
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
  getUserData(id: string): Promise<getUserDataReturnType>;
  getUserById(id: string): Promise<IUser | null>;
}