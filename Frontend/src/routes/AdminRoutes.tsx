
import { Route, Routes } from "react-router-dom";
import ADashboard from "@/pages/admin/ADashboard";

const AdminRotues: React.FC = () => {
  return (
    <Routes>
      <Route path="/dashboard" element={<ADashboard />} />
    </Routes>
  );
};

export default AdminRotues;