import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import UserRotues from "./routes/UserRoutes";
import AuthRotues from "./routes/AuthRoutes";
import TrainerRotues from "./routes/TrainerRoutes";
import AdminRotues from "./routes/AdminRoutes";
import React, { useEffect } from "react";
import { AuthRoute } from "./routes/AuthRoute";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import LandingPage from "./pages/landing/LandingPage";
import { Button } from "./components/ui/button";
import { usePWA } from "./hooks/usePWA";
import TrainerForm from "./pages/trainer/TSubmittingDetails";
import VideoCall from "./pages/common/VideoCallP";
import ProfilePage from "./UserProfile";
console.warn('rafan');
const App: React.FC = () => {
  console.log("enterd to react App.tsx page");
  const { promptInstall, canInstall } = usePWA();

  useEffect(() => {
    if (canInstall) {
      console.log("App can be installed");
    }
  }, [canInstall]);
  return (
    <>
      <Toaster richColors position="top-right" />
      <BrowserRouter>
        <div className="relative min-h-screen">
          {canInstall && (
            <Button
              onClick={promptInstall}
              className="fixed bottom-4 right-4 bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Install App
            </Button>
          )}

          <Routes>
            <Route path="/userProfile" element={<ProfilePage/>} />
            <Route path="/room/:meetId" element={<VideoCall/>} />
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth/*" element={<AuthRoute />}>
              <Route path="*" element={<AuthRotues />} />
            </Route>
            <Route
              path="/*"
              element={<ProtectedRoute allowedRoles={"client"} />}
            >
              <Route path="*" element={<UserRotues />} />
            </Route>
            <Route
              path="/trainer/*"
              element={<ProtectedRoute allowedRoles={"trainer"} />}
            >
              <Route path="*" element={<TrainerRotues />} />
            </Route>
            <Route
              path="/admin/*"
              element={<ProtectedRoute allowedRoles={"admin"} />}
            >
              <Route path="*" element={<AdminRotues />} />
            </Route>
          </Routes>
        </div>
      </BrowserRouter>
    </>
  );
};

export default App;
