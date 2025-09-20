// src/routes/AdminRoutes.tsx
import { Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";

const ADashboard = lazy(() => import("@/pages/admin/ADashboard"));
const AClientManagement = lazy(() => import("@/pages/admin/AClientManagment"));
const ATrainerManagement = lazy(
  () => import("@/pages/admin/ATrainerManagment")
);
const APayments = lazy(() => import("@/pages/admin/APayments"));
const NotFoundPage = lazy(() => import("@/pages/common/NotFond"));
const NotificationsPage = lazy(
  () => import("@/components/shared/Notification")
);

import { adminTheme } from "@/components/shared/Notification";

const AdminRoutes: React.FC = () => {
  console.log("Entered AdminRoutes");

  return (
    <Suspense fallback={<div className="p-6 text-center">Loading...</div>}>
      <Routes>
        <Route path="dashboard" element={<ADashboard />} />
        <Route path="client-management" element={<AClientManagement />} />
        <Route path="trainer-management" element={<ATrainerManagement />} />
        <Route path="payments" element={<APayments />} />
        <Route
          path="/notification"
          element={
            <NotificationsPage
              theme={adminTheme}
              backPath="/admin/dashboard"
            />
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};

export default AdminRoutes;
