import Sidebar from "../../components/admin/Sidebar";
import Header from "../../components/admin/Dashboard/Header";
import StatsCard from "../../components/admin/Dashboard/StatsCard";
import TrainerApplications from "../../components/admin/Dashboard/TrainerApplication";
import TopTrainers from "../../components/admin/Dashboard/TopTrainers";
import RevenueChart from "../../components/admin/Dashboard/RevenueChart";
import RecentActivities from "../../components/admin/Dashboard/RecentActivities";
import Notifications from "../../components/admin/Dashboard/Notifications";
import { HelpCircle, Info, LucideIcon } from "lucide-react"; // Ensure this is the correct library for LucideIcon

const ADashboard = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-black text-white">
      <Sidebar />
      <div className="flex-1 overflow-y-auto">
        <Header />
        <main className="px-6 py-8">
          <StatsCard />
          <TrainerApplications />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <TopTrainers />
            <RevenueChart />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <RecentActivities className="lg:col-span-2" />
            <Notifications />
          </div>
        </main>
        <footer className="px-6 py-4 bg-gray-900 mt-8">
          <div className="flex items-center justify-between">
            <p className="text-gray-400 text-sm">
              © 2025 FitConnect Admin Portal. All rights reserved.
            </p>
            <div className="flex items-center space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <HelpCircle className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Info className="w-5 h-5" />
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default ADashboard;