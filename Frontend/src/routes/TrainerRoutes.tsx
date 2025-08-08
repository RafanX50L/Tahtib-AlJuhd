import { Route, Routes } from "react-router-dom";
import TDashboard from "@/pages/trainer/TDashboard";
import TrainerForm from "@/pages/trainer/TSubmittingDetails";
import VerifyingTrainer from "@/components/trainer/Dashboard/VerifyingTrainer";
import TProfile from "@/pages/trainer/TProfile";
import NotFoundPage from "@/pages/common/NotFond";

const TrainerRotues: React.FC = () => {
  return (
    <Routes>
      <Route path="/job-application" element={<TrainerForm />} />
      <Route path="/pendingCase" element={<VerifyingTrainer />} />
      <Route path="/dashboard" element={<TDashboard />} />
      <Route path="/profile" element={<TProfile />} />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default TrainerRotues;
