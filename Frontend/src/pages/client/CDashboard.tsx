import { useRef } from "react";
import Sidebar from "../../components/client/Sidebar";
import StatsGrid from "../../components/client/Dashboard/StatsGrid";
import WeeklyChallenge from "../../components/client/Dashboard/WeeklyCahllenge";
import WorkoutLevels from "../../components/client/Dashboard/WorkoutLevels";
import Leaderboard from "../../components/client/Dashboard/LeaderBoard";
import ChatbotButton from "../../components/client/ChatbotButton";
import styles from "../../components/client/Personalization/styles/BasicDetails.module.css";
import CFooter from "@/components/client/Footer";
import Header, { SidebarRef } from "@/components/client/Header";



const CDashboard = () => {
  const sidebarRef = useRef<SidebarRef>(null);

  const handleMenuToggle = () => {
    sidebarRef.current?.toggleSidebar();
  };

  return (
    <div className="bg-[#12151E] text-white min-h-screen font-sans">
      <Sidebar ref={sidebarRef} />
      <main
        className={`pt-[70px] lg:pt-0 px-4 py-8 lg:px-8 lg:ml-[280px] transition-all duration-300 ${styles.container}`}
      >
        <Header
          title="Dashboard"
          content="Welcome back! Ready for today's workout?"
          onMenuToggle={handleMenuToggle}
        />
        <div className="space-y-8">
          <StatsGrid />
          <WeeklyChallenge />
          <WorkoutLevels />
          <Leaderboard />
        </div>
        <ChatbotButton />
        <CFooter />
      </main>
    </div>
  );
};

export default CDashboard;