import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import ClientsTable, { IClient } from "../../components/admin/ClientManagment/ClientTable";
//
import { AdminService } from "@/services/implementation/adminServices";
import { toast } from "sonner";

const AClientManagment = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [clientData, setClientData] = useState<IClient[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [statusFilter, setStatusFilter] = useState<"active" | "blocked" | "all">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedValue, setDebouncedValue] = useState<string>(searchTerm);
  const itemsPerPage = 5;
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(searchTerm);
    }, 500);
    return () => {
      clearTimeout(timer);
    };
  }, [searchTerm]);
  useEffect(() => {
    const fetchClientData = async () => {
      try {
        // Sanitize searchTerm to prevent invalid values
        const sanitizedSearchTerm = debouncedValue.trim() === "%7D" || debouncedValue.trim() === "}" ? "" : debouncedValue.trim();
        const response = await AdminService.getAllClients(
          statusFilter,
          sanitizedSearchTerm,
          currentPage,
          itemsPerPage
        );
        if (Array.isArray(response.data?.data)) {
          setClientData(response.data.data);
          setTotalItems(response.data.totalCount || 0);
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
  }, [statusFilter, debouncedValue, currentPage]);

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
    <AdminLayout title="Client Management">
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
    </AdminLayout>
  );
};

export default AClientManagment;