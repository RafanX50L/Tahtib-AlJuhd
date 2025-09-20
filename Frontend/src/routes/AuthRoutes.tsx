// src/routes/AuthRoutes.tsx
import { Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { env } from "@/config/env";

// Lazy imports
const ForgotPasswordPage = lazy(() => import("@/components/auth/ForgotPassword").then(m => ({ default: m.ForgotPasswordPage })));
const OTPVerificationPage = lazy(() => import("@/components/auth/Input-otp-from").then(m => ({ default: m.OTPVerificationPage })));
const ResetPasswordPage = lazy(() => import("@/components/auth/ResetPassword").then(m => ({ default: m.ResetPasswordPage })));
const Auth = lazy(() => import("@/pages/auth/Auth"));

const AuthRoutes: React.FC = () => {
  console.log("AuthRoutes rendered");

  return (
    <Suspense fallback={<div className="p-6 text-center">Loading...</div>}>
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
    </Suspense>
  );
};

export default AuthRoutes;
