import LayoutPage from "@/pages/client/Layout";
import LandingPage from "@/pages/landing/LandingPage";
import { Route, Routes } from "react-router-dom";
import CDashboard from "@/pages/client/CDashboard";

const UserRotues: React.FC = () => {
  console.log('entered to here')
  return (
    
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/Dashboard" element={<CDashboard />} />
      <Route path="/client"  element={<LayoutPage />}/>
        {/* <Route path="/personalization" element={<Personalization />} />
      </Route> */}
    </Routes>
  );
};

export default UserRotues;