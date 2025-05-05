import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { X } from "lucide-react";
import ClientActions from "./ClientActions";

interface Client {
  id: number;
  name: string;
  email: string;
  trainer: string;
  planStatus: string;
  sessionStatus: string;
  status: string;
}

const ClientsTable = () => {
  const [clients, setClients] = useState<Client[]>([
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah.j@example.com",
      trainer: "Jennifer Lee",
      planStatus: "Active",
      sessionStatus: "Purchased",
      status: "active",
    },
    {
      id: 2,
      name: "Michael Brown",
      email: "michael.b@example.com",
      trainer: "Robert Wilson",
      planStatus: "Active",
      sessionStatus: "Not Purchased",
      status: "active",
    },
    {
      id: 3,
      name: "Emily Davis",
      email: "emily.d@example.com",
      trainer: "Maria Rodriguez",
      planStatus: "Inactive",
      sessionStatus: "Not Purchased",
      status: "inactive",
    },
    {
      id: 4,
      name: "James Carter",
      email: "james.c@example.com",
      trainer: "James Carter",
      planStatus: "Active",
      sessionStatus: "Purchased",
      status: "active",
    },
    {
      id: 5,
      name: "Lisa Anderson",
      email: "lisa.a@example.com",
      trainer: "Maria Rodriguez",
      planStatus: "Active",
      sessionStatus: "Not Purchased",
      status: "active",
    },
    {
      id: 6,
      name: "David Miller",
      email: "david.m@example.com",
      trainer: "Robert Wilson",
      planStatus: "Inactive",
      sessionStatus: "Not Purchased",
      status: "inactive",
    },
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [modalClient, setModalClient] = useState<Client | null>(null);
  const itemsPerPage = 5;

  const filteredClients = clients.filter((client) => {
    const matchesStatus =
      statusFilter === "all" || client.status === statusFilter;
    const matchesSearch =
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
  const paginatedClients = filteredClients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleStatusChange = (clientId: number, newStatus: string) => {
    setClients((prev) =>
      prev.map((client) =>
        client.id === clientId
          ? { ...client, status: newStatus, planStatus: newStatus === "active" ? "Active" : "Inactive" }
          : client
      )
    );
  };

  const handleFilterClick = () => {
    alert("Filter options would appear here (e.g., by trainer, session status, etc.)");
  };

  const handleExportClick = () => {
    alert("Exporting visible client data to CSV...");
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  return (
    <>
      <div className="mb-8">
        <ClientActions
          onFilterClick={handleFilterClick}
          onExportClick={handleExportClick}
          onStatusChange={handleStatusFilterChange}
        />
        <Card className="bg-gray-800 rounded-lg overflow-hidden border-none">
          <Table className="border-none">
            <TableHeader>
              <TableRow className="bg-gray-900 hover:bg-gray-900 border-none">
                <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider border-none">Client</TableHead>
                <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider border-none">Email</TableHead>
                <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider border-none">Assigned Trainer</TableHead>
                <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider border-none">Plan Status</TableHead>
                <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider border-none">One-to-One Sessions</TableHead>
                <TableHead className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider border-none">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedClients.map((client) => (
                <TableRow key={client.id} className="bg-gray-800 hover:bg-gray-700 border-none">
                  <TableCell className="px-6 py-4 whitespace-nowrap border-none">
                    <div className="flex items-center">
                      <img
                        className="h-10 w-10 rounded-full"
                        src="https://via.placeholder.com/40"
                        alt={client.name}
                      />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-white">{client.name}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 border-none">{client.email}</TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-white border-none">{client.trainer}</TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap border-none">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        client.planStatus === "Active"
                          ? "bg-green-200 text-green-800"
                          : "bg-red-200 text-red-800"
                      }`}
                    >
                      {client.planStatus}
                    </span>
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap border-none">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        client.sessionStatus === "Purchased"
                          ? "bg-green-200 text-green-800"
                          : "bg-gray-200 text-gray-800"
                      }`}
                    >
                      {client.sessionStatus}
                    </span>
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium border-none">
                    <Button
                      className="text-indigo-400 hover:text-indigo-300 mr-3 transition-colors"
                      variant="ghost"
                      onClick={() => setModalClient(client)}
                    >
                      View
                    </Button>
                    <Button
                      className={
                        client.status === "active"
                          ? "text-red-400 hover:text-red-300 transition-colors"
                          : "text-green-400 hover:text-green-300 transition-colors"
                      }
                      variant="ghost"
                      onClick={() =>
                        handleStatusChange(
                          client.id,
                          client.status === "active" ? "inactive" : "active"
                        )
                      }
                    >
                      {client.status === "active" ? "Deactivate" : "Activate"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
        <div className="flex justify-between items-center px-6 py-4 bg-gray-800">
          <div className="text-sm text-gray-400">
            Showing {(currentPage - 1) * itemsPerPage + 1}-
            {Math.min(currentPage * itemsPerPage, filteredClients.length)} of{" "}
            {filteredClients.length} clients
          </div>
          <div className="flex space-x-2">
            <Button
              className="px-3 py-1 bg-gray-700 text-white rounded-md hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              Previous
            </Button>
            <div className="flex space-x-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === page
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "bg-gray-700 text-white hover:bg-gray-600"
                  }`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              ))}
            </div>
            <Button
              className="px-3 py-1 bg-gray-700 text-white rounded-md hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      {modalClient && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={() => setModalClient(null)} />
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-800 rounded-lg p-6 z-100 w-11/12 max-w-[600px] max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-white">Client Details</h3>
              <Button
                className="text-gray-400 hover:text-white focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                variant="ghost"
                onClick={() => setModalClient(null)}
              >
                <X className="w-6 h-6" />
              </Button>
            </div>
            <div className="space-y-6">
              <div className="flex items-center">
                <img
                  className="h-16 w-16 rounded-full mr-4"
                  src="https://via.placeholder.com/40"
                  alt={modalClient.name}
                />
                <div>
                  <p className="text-xl font-bold text-white">{modalClient.name}</p>
                  <p className="text-sm text-gray-400">{modalClient.email}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-400">Assigned Trainer</p>
                <p className="text-white">{modalClient.trainer}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Plan Status</p>
                <p className="text-white">{modalClient.planStatus}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">One-to-One Sessions</p>
                <p className="text-white">{modalClient.sessionStatus}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Access Type</p>
                <p className="text-white">
                  {modalClient.sessionStatus === "Purchased"
                    ? "One-to-One + Workout API"
                    : "Workout API"}
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ClientsTable;