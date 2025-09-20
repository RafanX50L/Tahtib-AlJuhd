import Sidebar from "../../components/trainer/Sidebar";
import Header from "../../components/trainer/Header";
import StatsGrid from "../../components/trainer/Dashboard/StatsGrid";
import PerformanceTrends from "../../components/trainer/Dashboard/PerfomanceTrends";
import PaymentHistory from "../../components/trainer/Dashboard/PaymentHistory";

const TDashboard = () => {
  return (
    <div className="min-h-screen flex font-sans bg-[#121212] text-[#ffffff]">
      <Sidebar />
      <main className="flex-1 ml-0 lg:ml-[280px] p-4 lg:p-8">
        <Header text="Dashboard"/>
        <StatsGrid />
        <PerformanceTrends />
        <PaymentHistory />
      </main>
    </div>
  );
};

export default TDashboard;
