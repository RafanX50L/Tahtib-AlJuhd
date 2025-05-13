import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import UserRotues from "./routes/UserRoutes";
import AuthRotues from "./routes/AuthRoutes";
import TrainerRotues from "./routes/TrainerRoutes";
import AdminRotues from "./routes/AdminRoutes";
import React from "react";
import { AuthRoute } from "./routes/AuthRoute";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { AuthProvider } from "./globalContext/AuthContext";

const App: React.FC = () => {
  return (
    <>
      <Toaster richColors position="top-right" />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
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
            {/* <Route
              path="/admin/*"
              element={<ProtectedRoute allowedRoles={"admin"} />}
            > */}
              <Route path="/admin/*" element={<AdminRotues />} />
            {/* </Route> */}
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </>
  );
};

export default App;
