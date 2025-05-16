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
import { Eye, PlayCircle, PauseCircle, X } from "lucide-react";
import TrainerActions from "./TrainerActions";
import { toast } from "sonner";
import { ITrainerWithPersonalization } from "@/pages/admin/ATrainerManagment";

interface Props {
  trainer: ITrainerWithPersonalization[];
}

const ApprovedTrainersTable: React.FC<Props> = ({ trainer }) => {
  const [trainers, setTrainers] = useState(trainer);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [modalTrainer, setModalTrainer] = useState<ITrainerWithPersonalization | null>(null);
  const [confirmModal, setConfirmModal] = useState<{
    trainerId: string;
    status: string;
    isOpen: boolean;
  }>({ trainerId: "", status: "", isOpen: false });
  const itemsPerPage = 5;

  const filteredTrainers = trainers.filter((trainer) => {
    const matchesStatus =
      statusFilter === "all" || trainer.status === statusFilter;
    const matchesSearch =
      trainer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trainer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trainer.personalization?.data.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const totalPages = Math.ceil(filteredTrainers.length / itemsPerPage);
  const paginatedTrainers = filteredTrainers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleStatusChange = (trainerId: string, status: string) => {
    setConfirmModal({ trainerId, status, isOpen: true });
  };

  const confirmStatusChange = () => {
    try {
      const { trainerId, status } = confirmModal;
      const newStatus = status === "active" ? "inactive" : "active";
      setTrainers((prev) =>
        prev.map((t) =>
          t.id === trainerId ? { ...t, status: newStatus } : t
        )
      );
      toast.success(`Trainer ${newStatus === "active" ? "activated" : "deactivated"} successfully`);
    } catch (error) {
      console.error("Error updating trainer status:", error);
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      toast.error(errorMessage);
    } finally {
      setConfirmModal({ trainerId: "", status: "", isOpen: false });
    }
  };

  const handleFilterClick = () => {
    alert("Filter functionality to be implemented");
  };

  const handleExportClick = () => {
    alert("Exporting visible trainer data to CSV...");
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
        <TrainerActions
          onFilterClick={handleFilterClick}
          onExportClick={handleExportClick}
          onStatusChange={handleStatusFilterChange}
        />
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Approved Trainers</h2>
        </div>
        <Card className="bg-gray-800 rounded-lg overflow-hidden border-none">
          <div>
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Search trainers..."
                className="px-4 py-2 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            <Table className="border-none">
              <TableHeader>
                <TableRow className="bg-gray-900 hover:bg-gray-900 border-none">
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider border-none">
                    Name
                  </TableHead>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider border-none">
                    Email
                  </TableHead>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider border-none">
                    Specialty
                  </TableHead>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider border-none">
                    Experience
                  </TableHead>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider border-none">
                    Monthly Fee
                  </TableHead>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider border-none">
                    Status
                  </TableHead>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider border-none">
                    Expertise Level
                  </TableHead>
                  <TableHead className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider border-none">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedTrainers.map((trainer) => {
                  const statusClass =
                    trainer.status === "active"
                      ? "text-green-400 bg-green-200/20"
                      : "text-gray-400 bg-gray-200/20";
                  const statusText = trainer.status;
                  let expertiseClass, expertiseText;
                  switch (trainer.personalization?.data.expertiseLevel) {
                    case "advanced":
                      expertiseClass = "text-blue-400 bg-blue-200/20";
                      expertiseText = "Advanced";
                      break;
                    case "intermediate":
                      expertiseClass = "text-purple-400 bg-purple-200/20";
                      expertiseText = "Intermediate";
                      break;
                    case "beginner":
                      expertiseClass = "text-orange-400 bg-orange-200/20";
                      expertiseText = "Beginner";
                      break;
                    default:
                      expertiseClass = "text-gray-400 bg-gray-200/20";
                      expertiseText = "Unknown";
                  }

                  return (
                    <TableRow
                      key={trainer._id.toString()}
                      className="bg-gray-800 hover:bg-gray-700 border-none"
                    >
                      <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-white border-none">
                        {trainer.name}
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 border-none">
                        {trainer.email}
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 border-none">
                        {trainer.personalization?.data.specialty || "N/A"}
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 border-none">
                        {trainer.personalization?.data.experience || "N/A"}
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-indigo-400 font-medium border-none">
                        {trainer.personalization?.data.monthlyFee || "N/A"}
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap text-sm border-none">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClass}`}
                        >
                          {statusText}
                        </span>
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap text-sm border-none">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${expertiseClass}`}
                        >
                          {expertiseText}
                        </span>
                      </TableCell>
                      <TableCell className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium border-none">
                        <Button
                          className="text-indigo-400 hover:text-indigo-300 mr-3 transition-colors"
                          variant="ghost"
                          onClick={() => setModalTrainer(trainer)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          className={
                            trainer.status === "active"
                              ? "text-red-400 hover:text-red-300 transition-colors"
                              : "text-green-400 hover:text-green-300 transition-colors"
                          }
                          variant="ghost"
                          onClick={() =>
                            handleStatusChange(trainer.id, trainer.status)
                          }
                        >
                          {trainer.status === "active" ? (
                            <PauseCircle className="w-4 h-4" />
                          ) : (
                            <PlayCircle className="w-4 h-4" />
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </Card>
        <div className="flex justify-between mt-5 items-center px-6 py-4 bg-gray-800 rounded-lg">
          <div className="text-sm text-gray-400">
            Showing {(currentPage - 1) * itemsPerPage + 1}-
            {Math.min(currentPage * itemsPerPage, filteredTrainers.length)} of{" "}
            {filteredTrainers.length} trainers
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

      {modalTrainer && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
            onClick={() => setModalTrainer(null)}
          />
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-800 rounded-lg p-6 z-100 w-11/12 max-w-[600px] max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-white">Trainer Details</h3>
              <Button
                className="text-gray-400 hover:text-white focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                variant="ghost"
                onClick={() => setModalTrainer(null)}
              >
                <X className="w-6 h-6" />
              </Button>
            </div>
            <div className="space-y-6">
              <div className="flex items-center">
                <img
                  className="h-16 w-16 rounded-full mr-4"
                  src="https://via.placeholder.com/40"
                  alt={modalTrainer.name}
                />
                <div>
                  <p className="text-xl font-bold text-white">{modalTrainer.name}</p>
                  <p className="text-sm text-gray-400">{modalTrainer.email}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-400">Specialization</p>
                <p className="text-white">{modalTrainer.personalization?.data.specialty || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Experience</p>
                <p className="text-white">{modalTrainer.personalization?.data.experience || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Monthly Fee</p>
                <p className="text-white">{modalTrainer.personalization?.data.monthlyFee || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Status</p>
                <p className="text-white">{modalTrainer.status}</p>
              </div>
            </div>
          </div>
        </>
      )}

      {confirmModal.isOpen && (
        <>
Ordinal Code Format
          <div
            className="fixed inset-0  bg-opacity-50 z-50"
            onClick={() => setConfirmModal({ trainerId: "", status: "", isOpen: false })}
          />
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-800 rounded-lg p-6 z-100 w-11/12 max-w-md shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-white">Confirm Action</h3>
              <Button
                className="text-gray-400 hover:text-white focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                variant="ghost"
                onClick={() => setConfirmModal({ trainerId: "", status: "", isOpen: false })}
              >
                <X className="w-6 h-6" />
              </Button>
            </div>
            <p className="text-sm text-gray-300 mb-6">
              Are you sure you want to{" "}
              {confirmModal.status === "active" ? "deactivate" : "activate"} this trainer?
            </p>
            <div className="flex justify-end space-x-3">
              <Button
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500 transition-colors"
                onClick={() => setConfirmModal({ trainerId: "", status: "", isOpen: false })}
              >
                Cancel
              </Button>
              <Button
                className={`px-4 py-2 rounded-md text-white transition-colors ${
                  confirmModal.status === "active"
                    ? "bg-red-600 hover:bg-red-500"
                    : "bg-green-600 hover:bg-green-500"
                }`}
                onClick={confirmStatusChange}
              >
                {confirmModal.status === "active" ? "Deactivate" : "Activate"}
              </Button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ApprovedTrainersTable;