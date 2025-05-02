import { OTPVerificationPage } from "@/components/auth/Input-otp-from";
import Auth from "@/pages/auth/Auth";
import Personalization from "@/pages/client/Personalization";
import LandingPage from "@/pages/landing/LandingPage";
import { Layout } from "lucide-react";
import { Route, Routes } from "react-router-dom";

const UserRotues: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/auth/otp-verification" element={<OTPVerificationPage />} />

      <Route path="/" element={<Layout />}>
        <Route path="/personalization" element={<Personalization />} />
      </Route>
    </Routes>
  );
};

export default UserRotues;