
import { Route, Routes } from "react-router-dom";
import ADashboard from "@/pages/admin/ADashboard";
import AClientManagment from "@/pages/admin/AClientManagment";
import ATrainerManagment from "@/pages/admin/ATrainerManagment";

const AdminRotues: React.FC = () => {
  return (
    <Routes>
      <Route path="/dashboard" element={<ADashboard />} />
      <Route path="/client-management" element={<AClientManagment />} />
      <Route path="/trainer-management" element={<ATrainerManagment />} />
    </Routes>
  );
};

export default AdminRotues;