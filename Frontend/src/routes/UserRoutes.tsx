import LayoutPage from "@/pages/client/Layout";
import LandingPage from "@/pages/landing/LandingPage";
import { Route, Routes } from "react-router-dom";
import CDashboard from "@/pages/client/CDashboard";
import Personalization from "@/pages/client/Personalization";
import WorkoutPlan from "@/pages/client/CWorkouts";

const UserRotues: React.FC = () => {
  console.log('entered to client routes')
  return (
    
    <Routes>
      <Route path="/Dashboard" element={<CDashboard />} />
      <Route path="/personalization" element = {<Personalization/>}/>
      <Route path="/workouts" element={<WorkoutPlan/>} />
      
      {/* <Route path="/client"  element={<LayoutPage />}/> */}
    </Routes>
  );
};

export default UserRotues;