import { useEffect, useState } from "react";
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
import { toast } from "sonner";
import { ITrainerWithPersonalization } from "@/pages/admin/ATrainerManagment";
import { AdminService } from "@/services/implementation/adminServices";

const ApprovedTrainersTable = () => {
  const [trainers, setTrainers] = useState<ITrainerWithPersonalization[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTrainer, setSelectedTrainer] =
    useState<ITrainerWithPersonalization | null>(null);
  const [confirmAction, setConfirmAction] = useState({
    trainerId: "",
    isOpen: false,
    willBlock: false,
  });

  const itemsPerPage = 5;

  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const response = await AdminService.getApprovedTrainers(currentPage);
        console.log("approved trainers", response);
        setTrainers(Array.isArray(response) ? response : []);
      } catch (error) {
        toast.error("Failed to fetch trainers");
        console.error(error);
      }
    };

    fetchTrainers();
  }, [currentPage]);

  const filteredTrainers = trainers.filter(
    (trainer) =>
      trainer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trainer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedTrainers = filteredTrainers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredTrainers.length / itemsPerPage);

  const toggleBlockStatus = async (
    trainerId: string,
    currentBlockStatus: boolean
  ) => {
    try {
      // Here you would typically call an API to update the block status
      await AdminService.blockOrUnblockUser(trainerId);
      setTrainers((prev) =>
        prev.map((trainer) =>
          trainer._id === trainerId
            ? { ...trainer, isBlocked: !currentBlockStatus }
            : trainer
        )
      );
      toast.success(
        `Trainer ${currentBlockStatus ? "unblocked" : "blocked"} successfully`
      );
    } catch (error) {
      toast.error("Failed to update trainer status");
      console.error(error);
    } finally {
      setConfirmAction({ trainerId: "", isOpen: false, willBlock: false });
    }
  };

  const getBlockStatusStyle = (isBlocked: boolean) => {
    return isBlocked
      ? "text-red-400 bg-red-200/20"
      : "text-green-400 bg-green-200/20";
  };

  const getExpertiseStyle = (level?: string) => {
    switch (level) {
      case "advanced":
        return "text-blue-400 bg-blue-200/20";
      case "intermediate":
        return "text-purple-400 bg-purple-200/20";
      case "beginner":
        return "text-orange-400 bg-orange-200/20";
      default:
        return "text-gray-400 bg-gray-200/20";
    }
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Approved Trainers</h2>
      </div>

      <Card className="bg-gray-800 rounded-lg overflow-hidden border-none">
        <div className="p-4">
          <input
            type="text"
            placeholder="Search trainers..."
            className="px-4 py-2 bg-gray-700 text-white rounded-md w-full mb-4"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <Table>
            <TableHeader>
              <TableRow className="bg-gray-900 hover:bg-gray-900">
                <TableHead className="text-gray-400">Name</TableHead>
                <TableHead className="text-gray-400">Email</TableHead>
                <TableHead className="text-gray-400">Specialty</TableHead>
                <TableHead className="text-gray-400">Experience</TableHead>
                <TableHead className="text-gray-400">Status</TableHead>
                <TableHead className="text-gray-400">Weekly Salary</TableHead>
                <TableHead className="text-right text-gray-400">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {paginatedTrainers.map((trainer) => (
                <TableRow
                  key={trainer._id}
                  className="bg-gray-800 hover:bg-gray-700"
                >
                  <TableCell className="text-white">
                    <div className="flex items-center space-x-3">
                      {trainer.basicInfo.profilePhoto ? (
                        <>
                          {" "}
                          <img
                            className="h-10 w-10 rounded-full"
                            src={trainer.basicInfo.profilePhoto}
                            alt={trainer.name}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = "none";
                              const avatarDiv =
                                target.previousElementSibling as HTMLDivElement;
                              avatarDiv.classList.remove("opacity-0");
                            }}
                          />
                        </>
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-medium uppercase">
                          {trainer.name?.charAt(0)}
                        </div>
                      )}

                      <span className="text-sm font-medium mr-1">
                        {trainer.name}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="text-gray-400">
                    {trainer.email}
                  </TableCell>
                  <TableCell className="text-gray-400">
                    {trainer.professionalSummary?.specializations?.join(", ") ||
                      "N/A"}
                  </TableCell>
                  <TableCell className="text-gray-400">
                    {trainer.professionalSummary?.yearsOfExperience || "N/A"}{" "}
                    years
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getBlockStatusStyle(trainer.isBlocked)}`}
                    >
                      {trainer.isBlocked ? "Blocked" : "Active"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-green-500">
                      {trainer.basicInfo.weeklySalary || "N/A"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      className="text-indigo-400 hover:text-indigo-300 mr-2"
                      onClick={() => setSelectedTrainer(trainer)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      className={
                        trainer.isBlocked
                          ? "text-green-400 hover:text-green-300"
                          : "text-red-400 hover:text-red-300"
                      }
                      onClick={() =>
                        setConfirmAction({
                          trainerId: trainer._id,
                          isOpen: true,
                          willBlock: !trainer.isBlocked,
                        })
                      }
                    >
                      {trainer.isBlocked ? (
                        <PlayCircle className="w-4 h-4" />
                      ) : (
                        <PauseCircle className="w-4 h-4" />
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Pagination */}
      <div className="flex justify-between mt-5 items-center px-6 py-4 bg-gray-800 rounded-lg">
        <div className="text-sm text-gray-400">
          Showing {(currentPage - 1) * itemsPerPage + 1}-
          {Math.min(currentPage * itemsPerPage, filteredTrainers.length)} of{" "}
          {filteredTrainers.length} trainers
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
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
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
            ))}
          </div>
          <Button
            className="px-3 py-1 bg-gray-700 text-white rounded-md hover:bg-gray-600 disabled:opacity-50"
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Trainer Details Modal */}
      {selectedTrainer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-gray-800 rounded-lg p-6 w-11/12 max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-white">
                Trainer Details
              </h3>
              <Button
                variant="ghost"
                className="text-gray-400 hover:text-white"
                onClick={() => setSelectedTrainer(null)}
              >
                <X className="w-6 h-6" />
              </Button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center">
                <img
                  className="h-16 w-16 rounded-full mr-4"
                  src={
                    selectedTrainer.basicInfo?.profilePhoto ||
                    "https://via.placeholder.com/40"
                  }
                  alt={selectedTrainer.name}
                />
                <div>
                  <p className="text-xl font-bold text-white">
                    {selectedTrainer.name}
                  </p>
                  <p className="text-sm text-gray-400">
                    {selectedTrainer.email}
                  </p>
                  <p className="text-sm text-gray-400">
                    Status:{" "}
                    <span
                      className={getBlockStatusStyle(selectedTrainer.isBlocked)}
                    >
                      {selectedTrainer.isBlocked ? "Blocked" : "Active"}
                    </span>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Phone</p>
                  <p className="text-white">
                    {selectedTrainer.basicInfo?.phoneNumber || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Location</p>
                  <p className="text-white">
                    {selectedTrainer.basicInfo?.location || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Experience</p>
                  <p className="text-white">
                    {selectedTrainer.professionalSummary?.yearsOfExperience ||
                      "N/A"}{" "}
                    years
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Specializations</p>
                  <p className="text-white">
                    {selectedTrainer.professionalSummary?.specializations?.join(
                      ", "
                    ) || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Certifications</p>
                  <p className="text-white">
                    {selectedTrainer.professionalSummary?.certifications
                      ?.map((c) => c.name)
                      .join(", ") || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmAction.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-gray-800 rounded-lg p-6 w-11/12 max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-white">Confirm Action</h3>
              <Button
                variant="ghost"
                className="text-gray-400 hover:text-white"
                onClick={() =>
                  setConfirmAction({
                    trainerId: "",
                    isOpen: false,
                    willBlock: false,
                  })
                }
              >
                <X className="w-6 h-6" />
              </Button>
            </div>

            <p className="text-sm text-gray-300 mb-6">
              Are you sure you want to{" "}
              {confirmAction.willBlock ? "block" : "unblock"} this trainer?
            </p>

            <div className="flex justify-end space-x-3">
              <Button
                className="px-4 py-2 bg-gray-600 text-white hover:bg-gray-500"
                onClick={() =>
                  setConfirmAction({
                    trainerId: "",
                    isOpen: false,
                    willBlock: false,
                  })
                }
              >
                Cancel
              </Button>
              <Button
                className={`px-4 py-2 text-white ${
                  confirmAction.willBlock
                    ? "bg-red-600 hover:bg-red-500"
                    : "bg-green-600 hover:bg-green-500"
                }`}
                onClick={() =>
                  toggleBlockStatus(
                    confirmAction.trainerId,
                    !confirmAction.willBlock
                  )
                }
              >
                {confirmAction.willBlock ? "Block Trainer" : "Unblock Trainer"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApprovedTrainersTable;
