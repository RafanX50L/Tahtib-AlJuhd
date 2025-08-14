import { Route, Routes } from "react-router-dom";
import TDashboard from "@/pages/trainer/TDashboard";
import TrainerForm from "@/pages/trainer/TSubmittingDetails";
import VerifyingTrainer from "@/components/trainer/Dashboard/VerifyingTrainer";
import TProfile from "@/pages/trainer/TProfile";
import NotFoundPage from "@/pages/common/NotFond";
import TrainerSetAvailability from "@/pages/trainer/TSetAvailabilityPage";
import TSetPlanPage from "@/pages/trainer/TSetPlans";
import TSetAvailabilityPage from "@/pages/trainer/TSetAvailabilityPage";
import TClientPage from "@/pages/trainer/TClientPage";
import TCChatPage from "@/pages/trainer/TCChatPage";

const TrainerRotues: React.FC = () => {
  return (
    <Routes>
      <Route path="/job-application" element={<TrainerForm />} />
      <Route path="/pendingCase" element={<VerifyingTrainer />} />
      <Route path="/dashboard" element={<TDashboard />} />
      <Route path="/clients" element={<TClientPage />} />
      <Route path="/chat/:id" element={<TCChatPage />} />
      <Route path="/profile" element={<TProfile />} />
      <Route path="/plans" element={<TSetPlanPage />} />
      <Route path="/availability" element={<TSetAvailabilityPage />} />
      <Route path="/messages" element={<TrainerSetAvailability />} />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default TrainerRotues;
