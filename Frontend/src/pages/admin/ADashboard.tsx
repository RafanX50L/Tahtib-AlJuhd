import Sidebar from "../../components/admin/Sidebar";
import Header from "../../components/admin/Dashboard/Header";
import StatsCard from "../../components/admin/Dashboard/StatsCard";
import TrainerApplications from "../../components/admin/Dashboard/TrainerApplication";
import RevenueChart from "../../components/admin/Dashboard/RevenueChart";
import RecentPayments from "../../components/admin/Dashboard/RecentPayments";
import { HelpCircle, Info } from "lucide-react"; // Ensure this is the correct library for LucideIcon

const ADashboard = () => {
  return (
    // <div>
    //   afdksfj
    // </div>

    <div className="flex h-screen overflow-hidden bg-black text-white">
      
      <Sidebar />
      <div className="flex-1 overflow-y-auto">
        <Header />
        <main className="px-6 py-8">
          <StatsCard />
          <TrainerApplications />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <RevenueChart />
            <RecentPayments />
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