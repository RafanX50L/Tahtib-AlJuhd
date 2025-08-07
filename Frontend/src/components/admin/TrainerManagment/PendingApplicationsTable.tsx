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
import { AdminService } from "@/services/implementation/adminServices";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

type FeedbackData = z.infer<typeof feedbackSchema>;

// Define the ITrainerWithPersonalization interface based on the provided structure
interface ITrainerWithPersonalization {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  location: string;
  dateOfBirth: string;
  gender: string;
  timeZone: string;
  yearsOfExperience: number;
  certifications: Array<{ name: string; issuer: string; filePath: string }>;
  specializations: string[];
  coachingType: string[];
  platformsUsed: string[];
  demoVideoLink: string;
  portfolioLinks: string[];
  availability: {
    weeklySlots: Array<{ day: string; startTime: string; endTime: string }>;
    engagementType: string;
  };
  profilePhoto: string | null;
  resumeFile: string | null;
  status?: string; // Optional, as it's not in the provided data
  interviewDetails?: {
    startTime?: string;
    endTime?: string;
    roomId?: string;
    result?: FeedbackData;
  }; // Optional, as it's not in the provided data
}

const feedbackSchema = z.object({
  communicationSkills: z.number().min(1, "Communication Skills is required"),
  technicalKnowledge: z.number().min(1, "Technical Knowledge is required"),
  coachingStyle: z.number().min(1, "Coaching Style is required"),
  confidencePresence: z.number().min(1, "Confidence/Presence is required"),
  brandAlignment: z.number().min(1, "Brand Alignment is required"),
  equipmentQuality: z.number().min(1, "Equipment Quality is required"),
  notes: z.string().min(1, "Notes are required"),
});

interface TrainerTableProps {
  applications: ITrainerWithPersonalization[];
  handleAction: (
    application: ITrainerWithPersonalization,
    action: string
  ) => void;
}

const ratingLabels: Record<number, string> = {
  1: "Poor",
  2: "Fair",
  3: "Average",
  4: "Impressive",
  5: "Excellent",
};

const TrainerTable: React.FC<TrainerTableProps> = ({
  applications,
  handleAction,
}) => {
  return (
    <Card className="bg-gray-800 rounded-lg overflow-hidden border-none">

      <Table className="border-none">
        <TableHeader>
          <TableRow className="bg-gray-900 hover:bg-gray-900 border-none">
            <TableHead className="text-gray-400">Trainer</TableHead>
            <TableHead className="text-gray-400">Specialization</TableHead>
            <TableHead className="text-gray-400">Experience</TableHead>
            <TableHead className="text-gray-400">Applied On</TableHead>
            <TableHead className="text-gray-400">Status</TableHead>
            <TableHead className="text-gray-400 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications.map((application) => {
            const status = application.status?.toLowerCase() || "applied"; // Default to "applied" if status is missing
            const profilePhoto = application.profilePhoto;

            let statusClass = "bg-purple-200 text-purple-800";
            let statusText = "Not Scheduled";

            if (status === "interviewed" || status === "interview completed") {
              statusClass = "bg-yellow-200 text-yellow-800";
              statusText = "Interview Completed";
            } else if (
              status === "interview_scheduled" ||
              status === "interview scheduled"
            ) {
              statusClass = "bg-green-200 text-green-800";
              statusText = "Interview Scheduled";
            }

            return (
              <TableRow
                key={application.id}
                className="bg-gray-800 hover:bg-gray-700"
              >
                <TableCell>
                  <div className="flex items-center">
                    <div className="relative">
                      {profilePhoto ? (
                        <img
                          className="h-10 w-10 rounded-full"
                          src={profilePhoto}
                          alt={application.name}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = "none";
                            const avatarDiv =
                              target.previousElementSibling as HTMLDivElement;
                            avatarDiv.classList.remove("opacity-0");
                          }}
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gray-600 flex items-center justify-center text-white text-sm font-medium uppercase">
                          {application.name?.charAt(0) || "N/A"}
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-white">
                        {application.name || "N/A"}
                      </div>
                      <div className="text-sm text-gray-400">
                        {application.email || "N/A"}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-white">
                  {application.specializations?.join(", ") || "N/A"}
                </TableCell>
                <TableCell className="text-white">
                  {application.yearsOfExperience || "N/A"} years
                </TableCell>
                <TableCell className="text-gray-400">
                  {application.dateOfBirth
                    ? new Date(application.dateOfBirth).toLocaleDateString()
                    : "N/A"}
                </TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${statusClass}`}
                  >
                    {statusText}
                    {application.status === "interview_scheduled" &&
                      application.interviewDetails?.startTime && (
                        <span className="text-blue-600">
                          {new Date(
                            application.interviewDetails.startTime
                          ).toLocaleTimeString("en-US", {
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true,
                          })}
                        </span>
                      )}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end items-center space-x-2">
                    <Button
                      variant="ghost"
                      className="text-indigo-400 hover:text-indigo-300"
                      onClick={() => handleAction(application, "View Details")}
                    >
                      View
                    </Button>
                    {status === "interviewed" ? (
                      <>
                        <Button
                          variant="ghost"
                          className="text-indigo-400 hover:text-indigo-300"
                          onClick={() => handleAction(application, "Approve")}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="ghost"
                          className="text-red-400 hover:text-red-300"
                          onClick={() => handleAction(application, "Reject")}
                        >
                          Reject
                        </Button>
                      </>
                    ) : status === "interview_scheduled" &&
                      application.interviewDetails?.endTime &&
                      new Date(application.interviewDetails.endTime).getTime() <=
                        Date.now() ? (
                      <Button
                        variant="ghost"
                        className="text-indigo-400 hover:text-indigo-300"
                        onClick={() => handleAction(application, "Feedback")}
                      >
                        Feedback
                      </Button>
                    ) : status === "applied" ? (
                      <Button
                        variant="ghost"
                        className="text-indigo-400 hover:text-indigo-300"
                        onClick={() =>
                          handleAction(application, "Schedule Review")
                        }
                      >
                        Schedule
                      </Button>
                    ) : status === "interview_scheduled" ? (
                      <>
                        {application.interviewDetails?.startTime &&
                        new Date(
                          application.interviewDetails.startTime
                        ).getTime() <= Date.now() ? (
                          <Button
                            variant="ghost"
                            className="text-indigo-400 hover:text-indigo-300"
                            onClick={() =>
                              handleAction(application, "Join Room")
                            }
                          >
                            Meet Link
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            disabled
                            className="text-indigo-400 hover:text-indigo-300"
                          >
                            Meet Link
                          </Button>
                        )}
                      </>
                    ) : null}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Card>
  );
};

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="mb-4">
      <Input
        type="text"
        placeholder="Search trainers by name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="bg-gray-700 text-white border-gray-600"
      />
    </div>
  );
};

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  totalItems: number;
  itemsPerPage: number;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  setCurrentPage,
  totalItems,
  itemsPerPage,
}) => {
  return (
    <div className="flex justify-between items-center px-6 py-4 mt-4 bg-gray-800 rounded-lg">
      <div className="text-sm text-gray-400">
        Showing {(currentPage - 1) * itemsPerPage + 1}–
        {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}{" "}
        applications
      </div>
      <div className="flex space-x-2">
        <Button
          className="bg-gray-700 hover:bg-gray-600"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev: number) => prev - 1)}
        >
          Previous
        </Button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <Button
            key={page}
            className={
              currentPage === page
                ? "bg-indigo-600 text-white"
                : "bg-gray-700 hover:bg-gray-600"
            }
            onClick={() => setCurrentPage(page)}
          >
            {page}
          </Button>
        ))}
        <Button
          className="bg-gray-700 hover:bg-gray-600"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

const PendingApplicationsTable: React.FC = () => {
  const [applications, setApplications] = useState<
    ITrainerWithPersonalization[]
  >([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedApplication, setSelectedApplication] =
    useState<ITrainerWithPersonalization | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [scheduleDate, setScheduleDate] = useState<Date | undefined>(
    new Date()
  );
  const [scheduleTime, setScheduleTime] = useState("");
  const [weeklySalary, setWeeklySalary] = useState<number>(0);
  const itemsPerPage = 5;
  const limit = 5;
  const navigate = useNavigate();

  type FeedbackData = z.infer<typeof feedbackSchema>;

  const [feedbackData, setFeedbackData] = useState<FeedbackData>({
    communicationSkills: 0,
    technicalKnowledge: 0,
    coachingStyle: 0,
    confidencePresence: 0,
    brandAlignment: 0,
    equipmentQuality: 0,
    notes: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const trainers = await AdminService.getPendingTrainers(
          currentPage,
          limit,
          searchTerm
        );
        const trainerData = trainers.data?.data?.trainers || [];
        const totalCount = trainers.data?.data?.totalCount || 0;
        setApplications(trainerData);
        setTotalItems(totalCount);
      } catch (error) {
        console.error("Error fetching trainers:", error);
        toast.error("Failed to fetch trainers");
      }
    };
    fetchData();
  }, [currentPage, searchTerm]);

  const handleScheduleInterview = async (id: string) => {
    if (!scheduleDate || !scheduleTime) {
      toast.error("Please select both date and time");
      return;
    }
    try {
      await AdminService.scheduleInterview(id, {
        date: scheduleDate,
        time: scheduleTime,
      });
      setApplications((prev) =>
        prev.map((app) =>
          app.id === id
            ? {
                ...app,
                status: "interview_scheduled",
                interviewDetails: {
                  startTime: scheduleDate.toISOString(),
                  endTime: new Date(
                    scheduleDate.getTime() + 30 * 60 * 1000
                  ).toISOString(),
                  roomId: `room-${id}`,
                },
              }
            : app
        )
      );
      setIsScheduleModalOpen(false);
      toast.success("Interview scheduled successfully");
    } catch (error) {
      console.error("Error scheduling interview:", error);
      toast.error("Failed to schedule interview");
    }
  };

  const handleSubmitFeedback = async (id: string) => {
    const parseResult = feedbackSchema.safeParse(feedbackData);

    if (!parseResult.success) {
      const errorMessages = Object.values(
        parseResult.error.flatten().fieldErrors
      )
        .flat()
        .filter(Boolean);
      toast.error("Please fix the following:\n\n" + errorMessages.join("\n"));
      return;
    }

    try {
      await AdminService.submitInterviewFeedback(id, feedbackData);
      setApplications((prev) =>
        prev.map((app) =>
          app.id === id
            ? {
                ...app,
                status: "interviewed",
                interviewDetails: {
                  ...app.interviewDetails,
                  result: feedbackData,
                },
              }
            : app
        )
      );
      setIsFeedbackModalOpen(false);
      toast.success("Feedback submitted successfully");
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error("Failed to submit feedback");
    }
  };

  const handleApproval = async (id: string) => {
    try {
      if (weeklySalary < 500) {
        toast.error("Weekly salary must be at least 500");
        return;
      }
      await AdminService.approveTrainer(id, weeklySalary);
      setApplications((prev) => prev.filter((app) => app.id !== id));
      setTotalItems((prev) => prev - 1);
      setIsApprovalModalOpen(false);
      toast.success("Trainer approved successfully");
    } catch (error) {
      console.error("Error approving trainer:", error);
      toast.error("Failed to approve trainer");
    }
  };

  const handleReject = async (id: string) => {
    try {
      await AdminService.rejectTrainer(id);
      setApplications((prev) => prev.filter((app) => app.id !== id));
      setTotalItems((prev) => prev - 1);
      toast.success("Trainer rejected successfully");
    } catch (error) {
      console.error("Error rejecting trainer:", error);
      toast.error("Failed to reject trainer");
    }
  };

  const handleJoinRoom = (roomId: string) => {
    navigate(`/room/${roomId}`);
  };

  const handleAction = (
    application: ITrainerWithPersonalization,
    action: string
  ) => {
    setSelectedApplication(application);
    switch (action) {
      case "View Details":
        setIsDetailsModalOpen(true);
        break;
      case "Schedule Review":
        setIsScheduleModalOpen(true);
        break;
      case "Feedback":
        setIsFeedbackModalOpen(true);
        break;
      case "Approve":
        setIsApprovalModalOpen(true);
        break;
      case "Reject":
        handleReject(application.id);
        break;
      case "Join Room":
        handleJoinRoom(application.interviewDetails?.roomId || "");
        break;
      default:
        break;
    }
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedApplications = applications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="mb-8 mt-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">
          Pending Trainer Applications
        </h2>
      </div>

      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      {/* Details Modal */}
      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent className="max-w-4xl bg-gray-800 text-white border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white">Trainer Details</DialogTitle>
          </DialogHeader>
          {selectedApplication && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-indigo-400">
                  Basic Information
                </h3>
                <div className="space-y-2">
                  <div>
                    <Label className="text-gray-400">Name</Label>
                    <p className="text-white">{selectedApplication.name || "N/A"}</p>
                  </div>
                  <div>
                    <Label className="text-gray-400">Email</Label>
                    <p className="text-white">{selectedApplication.email || "N/A"}</p>
                  </div>
                  <div>
                    <Label className="text-gray-400">Phone</Label>
                    <p className="text-white">
                      {selectedApplication.phoneNumber || "N/A"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-gray-400">Location</Label>
                    <p className="text-white">
                      {selectedApplication.location || "N/A"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-gray-400">Gender</Label>
                    <p className="text-white">
                      {selectedApplication.gender || "N/A"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-gray-400">Date of Birth</Label>
                    <p className="text-white">
                      {selectedApplication.dateOfBirth
                        ? new Date(selectedApplication.dateOfBirth).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-gray-400">Time Zone</Label>
                    <p className="text-white">
                      {selectedApplication.timeZone || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-indigo-400">
                  Professional Summary
                </h3>
                <div className="space-y-2">
                  <div>
                    <Label className="text-gray-400">Experience</Label>
                    <p className="text-white">
                      {selectedApplication.yearsOfExperience || "N/A"} years
                    </p>
                  </div>
                  <div>
                    <Label className="text-gray-400">Specializations</Label>
                    <p className="text-white">
                      {selectedApplication.specializations?.join(", ") || "N/A"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-gray-400">Coaching Type</Label>
                    <p className="text-white">
                      {selectedApplication.coachingType?.join(", ") || "N/A"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-gray-400">Platforms Used</Label>
                    <p className="text-white">
                      {selectedApplication.platformsUsed?.join(", ") || "N/A"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-gray-400">Resume</Label>
                    {selectedApplication.resumeFile ? (
                      <a
                        href={selectedApplication.resumeFile}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-400 hover:underline"
                      >
                        View Resume
                      </a>
                    ) : (
                      <p className="text-white">N/A</p>
                    )}
                  </div>
                  <div>
                    <Label className="text-gray-400">Certifications</Label>
                    <div className="space-y-1">
                      {selectedApplication.certifications?.length ? (
                        selectedApplication.certifications.map((cert, index) => (
                          <div key={index} className="text-white">
                            <div>
                              {cert.name} ({cert.issuer})
                            </div>
                            <div>
                              <Label className="text-white">
                                Proof:{" "}
                                <span>
                                  {cert.filePath ? (
                                    <a
                                      href={cert.filePath}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-indigo-400 hover:underline"
                                    >
                                      View File
                                    </a>
                                  ) : (
                                    <p className="text-white">N/A</p>
                                  )}
                                </span>
                              </Label>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-white">N/A</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-indigo-400">
                  Sample Materials
                </h3>
                <div className="space-y-2">
                  <div>
                    <Label className="text-gray-400">Demo Video</Label>
                    {selectedApplication.demoVideoLink ? (
                      <a
                        href={selectedApplication.demoVideoLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-400 hover:underline"
                      >
                        View Demo Video
                      </a>
                    ) : (
                      <p className="text-white">N/A</p>
                    )}
                  </div>
                  <div>
                    <Label className="text-gray-400">Portfolio Links</Label>
                    <div className="space-y-1">
                      {selectedApplication.portfolioLinks?.length ? (
                        selectedApplication.portfolioLinks.map((link, index) => (
                          <a
                            key={index}
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-400 hover:underline block"
                          >
                            Portfolio {index + 1}
                          </a>
                        ))
                      ) : (
                        <p className="text-white">N/A</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-indigo-400">
                  Availability
                </h3>
                <div className="space-y-2">
                  <div>
                    <Label className="text-gray-400">Engagement Type</Label>
                    <p className="text-white capitalize">
                      {selectedApplication.availability?.engagementType?.replace(
                        "-",
                        " "
                      ) || "N/A"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-gray-400">Weekly Availability</Label>
                    <div className="space-y-1">
                      {selectedApplication.availability?.weeklySlots?.length ? (
                        selectedApplication.availability.weeklySlots.map(
                          (slot, index) => (
                            <div key={index} className="text-white">
                              {slot.day}: {slot.startTime} - {slot.endTime}
                            </div>
                          )
                        )
                      ) : (
                        <p className="text-white">N/A</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              {selectedApplication?.interviewDetails?.result?.notes && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-indigo-400">
                    Feedback
                  </h3>
                  <div className="space-y-2">
                    <div>
                      <Label className="text-gray-400">
                        Communication Skills
                      </Label>
                      <p className="text-white">
                        {ratingLabels[
                          selectedApplication.interviewDetails?.result
                            ?.communicationSkills
                        ] || "N/A"}
                      </p>
                    </div>
                    <div>
                      <Label className="text-gray-400">
                        Technical Knowledge
                      </Label>
                      <p className="text-white">
                        {ratingLabels[
                          selectedApplication.interviewDetails?.result
                            ?.technicalKnowledge
                        ] || "N/A"}
                      </p>
                    </div>
                    <div>
                      <Label className="text-gray-400">Coaching Style</Label>
                      <p className="text-white">
                        {ratingLabels[
                          selectedApplication.interviewDetails?.result
                            ?.coachingStyle
                        ] || "N/A"}
                      </p>
                    </div>
                    <div>
                      <Label className="text-gray-400">
                        Confidence Presence
                      </Label>
                      <p className="text-white">
                        {ratingLabels[
                          selectedApplication.interviewDetails?.result
                            ?.confidencePresence
                        ] || "N/A"}
                      </p>
                    </div>
                    <div>
                      <Label className="text-gray-400">Brand Alignment</Label>
                      <p className="text-white">
                        {ratingLabels[
                          selectedApplication.interviewDetails?.result
                            ?.brandAlignment
                        ] || "N/A"}
                      </p>
                    </div>
                    <div>
                      <Label className="text-gray-400">Equipment Quality</Label>
                      <p className="text-white">
                        {ratingLabels[
                          selectedApplication.interviewDetails?.result
                            ?.equipmentQuality
                        ] || "N/A"}
                      </p>
                    </div>
                    <div>
                      <Label className="text-gray-400">Notes</Label>
                      <p className="text-white">
                        {selectedApplication.interviewDetails?.result?.notes ||
                          "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Schedule Interview Modal */}
      <Dialog open={isScheduleModalOpen} onOpenChange={setIsScheduleModalOpen}>
        <DialogContent className="bg-gray-800 text-white border border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white">Schedule Interview</DialogTitle>
          </DialogHeader>
          {selectedApplication && (
            <div className="space-y-4">
              <div>
                <Label className="text-gray-400">Trainer</Label>
                <p className="text-white">{selectedApplication.name || "N/A"}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-gray-400">Date</label>
                  <input
                    type="date"
                    className="w-full bg-gray-800 text-white border border-gray-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={
                      scheduleDate
                        ? scheduleDate.toISOString().split("T")[0]
                        : ""
                    }
                    onChange={(e) => setScheduleDate(new Date(e.target.value))}
                  />
                </div>
                <div>
                  <label className="block mb-1 text-gray-400">Time</label>
                  <input
                    type="time"
                    className="w-full bg-gray-800 text-white border border-gray-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <button
                  className="px-4 py-2 rounded border border-gray-600 bg-gray-700 text-white hover:bg-gray-600 transition"
                  onClick={() => setIsScheduleModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-700 text-white transition"
                  onClick={() => handleScheduleInterview(selectedApplication.id)}
                >
                  Schedule Interview
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Approval Modal */}
      <Dialog open={isApprovalModalOpen} onOpenChange={setIsApprovalModalOpen}>
        <DialogContent className="bg-gray-800 text-white border border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white">Approve Trainer</DialogTitle>
          </DialogHeader>
          {selectedApplication && (
            <div className="space-y-4">
              <div>
                <Label className="text-gray-400">Trainer</Label>
                <p className="text-white">{selectedApplication.name || "N/A"}</p>
              </div>
              <div>
                <label className="block mb-1 text-gray-400">
                  Weekly Salary (Max ₹2500)
                </label>
                <input
                  type="number"
                  className="w-full bg-gray-800 text-white border border-gray-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter weekly salary"
                  min={500}
                  max={2500}
                  value={weeklySalary === 0 ? "" : weeklySalary}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "") {
                      setWeeklySalary(0);
                    } else {
                      const num = parseInt(value);
                      if (!isNaN(num) && num <= 2500) {
                        setWeeklySalary(num);
                      }
                    }
                  }}
                />
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <button
                  className="px-4 py-2 rounded border border-gray-600 bg-gray-700 text-white hover:bg-gray-600 transition"
                  onClick={() => setIsApprovalModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-700 text-white transition"
                  onClick={() => handleApproval(selectedApplication.id)}
                >
                  Approve Trainer
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Feedback Modal */}
      <Dialog open={isFeedbackModalOpen} onOpenChange={setIsFeedbackModalOpen}>
        <DialogContent className="bg-gray-800 text-white border-gray-700 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-white">Interview Feedback</DialogTitle>
          </DialogHeader>
          {selectedApplication && (
            <div className="space-y-4">
              <div>
                <Label className="text-gray-400">Trainer</Label>
                <p className="text-white">{selectedApplication.name || "N/A"}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { id: "communicationSkills", label: "Communication Skills" },
                  { id: "technicalKnowledge", label: "Technical Knowledge" },
                  { id: "coachingStyle", label: "Coaching Style" },
                  { id: "confidencePresence", label: "Confidence/Presence" },
                  { id: "brandAlignment", label: "Brand Alignment" },
                  { id: "equipmentQuality", label: "Equipment Quality" },
                ].map((item) => (
                  <div key={item.id}>
                    <Label className="text-gray-400">{item.label}</Label>
                    <Select
                      value={feedbackData[item.id as keyof FeedbackData].toString()}
                      onValueChange={(value) =>
                        setFeedbackData({
                          ...feedbackData,
                          [item.id]: parseInt(value),
                        })
                      }
                    >
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue placeholder="Select rating" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700 text-white">
                        {[1, 2, 3, 4, 5].map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num} -{" "}
                            {ratingLabels[num as keyof typeof ratingLabels]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
              <div>
                <Label className="text-gray-400">Notes</Label>
                <Textarea
                  className="bg-gray-700 border-gray-600 text-white"
                  rows={4}
                  value={feedbackData.notes}
                  onChange={(e) =>
                    setFeedbackData({ ...feedbackData, notes: e.target.value })
                  }
                />
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  variant="outline"
                  className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                  onClick={() => setIsFeedbackModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-indigo-600 hover:bg-indigo-700"
                  onClick={() => handleSubmitFeedback(selectedApplication.id)}
                >
                  Submit Feedback
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <TrainerTable
        applications={paginatedApplications}
        handleAction={handleAction}
      />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
      />
    </div>
  );
};

export default PendingApplicationsTable;