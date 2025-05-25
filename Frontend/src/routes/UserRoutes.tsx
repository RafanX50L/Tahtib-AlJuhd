import LayoutPage from "@/pages/client/Layout";
import LandingPage from "@/pages/landing/LandingPage";
import { Route, Routes } from "react-router-dom";
import CDashboard from "@/pages/client/CDashboard";
import Personalization from "@/pages/client/Personalization";

const UserRotues: React.FC = () => {
  console.log('entered to here')
  return (
    
    <Routes>
      <Route path="/personalization" element = {<Personalization/>}/>
      <Route path="/Dashboard" element={<CDashboard />} />
      {/* <Route path="/client"  element={<LayoutPage />}/> */}
    </Routes>
  );
};

export default UserRotues;