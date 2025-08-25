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
import NotificationsPage from "./components/client/Notification/Notifications";
import { useEffect } from "react";
import { useSocket } from "./hooks/socketio";
import { useSelector } from "react-redux";
import { RootState } from "./store/store";
import { chatEnum } from "./lib/chat-enum";

const App: React.FC = () => {
  console.log("Entered App.tsx");
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
