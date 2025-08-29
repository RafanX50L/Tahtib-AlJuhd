import { useEffect, useState } from "react";
import Header from "../../components/admin/ClientManagment/Header";
import StatsCard from "../../components/admin/ClientManagment/StatsCard";
import ClientsTable, { IClient } from "../../components/admin/ClientManagment/ClientTable";
import Sidebar from "../../components/admin/Sidebar";
import { HelpCircle, Info } from "lucide-react";
import { AdminService } from "@/services/implementation/adminServices";
import { toast } from "sonner";

const AClientManagment = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [clientData, setClientData] = useState<IClient[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [statusFilter, setStatusFilter] = useState<"active" | "blocked" | "all">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    console.log("Fetching clients with searchTerm:", JSON.stringify(searchTerm)); // Debug log with JSON.stringify to catch special characters
    const fetchClientData = async () => {
      setIsLoading(true);
      try {
        // Sanitize searchTerm to prevent invalid values
        const sanitizedSearchTerm = searchTerm.trim() === "%7D" || searchTerm.trim() === "}" ? "" : searchTerm.trim();
        const response = await AdminService.getAllClients(
          statusFilter,
          sanitizedSearchTerm,
          currentPage,
          itemsPerPage
        );
        if (Array.isArray(response.data?.data)) {
          setClientData(response.data.data);
          setTotalItems(response.data.totalCount || 0);
          setIsLoading(false);
        } else {
          console.error("Unexpected response format:", response.data);
          toast.error("Failed to load client data: Invalid response format");
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching client data:", error);
        const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred.";
        toast.error(errorMessage);
        setIsLoading(false);
      }
    };
    fetchClientData();
  }, [statusFilter, searchTerm, currentPage]);

   if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-white">Loading Trainer Managment page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-black text-white">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header />
        <main className="flex-1 px-6 py-8 overflow-y-auto">
          <StatsCard />
          <ClientsTable
            clientData={clientData}
            totalItems={totalItems}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            setCurrentPage={setCurrentPage}
            setStatusFilter={setStatusFilter}
            setSearchTerm={setSearchTerm}
            setClientData={setClientData}
          />
        </main>
        <footer className="px-6 py-4 bg-gray-900">
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