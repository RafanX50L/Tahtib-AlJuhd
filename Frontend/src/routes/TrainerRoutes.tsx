// src/routes/TrainerRoutes.tsx
import { Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";

const TDashboard = lazy(() => import("@/pages/trainer/TDashboard"));
const TrainerForm = lazy(() => import("@/pages/trainer/TSubmittingDetails"));
const VerifyingTrainer = lazy(() => import("@/components/trainer/Dashboard/VerifyingTrainer"));
const TProfile = lazy(() => import("@/pages/trainer/TProfile"));
const NotFoundPage = lazy(() => import("@/pages/common/NotFond"));
const TrainerSetAvailability = lazy(() => import("@/pages/trainer/TSetAvailabilityPage"));
const TSetPlanPage = lazy(() => import("@/pages/trainer/TSetPlans"));
const TSetAvailabilityPage = lazy(() => import("@/pages/trainer/TSetAvailabilityPage"));
const TCChatPage = lazy(() => import("@/pages/trainer/TCChatPage"));
const NotificationsPage = lazy(() => import("@/components/shared/Notification"));

import { trainerTheme } from "@/components/shared/Notification";

const TrainerRoutes: React.FC = () => {
  return (
    <Suspense fallback={<div className="p-6 text-center">Loading...</div>}>
      <Routes>
        <Route path="/job-application" element={<TrainerForm />} />
        <Route path="/pendingCase" element={<VerifyingTrainer />} />
        <Route path="/dashboard" element={<TDashboard />} />
        <Route path="/clients" element={<TCChatPage />} />
        <Route path="/chat/:id" element={<TCChatPage />} />
        <Route path="/profile" element={<TProfile />} />
        <Route path="/plans" element={<TSetPlanPage />} />
        <Route path="/availability" element={<TSetAvailabilityPage />} />
        <Route path="/messages" element={<TrainerSetAvailability />} />
        <Route
          path="/notification"
          element={<NotificationsPage theme={trainerTheme} backPath="/trainer/dashboard" />}
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};

export default TrainerRoutes;
