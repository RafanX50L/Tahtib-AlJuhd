import Sidebar from '../../components/client/Sidebar';
import Header from '../../components/client/Dashboard/CDHeader';
import StatsGrid from '../../components/client/Dashboard/StatsGrid';
import WeeklyChallenge from '../../components/client/Dashboard/WeeklyCahllenge';
import WorkoutLevels from '../../components/client/Dashboard/WorkoutLevels';
import Leaderboard from '../../components/client/Dashboard/LeaderBoard';
import ChatbotButton from '../../components/client/ChatbotButton';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import styles from '../../components/client/Personalization/styles/BasicDetails.module.css'
import CFooter from '@/components/client/Footer';

const CDashboard = () => {
 
  return (
    <div className="bg-[#12151E] text-white min-h-screen font-sans">
      <Sidebar />
      <main className={`lg:ml-[280px]  pt-[70px] lg:pt-0 p-4 lg:p-8 transition-all p-32 ${styles.container}`}>
        <Header />
        <StatsGrid />
        <WeeklyChallenge />
        <WorkoutLevels />
        <Leaderboard />
        <ChatbotButton />
        <CFooter/>
      </main>
    </div>
  );
};

export default CDashboard;