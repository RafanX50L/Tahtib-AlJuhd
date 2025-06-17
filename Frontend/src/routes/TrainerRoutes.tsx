import { Route, Routes } from "react-router-dom";
import TDashboard from "@/pages/trainer/TDashboard";
import TrainerForm from "@/pages/trainer/TSubmittingDetails";
import VerifyingTrainer from "@/components/trainer/Dashboard/VerifyingTrainer";

const TrainerRotues: React.FC = () => {
  return (
    <Routes>
      <Route path="/job-application" element={<TrainerForm />} />
      <Route path="/pendingCase" element={<VerifyingTrainer />} />
      <Route path="/dashboard" element={<TDashboard />} />
    </Routes>
  );
};

export default TrainerRotues;
