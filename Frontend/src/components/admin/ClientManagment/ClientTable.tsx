import { SetStateAction, useState } from "react";
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
import { Types } from "mongoose";
import { AdminService } from "@/services/implementation/adminServices";
import { toast } from "sonner";

export interface IClientPersonalizationData {
  trainer: string;
  planStatus: "Active" | "Inactive";
  sessionStatus: "Purchased" | "Not Purchased";
  user_data: {
    profilePicture: string;
  };
}

export interface IPersonalization {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  role: "client" | "trainer" | "admin";
  data: IClientPersonalizationData;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

export interface IClient {
  _id: Types.ObjectId;
  name: string;
  email: string;
  isBlocked: boolean;
  role: "client" | "trainer" | "admin";
  createdAt: Date;
  updatedAt: Date;
  __v: number;
  personalization: IPersonalization;
}

interface ClientsTableProps {
  clientData: IClient[];
  setRefetch: React.Dispatch<SetStateAction<boolean>>;
}

const ClientsTable: React.FC<ClientsTableProps> = ({
  clientData,
  setRefetch,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalClient, setModalClient] = useState<IClient | null>(null);
  const itemsPerPage = 5;

  // Filter clients based on search term
  const filteredClients = clientData.filter(
    (client) =>
      (client.name && typeof client.name === "string"
        ? client.name.toLowerCase().includes(searchTerm.toLowerCase())
        : false) ||
      (client.email && typeof client.email === "string"
        ? client.email.toLowerCase().includes(searchTerm.toLowerCase())
        : false)
  );
  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
  const paginatedClients = filteredClients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleStatusChange = async (clientId: string, isBlocked: boolean) => {
    try {
      await AdminService.blockOrUnblockUser(clientId);
      toast.success(
        `Client ${isBlocked ? "unblocked" : "blocked"} successfully`
      );
      setRefetch((prev) => !prev);
    } catch (error) {
      console.error("Error updating user status:", error);
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      toast.error(errorMessage);
    }
  };

  const handleFilterClick = () => {
    alert("Filter options would appear here");
  };

  const handleExportClick = () => {
    alert("Exporting visible client data to CSV...");
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  const handleStatusFilterChange = (value: string) => {
    // Implement status filter logic if needed
    console.log("Selected status filter:", value);
  };

  const getStatusStyle = (isBlocked: boolean) => {
    return isBlocked
      ? "bg-red-200 text-red-800"
      : "bg-green-200 text-green-800";
  };

  return (
    <div className="mb-8">
      {/* <ClientActions
        onFilterClick={handleFilterClick}
        onExportClick={handleExportClick}
        onStatusChange={handleStatusFilterChange}
      /> */}
      <Card className="bg-gray-800 rounded-lg overflow-hidden border-none">
        <div className="p-4">
          <input
            type="text"
            placeholder="Search clients..."
            className="px-4 py-2 bg-gray-700 text-white rounded-md w-full mb-4"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          {filteredClients.length === 0 ? (
            <p className="text-gray-400 text-center">No clients found.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-900 hover:bg-gray-900">
                  <TableHead className="text-gray-400">Client</TableHead>
                  <TableHead className="text-gray-400">Email</TableHead>
                  <TableHead className="text-gray-400">
                    Assigned Trainer
                  </TableHead>
                  <TableHead className="text-gray-400">Plan Status</TableHead>
                  <TableHead className="text-gray-400">Sessions</TableHead>
                  <TableHead className="text-gray-400">
                    Account Status
                  </TableHead>
                  <TableHead className="text-right text-gray-400">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedClients.map((client) => (
                  <TableRow
                    key={client._id.toString()}
                    className="bg-gray-800 hover:bg-gray-700"
                  >
                    <TableCell>
                      <div className="flex items-center">
                        {client.personalization.data.user_data
                          .profilePicture ? (
                          <>
                            <img
                              className="h-10 w-10 rounded-full"
                              src={
                                client.personalization.data.user_data
                                  .profilePicture
                              }
                              alt={client.name}
                            />
                          </>
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-medium uppercase">
                            {client.name.charAt(0)}
                          </div>
                        )}

                        <div className="ml-4">
                          <div className="text-sm font-medium text-white">
                            {client.name || "Unknown"}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-400">
                      {client.email}
                    </TableCell>
                    <TableCell className="text-white">
                      {client.personalization.data.trainer || "None"}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          client.personalization.data.planStatus === "Active"
                            ? "bg-green-200 text-green-800"
                            : "bg-red-200 text-red-800"
                        }`}
                      >
                        {client.personalization.data.planStatus}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          client.personalization.data.sessionStatus ===
                          "Purchased"
                            ? "bg-green-200 text-green-800"
                            : "bg-gray-200 text-gray-800"
                        }`}
                      >
                        {client.personalization.data.sessionStatus}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusStyle(client.isBlocked)}`}
                      >
                        {client.isBlocked ? "Blocked" : "Active"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        className="text-indigo-400 hover:text-indigo-300 mr-2"
                        onClick={() => setModalClient(client)}
                      >
                        View
                      </Button>
                      <Button
                        variant="ghost"
                        className={
                          client.isBlocked
                            ? "text-green-400 hover:text-green-300"
                            : "text-red-400 hover:text-red-300"
                        }
                        onClick={() =>
                          handleStatusChange(
                            client._id.toString(),
                            client.isBlocked
                          )
                        }
                      >
                        {client.isBlocked ? "Unblock" : "Block"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </Card>

      {/* Pagination */}
      {filteredClients.length > 0 && (
        <div className="flex justify-between mt-5 items-center px-6 py-4 bg-gray-800 rounded-lg">
          <div className="text-sm text-gray-400">
            Showing {(currentPage - 1) * itemsPerPage + 1}-
            {Math.min(currentPage * itemsPerPage, filteredClients.length)} of{" "}
            {filteredClients.length} clients
          </div>
          <div className="flex space-x-2">
            <Button
              className="px-3 py-1 bg-gray-700 text-white rounded-md hover:bg-gray-600 disabled:opacity-50"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              Previous
            </Button>
            <div className="flex space-x-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <Button
                    key={page}
                    className={`px-3 py-1 rounded-md ${
                      currentPage === page
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-700 text-white hover:bg-gray-600"
                    }`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                )
              )}
            </div>
            <Button
              className="px-3 py-1 bg-gray-700 text-white rounded-md hover:bg-gray-600 disabled:opacity-50"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Client Details Modal */}
      {modalClient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-gray-800 rounded-lg p-6 w-11/12 max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-white">Client Details</h3>
              <Button
                variant="ghost"
                className="text-gray-400 hover:text-white"
                onClick={() => setModalClient(null)}
              >
                <X className="w-6 h-6" />
              </Button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center">
                {modalClient.personalization.data.user_data.profilePicture ? (
                  <>
                    <img
                      className="h-16 w-16 rounded-full mr-4"
                      src={
                        modalClient.personalization.data.user_data
                          .profilePicture
                      }
                      alt={modalClient.name}
                    />
                  </>
                ) : (
                  <div className="h-16 w-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-medium uppercase mr-4">
                    {modalClient.name.charAt(0)}
                  </div>
                )}

                <div>
                  <p className="text-xl font-bold text-white">
                    {modalClient.name || "Unknown"}
                  </p>
                  <p className="text-sm text-gray-400">{modalClient.email}</p>
                  <p className="text-sm">
                    Status:{" "}
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusStyle(modalClient.isBlocked)}`}
                    >
                      {modalClient.isBlocked ? "Blocked" : "Active"}
                    </span>
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Assigned Trainer</p>
                  <p className="text-white">
                    {modalClient.personalization.data.trainer || "None"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Plan Status</p>
                  <p className="text-white">
                    {modalClient.personalization.data.planStatus}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">One-to-One Sessions</p>
                  <p className="text-white">
                    {modalClient.personalization.data.sessionStatus}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Access Type</p>
                  <p className="text-white">
                    {modalClient.personalization.data.sessionStatus ===
                    "Purchased"
                      ? "One-to-One + Workout API"
                      : "Workout API"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Created At</p>
                  <p className="text-white">
                    {new Date(modalClient.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientsTable;
