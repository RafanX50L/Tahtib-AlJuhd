
import { Route, Routes } from "react-router-dom";
import TDashboard from "@/pages/trainer/TDashboard";

const TrainerRotues: React.FC = () => {
  return (
    <Routes>
      <Route path="/dashboard" element={<TDashboard />} />
    </Routes>
  );
};

export default TrainerRotues;