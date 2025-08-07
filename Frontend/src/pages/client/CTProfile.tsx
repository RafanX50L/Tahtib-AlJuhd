import Sidebar from "../../components/client/Sidebar";
import Header from "../../components/client/Dashboard/CDHeader";
import StatsGrid from "../../components/client/Dashboard/StatsGrid";
import WeeklyChallenge from "../../components/client/Dashboard/WeeklyCahllenge";
import WorkoutLevels from "../../components/client/Dashboard/WorkoutLevels";
import Leaderboard from "../../components/client/Dashboard/LeaderBoard";
import ChatbotButton from "../../components/client/ChatbotButton";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import styles from "../../components/client/Personalization/styles/BasicDetails.module.css";
import CFooter from "@/components/client/Footer";
import TrainerProfile from "@/components/client/Trainer/CTProfile";

const CTProfilePage = () => {
  return (
    <div className="bg-[#12151E] text-white min-h-screen font-sans">
      <Sidebar />
      <main
        className={`pt-[70px] lg:pt-0 px-4 py-8 lg:px-8 lg:ml-[280px] transition-all ${styles.container}`}
      >
        <TrainerProfile />
        <CFooter />
      </main>
    </div>
  );
};

export default CTProfilePage;
