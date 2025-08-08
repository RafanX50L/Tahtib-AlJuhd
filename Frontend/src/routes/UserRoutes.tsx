// src/routes/UserRoutes.tsx
import { Route, Routes } from 'react-router-dom';
import CDashboard from '@/pages/client/CDashboard';
import Personalization from '@/pages/client/Personalization';
import WorkoutPlan from '@/pages/client/CWorkouts';
import WorkoutSession from '@/pages/client/CWorkoutSession';
import WorkoutReport from '@/components/client/Workouts/WorkoutReport';
import ChallengeDetail from '@/components/client/WeeklyChallenge/ChallengeDetails';
import CProfile from '@/pages/client/CProfile';
import NotFoundPage from '@/pages/common/NotFond';
import CTrainerSession from '@/pages/client/CTrainerSession';
import CChatBotPage from '@/pages/client/CChatbot';
import CTProfilePage from '@/pages/client/CTProfile';
import CurrentTrainer from '@/components/client/Trainer/CCurrentTrainers';
import CDietPlanPage from '@/pages/client/CDietPlan';

const UserRoutes: React.FC = () => {
  console.log('Entered UserRoutes');
  return (
    <Routes>
      <Route path="/dashboard" element={<CDashboard />} /> {/* Fixed to lowercase */}
      <Route path="/personalization" element={<Personalization />} />
      <Route path="/workouts" element={<WorkoutPlan />} />
      <Route path="/workoutSession" element={<WorkoutSession />} />
      <Route path="/workout-report" element={<WorkoutReport />} />
      <Route path="/challenge/:id" element={<ChallengeDetail />} />
      <Route path="/profile" element={<CProfile />} />
      <Route path="/trainerSession" element={<CTrainerSession />} />
      <Route path="/trainer-details" element={<CTProfilePage />} />
      <Route path="/current-trainer" element={<CurrentTrainer />} />
      <Route path="/diet" element={<CDietPlanPage />} />
      <Route path="/chat" element={<CChatBotPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default UserRoutes;