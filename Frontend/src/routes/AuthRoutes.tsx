import { ForgotPasswordPage } from "@/components/auth/ForgotPassword";
import { OTPVerificationPage } from "../components/auth/Input-otp-from";
import { ResetPasswordPage } from "@/components/auth/ResetPassword";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Auth from "@/pages/auth/Auth";
import { Route, Routes } from "react-router-dom";
import { env } from "@/config/env";
import { useEffect } from "react";

const OtpVerification = () => { 
  console.log("otpVerification rendered");
  return (
    <div>
      <h1>OTP Verification</h1>
      <p>Please enter the OTP sent to your email.</p>
    </div>
  )
}


const AuthRotues: React.FC = () => {
  console.log("AuthRoutes rendered");
  
  return (
    <Routes>
      <Route
        path="/"
        element={
          <GoogleOAuthProvider clientId={env.GOOGLE_CLIENT_ID}>
            <Auth />
          </GoogleOAuthProvider>
        }
      />
      <Route path="otp-verification" element={<OTPVerificationPage />} />
      <Route path="reset-password" element={<ResetPasswordPage />} />
      <Route path="forgot-password" element={<ForgotPasswordPage />} />
    </Routes>
  );
};

export default AuthRotues;
