// src/routes/TrainerRoutes.tsx
import { Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";

const TDashboard = lazy(() => import("@/pages/trainer/TDashboard"));
const TrainerForm = lazy(() => import("@/pages/trainer/TSubmittingDetails"));
const VerifyingTrainer = lazy(() => import("@/components/trainer/Dashboard/VerifyingTrainer"));
const TProfile = lazy(() => import("@/pages/trainer/TProfile"));
const NotFoundPage = lazy(() => import("@/pages/common/NotFond"));
const TSetPlanPage = lazy(() => import("@/pages/trainer/TSetPlans"));
const TSetAvailabilityPage = lazy(() => import("@/pages/trainer/TSetAvailabilityPage"));
const TCChatPage = lazy(() => import("@/pages/trainer/TCChatPage"));
const NotificationsPage = lazy(() => import("@/components/shared/Notification"));


import { trainerTheme } from "@/components/shared/Notification";
import CommunityApp from "@/pages/common/community/CommunityApp";
import CreatePost from "@/pages/common/community/createPost";
import UserSearch from "@/pages/common/community/UserSearch";

const TrainerRoutes: React.FC = () => {
  return (
    <Suspense fallback={<div className="p-6 text-center">Loading...</div>}>
      <Routes>
        <Route path="/job-application" element={<TrainerForm />} />
        <Route path="/pendingCase" element={<VerifyingTrainer />} />
        <Route path="/dashboard" element={<TDashboard />} />
        <Route path="/profile" element={<TProfile />} />
        <Route path="/plans" element={<TSetPlanPage />} />
        <Route path="/availability" element={<TSetAvailabilityPage />} />
        <Route path="/messages" element={<TCChatPage />} />
        <Route
          path="/notification"
          element={<NotificationsPage theme={trainerTheme} backPath="/trainer/dashboard" />}
        />
        <Route path="/community" element={<CommunityApp />} />
        <Route path="/community/create" element={<CreatePost />} />
        <Route path="/search" element={<UserSearch />} />
        {/* <Route path="/profile/:userId" element={<UserProfile />} /> */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};

export default TrainerRoutes;
