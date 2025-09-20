import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { lazy, Suspense } from "react";
import { AuthRoute } from "./routes/AuthRoute";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import LandingPage from "./pages/landing/LandingPage";
import VideoCall from "./pages/common/VideoCallP";
import NotFoundPage from "./pages/common/NotFond";
import { AuthInitializer } from "./routes/AuthInitializer";
import { useEffect } from "react";
import { useSocket } from "./hooks/socketio";
import { useSelector } from "react-redux";
import { RootState } from "./store/store";
import { chatEnum } from "./lib/chat-enum";

// Lazy load route groups
const UserRoutes = lazy(() => import("./routes/UserRoutes"));
const TrainerRoutes = lazy(() => import("./routes/TrainerRoutes"));
const AdminRoutes = lazy(() => import("./routes/AdminRoutes"));
const AuthRoutes = lazy(() => import("./routes/AuthRoutes"));

const App: React.FC = () => {
  const socket = useSocket();
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (socket && user?._id) {
      socket.on("connect", () => {
        console.log("Socket connected, ID:", socket.id);
        socket.emit(chatEnum.joinUser, {
          userId: user._id,
          role: user.role,
        });
        console.log("Emitted joinUser for user:", user._id, "role:", user.role);
      });

      socket.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
      });

      socket.on("disconnect", () => {
        console.log("Socket disconnected");
      });
    }

    return () => {
      socket?.off("connect");
      socket?.off("connect_error");
      socket?.off("disconnect");
    };
  }, [socket, user]);

  return (
    <>
      <Toaster richColors position="top-right" />
      <BrowserRouter>
        <AuthInitializer>
          <div className="relative min-h-screen overflow-hidden scrollbar-none">
            <Suspense fallback={<div>Loading...</div>}>
              <Routes>
                <Route path="/room/:meetId" element={<VideoCall />} />
                <Route path="/" element={<LandingPage />} />

                {/* Auth routes */}
                <Route path="/auth/*" element={<AuthRoute />}>
                  <Route path="*" element={<AuthRoutes />} />
                </Route>

                {/* Client routes */}
                <Route
                  path="/*"
                  element={<ProtectedRoute allowedRoles="client" />}
                >
                  <Route path="*" element={<UserRoutes />} />
                </Route>

                {/* Trainer routes */}
                <Route
                  path="/trainer/*"
                  element={<ProtectedRoute allowedRoles="trainer" />}
                >
                  <Route path="*" element={<TrainerRoutes />} />
                </Route>

                {/* Admin routes */}
                <Route
                  path="/admin/*"
                  element={<ProtectedRoute allowedRoles="admin" />}
                >
                  <Route path="*" element={<AdminRoutes />} />
                </Route>

                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Suspense>
          </div>
        </AuthInitializer>
      </BrowserRouter>
    </>
  );
};

export default App;
