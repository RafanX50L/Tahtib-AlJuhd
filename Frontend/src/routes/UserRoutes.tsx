import LayoutPage from "@/pages/client/Layout";
import LandingPage from "@/pages/landing/LandingPage";
import { Route, Routes } from "react-router-dom";
import CDashboard from "@/pages/client/CDashboard";
import Personalization from "@/pages/client/Personalization";
import WorkoutPlan from "@/pages/client/CWorkouts";
import WorkoutSession from "@/pages/client/CWorkoutSession";
import WorkoutReport from "@/components/client/Workouts/WorkoutReport";
import ChallengeDetail from "@/components/client/WeeklyChallenge/ChallengeDetails";

const UserRotues: React.FC = () => {
  console.log('entered to client routes')
  return (
    
    <Routes>
      <Route path="/Dashboard" element={<CDashboard />} />
      <Route path="/personalization" element = {<Personalization/>}/>
      <Route path="/workouts" element={<WorkoutPlan/>} />
      <Route path="/workoutSession" element={<WorkoutSession/>}/>
      <Route path="/workout-report" element={<WorkoutReport/>}/>
      <Route path="/challenge/:id" element={<ChallengeDetail/>}/>
      
      {/* <Route path="/client"  element={<LayoutPage />}/> */}
    </Routes>
  );
};

export default UserRotues;