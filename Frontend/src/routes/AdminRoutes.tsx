import { Route, Routes } from "react-router-dom";
import ADashboard from "@/pages/admin/ADashboard";
import AClientManagment from "@/pages/admin/AClientManagment";
import ATrainerManagment from "@/pages/admin/ATrainerManagment";
import NotFoundPage from "@/pages/common/NotFond";
import TrainerInterviewSchedule from "@/pages/admin/test";

const AdminRotues: React.FC = () => {
  console.log("enterd to some whrere");
  return (
    <Routes>
      <Route path="dashboard" element={<ADashboard />} />
      <Route path="client-management" element={<AClientManagment />} />
      <Route path="trainer-management" element={<ATrainerManagment />} />
      <Route path ="interview-schedule" element={<TrainerInterviewSchedule/>} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AdminRotues;
