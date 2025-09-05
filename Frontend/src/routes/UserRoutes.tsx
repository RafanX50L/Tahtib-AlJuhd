// src/routes/UserRoutes.tsx
import { Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";

const CDashboard = lazy(() => import("@/pages/client/CDashboard"));
const Personalization = lazy(() => import("@/pages/client/Personalization"));
const WorkoutPlan = lazy(() => import("@/pages/client/CWorkouts"));
const WorkoutSession = lazy(() => import("@/pages/client/CWorkoutSession"));
const WorkoutReport = lazy(() => import("@/components/client/Workouts/WorkoutReport"));
const ChallengeDetail = lazy(() => import("@/components/client/WeeklyChallenge/ChallengeDetails"));
const CProfile = lazy(() => import("@/pages/client/CProfile"));
const NotFoundPage = lazy(() => import("@/pages/common/NotFond"));
const CTrainerSession = lazy(() => import("@/pages/client/CTrainerSession"));
const CChatBotPage = lazy(() => import("@/pages/client/CChatbot"));
const CTProfilePage = lazy(() => import("@/pages/client/CTProfile"));
const CDietPlanPage = lazy(() => import("@/pages/client/CDietPlan"));
const CATrainerDetailsPage = lazy(() => import("@/pages/client/CATProfilePage"));
const CCurrentTrainerPage = lazy(() => import("@/pages/client/CCTrainerPage"));
const CBookingPage = lazy(() => import("@/pages/client/CBooking"));
const NotificationsPage = lazy(() => import("@/components/shared/Notification"));

import { clientTheme } from "@/components/shared/Notification";
import CommunityApp from "@/pages/community/CommunityApp";
import CreatePost from "@/components/community/CreatePost";
import Search from "@/components/community/Search";
import UserProfile from "@/pages/common/UserProfile";

const UserRoutes: React.FC = () => {
  console.log("Entered UserRoutes");

  return (
    <Suspense fallback={<div className="p-6 text-center">Loading...</div>}>
      <Routes>
        <Route path="/dashboard" element={<CDashboard />} />
        <Route path="/personalization" element={<Personalization />} />
        <Route path="/workouts" element={<WorkoutPlan />} />
        <Route path="/workoutSession" element={<WorkoutSession />} />
        <Route path="/workout-report" element={<WorkoutReport />} />
        <Route path="/challenge/:id" element={<ChallengeDetail />} />
        <Route path="/profile" element={<CProfile />} />
        <Route path="/trainerSession" element={<CTrainerSession />} />
        <Route path="/trainer-details" element={<CTProfilePage />} />
        <Route path="/current-trainer" element={<CCurrentTrainerPage />} />
        <Route path="/diet" element={<CDietPlanPage />} />
        <Route path="/chat" element={<CChatBotPage />} />
        <Route path="/trainer-details/:trainerId" element={<CATrainerDetailsPage />} />
        <Route path="/booking/:trainerId" element={<CBookingPage />} />
        <Route path="/community" element={<CommunityApp />} />
        <Route path="/community/create" element={<CreatePost />} />
        <Route path="/search" element={<Search />} />
        <Route path="/profile/:userId" element={<UserProfile />} />
        <Route
          path="/notifications"
          element={<NotificationsPage theme={clientTheme} backPath="/dashboard" />}
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};

export default UserRoutes;
