// src/App.tsx
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import UserRoutes from "./routes/UserRoutes";
import AuthRoutes from "./routes/AuthRoutes";
import TrainerRoutes from "./routes/TrainerRoutes";
import AdminRoutes from "./routes/AdminRoutes";
import { AuthRoute } from "./routes/AuthRoute";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import LandingPage from "./pages/landing/LandingPage";
import VideoCall from "./pages/common/VideoCallP";
import NotFoundPage from "./pages/common/NotFond";
import { AuthInitializer } from "./routes/AuthInitializer";

const App: React.FC = () => {
  console.log("Entered App.tsx");
  return (
    <>
      <Toaster richColors position="top-right" />
      <BrowserRouter>
        <AuthInitializer>
          <div className="relative min-h-screen overflow-hidden scrollbar-none">
            <Routes>
              <Route path="/room/:meetId" element={<VideoCall />} />
              <Route path="/" element={<LandingPage />} />
              <Route path="/auth/*" element={<AuthRoute />}>
                <Route path="*" element={<AuthRoutes />} />
              </Route>
              <Route
                path="/*"
                element={<ProtectedRoute allowedRoles="client" />}
              >
                <Route path="*" element={<UserRoutes />} />
              </Route>
              <Route
                path="/trainer/*"
                element={<ProtectedRoute allowedRoles="trainer" />}
              >
                <Route path="*" element={<TrainerRoutes />} />
              </Route>
              <Route
                path="/admin/*"
                element={<ProtectedRoute allowedRoles="admin" />}
              >
                <Route path="*" element={<AdminRoutes />} />
              </Route>
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </div>
        </AuthInitializer>
      </BrowserRouter>
    </>
  );
};

export default App;