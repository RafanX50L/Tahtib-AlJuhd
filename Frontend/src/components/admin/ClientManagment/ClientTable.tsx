import { JSX, useState } from "react";
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
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { X } from "lucide-react";
import ClientActions from "./ClientActions";
import { Types } from "mongoose";
import { AdminService } from "@/services/implementation/adminServices";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

// export interface IClientPersonalizationData {
//   trainer: string;
//   planStatus: "Active" | "Inactive";
//   sessionStatus: "Purchased" | "Not Purchased";
//   userData: {
//     profilePicture: string;
//   };
// }

// export interface IPersonalization {
//   _id: Types.ObjectId;
//   userId: Types.ObjectId;
//   role: "client" | "trainer" | "admin";
//   data: IClientPersonalizationData;
//   createdAt: Date;
//   updatedAt: Date;
//   __v: number;
// }

export interface IClient {
  _id: string;
  name: string;
  email: string;
  isBlocked: boolean;
  role: "client";
  createdAt: Date;
  profilePicture: string;
  trainer: string,
  planStatus: string,
  sessionStatus: string,
}

interface ClientsTableProps {
  clientData: IClient[];
  totalItems: number;
  currentPage: number;
  itemsPerPage: number;
  setCurrentPage: (page: number) => void;
  setStatusFilter: React.Dispatch<React.SetStateAction<"active" | "blocked" | "all">>;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  setClientData: React.Dispatch<React.SetStateAction<IClient[]>>;
}

const ClientsTable: React.FC<ClientsTableProps> = ({
  clientData,
  totalItems,
  currentPage,
  itemsPerPage,
  setCurrentPage,
  setStatusFilter,
  setSearchTerm,
  setClientData,
}) => {
  const [modalClient, setModalClient] = useState<IClient | null>(null);
  const [searchInput, setSearchInput] = useState(""); // Controlled input state
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handleStatusChange = async (clientId: string, isBlocked: boolean) => {
    try {
      await AdminService.blockOrUnblockUser(clientId);
      toast.success(
        `Client ${isBlocked ? "unblocked" : "blocked"} successfully`
      );
      // Update modalClient locally if open
      setModalClient((prev) =>
        prev && prev._id.toString() === clientId
          ? { ...prev, isBlocked: !isBlocked }
          : prev
      );
      // Update clientData locally
      setClientData((prev) =>
        prev.map((client) =>
          client._id.toString() === clientId
            ? { ...client, isBlocked: !isBlocked }
            : client
        )
      );
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

  const handleStatusFilterChange = (value: string) => {
    console.log("Status filter changed to:", value); // Debug log
    setStatusFilter(value as "active" | "blocked" | "all");
    setCurrentPage(1); // Reset to first page
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    console.log("Search input changed to:", JSON.stringify(value)); // Debug log
    setSearchInput(value);
    // Prevent sending %7D or }
    const sanitizedValue = value === "%7D" || value === "}" ? "" : value;
    setSearchTerm(sanitizedValue);
    setCurrentPage(1); // Reset to first page
  };

  const getStatusStyle = (isBlocked: boolean) => {
    return isBlocked
      ? "bg-red-200 text-red-800"
      : "bg-green-200 text-green-800";
  };

  // Generate pagination items (show up to 5 pages, with ellipsis if needed)
  const getPaginationItems = () => {
    const items: JSX.Element[] = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    // Adjust startPage if endPage is at the totalPages limit
    if (endPage === totalPages) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    // Add Previous button
    items.push(
      <PaginationItem key="previous">
        <PaginationPrevious
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
        />
      </PaginationItem>
    );

    // Add first page and ellipsis if needed
    if (startPage > 1) {
      items.push(
        <PaginationItem key="page-1">
          <PaginationLink
            onClick={() => setCurrentPage(1)}
            isActive={currentPage === 1}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );
      if (startPage > 2) {
        items.push(
          <PaginationItem key="ellipsis-start">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
    }

    // Add page numbers
    for (let page = startPage; page <= endPage; page++) {
      items.push(
        <PaginationItem key={`page-${page}`}>
          <PaginationLink
            onClick={() => setCurrentPage(page)}
            isActive={currentPage === page}
          >
            {page}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Add ellipsis and last page if needed
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        items.push(
          <PaginationItem key="ellipsis-end">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
      items.push(
        <PaginationItem key={`page-${totalPages}`}>
          <PaginationLink
            onClick={() => setCurrentPage(totalPages)}
            isActive={currentPage === totalPages}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Add Next button
    items.push(
      <PaginationItem key="next">
        <PaginationNext
          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
        />
      </PaginationItem>
    );

    return items;
  };

  return (
    <div className="mb-8">
      <ClientActions
        onFilterClick={handleFilterClick}
        onExportClick={handleExportClick}
        onStatusChange={handleStatusFilterChange}
      />
      <Card className="bg-gray-800 rounded-lg overflow-hidden border-none">
        <div className="p-4">
          <Input
            type="text"
            placeholder="Search clients..."
            className="bg-gray-700 text-white border-gray-600 mb-4"
            value={searchInput}
            onChange={handleSearchChange}
          />
          {clientData.length === 0 ? (
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
                  {/* <TableHead className="text-gray-400">Sessions</TableHead> */}
                  <TableHead className="text-gray-400">
                    Account Status
                  </TableHead>
                  <TableHead className="text-right text-gray-400">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clientData.map((client) => (
                  <TableRow
                    key={client._id}
                    className="bg-gray-800 hover:bg-gray-700"
                  >
                    <TableCell>
                      <div className="flex items-center">
                        {client.profilePicture ? (
                          <img
                            className="h-10 w-10 rounded-full"
                            src={
                              client.profilePicture
                            }
                            alt={client.name}
                          />
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
                      {client.trainer || "None"}
                    </TableCell>
                    <TableCell className="text-white">
                      {client.planStatus || "None"}
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
                            client._id,
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

      {totalItems > 0 && (
        <div className="mt-4">
          <div className="text-sm text-gray-400 mb-2">
            Showing {(currentPage - 1) * itemsPerPage + 1}–
            {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}{" "}
            clients
          </div>
          <Pagination>
            <PaginationContent>{getPaginationItems()}</PaginationContent>
          </Pagination>
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
                {modalClient.profilePicture ? (
                  <img
                    className="h-16 w-16 rounded-full mr-4"
                    src={
                      modalClient.profilePicture
                    }
                    alt={modalClient.name}
                  />
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
                    {modalClient.trainer || "None"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Plan Status</p>
                  <p className="text-white">
                    {modalClient.planStatus}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">One-to-One Sessions</p>
                  <p className="text-white">
                    {modalClient.sessionStatus}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Access Type</p>
                  <p className="text-white">
                    {modalClient.sessionStatus ===
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