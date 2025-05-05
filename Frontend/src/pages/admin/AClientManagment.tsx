import Header from "../../components/admin/ClientManagment/Header";
import StatsCard from "../../components/admin/ClientManagment/StatsCard";
import ClientsTable from "../../components/admin/ClientManagment/ClientTable";
import Sidebar from "../../components/admin/Sidebar";
import { HelpCircle, Info } from "lucide-react";

const AClientManagment = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-black text-white">
      <Sidebar />
      <div className="flex-1 overflow-y-auto">
        <Header />
        <main className="px-6 py-8">
          <StatsCard />
          <ClientsTable />
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

export default AClientManagment;
