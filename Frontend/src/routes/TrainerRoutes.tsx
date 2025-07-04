import { Route, Routes } from "react-router-dom";
import TDashboard from "@/pages/trainer/TDashboard";
import TrainerForm from "@/pages/trainer/TSubmittingDetails";
import VerifyingTrainer from "@/components/trainer/Dashboard/VerifyingTrainer";
import TProfile from "@/pages/trainer/TProfile";

const TrainerRotues: React.FC = () => {
  return (
    <Routes>
      <Route path="/job-application" element={<TrainerForm />} />
      <Route path="/pendingCase" element={<VerifyingTrainer />} />
      <Route path="/dashboard" element={<TDashboard />} />
      <Route path="/profile" element={<TProfile />} />
    </Routes>
  );
};

export default TrainerRotues;
