// src/pages/Personalization.tsx
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import BasicDetails from '@/components/client/Personalization/BasicDetails';
import FitnessGoals from '@/components/client/Personalization/FitnessGoal';
import WorkoutPreferences from '@/components/client/Personalization/WorkoutPreferences';
import HealthConsiderations from '@/components/client/Personalization/HealthConsideration';
import DietPreferences from '@/components/client/Personalization/DietPreferences';
import Summary from '@/components/client/Personalization/Summary';

const Personalization = () => {
  console.log('enterd to personalization')
  const [searchParams] = useSearchParams();
  const [path, setPath] = useState(searchParams.get('path') || 'basic-details');

  useEffect(() => {
    const currentPath = searchParams.get('path') || 'basic-details';
    setPath(currentPath);
  }, [searchParams]);

  return (
    <div>
      {path === 'basic-details' && <BasicDetails />}
      {path === 'fitness-goals' && <FitnessGoals />}
      {path === 'workout-preferences' && <WorkoutPreferences />}
      {path === 'health-consideration' && <HealthConsiderations />}
      {path === 'diet-preferences' && <DietPreferences />}
      {path === 'summary' && <Summary />}
    </div>
  );
};

export default Personalization;