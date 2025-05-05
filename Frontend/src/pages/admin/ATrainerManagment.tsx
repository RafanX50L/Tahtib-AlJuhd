import Header from "../../components/admin/TrainerManagment/Header";
import Sidebar from "../../components/admin/Sidebar";
import { HelpCircle, Info } from "lucide-react";
import TrainerStatsCard from "@/components/admin/TrainerManagment/TrainerStatsCard";
import ApprovedTrainersTable from "@/components/admin/TrainerManagment/ApprovedTrainers";
import PendingApplicationsTable from "@/components/admin/TrainerManagment/PendingApplicationsTable";

const ATrainerManagment = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-black text-white">
      <Sidebar />
      <div className="flex-1 overflow-y-auto">
        <Header />
        <main className="px-6 py-8">
          <TrainerStatsCard />
          <ApprovedTrainersTable />
          <PendingApplicationsTable />
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

export default ATrainerManagment;
