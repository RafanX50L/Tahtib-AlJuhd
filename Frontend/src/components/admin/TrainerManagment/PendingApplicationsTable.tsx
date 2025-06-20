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
import { ITrainerWithPersonalization } from "@/pages/admin/ATrainerManagment";
import { AdminService } from "@/services/implementation/adminServices";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
// import { CalendarIcon } from "@radix-ui/react-icons";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
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

const feedbackSchema = z.object({
  communicationSkills: z.number().min(1, "Communication Skills is required"),
  technicalKnowledge: z.number().min(1, "Technical Knowledge is required"),
  coachingStyle: z.number().min(1, "Coaching Style is required"),
  confidencePresence: z.number().min(1, "Confidence/Presence is required"),
  brandAlignment: z.number().min(1, "Brand Alignment is required"),
  equipmentQuality: z.number().min(1, "Equipment Quality is required"),
  notes: z.string().min(1, "Notes are required"),
});

const PendingApplicationsTable: React.FC = () => {
  const [applications, setApplications] = useState<
    ITrainerWithPersonalization[]
  >([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedApplication, setSelectedApplication] =
    useState<ITrainerWithPersonalization | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [scheduleDate, setScheduleDate] = useState<Date | undefined>(
    new Date()
  );

  const navigate = useNavigate();

  const [scheduleTime, setScheduleTime] = useState("");

  type FeedbackData = z.infer<typeof feedbackSchema>;

  const ratingLabels: Record<number, string> = {
    1: "Poor",
    2: "Fair",
    3: "Average",
    4: "Impressive",
    5: "Excellent",
  };

  const [feedbackData, setFeedbackData] = useState<FeedbackData>({
    communicationSkills: 0,
    technicalKnowledge: 0,
    coachingStyle: 0,
    confidencePresence: 0,
    brandAlignment: 0,
    equipmentQuality: 0,
    notes: "",
  });

  const itemsPerPage = 5;

  const [weeklySalary, setWeeklySalary] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      const trainers = await AdminService.getPendingTrainers(currentPage);
      setApplications(Array.isArray(trainers.data) ? trainers.data : []);
    };
    fetchData();
  }, [currentPage]);

  const handleScheduleInterview = async (id: string) => {
    if (!scheduleDate || !scheduleTime) {
      toast.error("Please select both date and time");
      return;
    }
    console.log(
      "schemaDate",
      typeof scheduleDate,
      "\n",
      "time",
      typeof scheduleTime
    );
    try {
      // Call API to schedule interview
      const response = await AdminService.scheduleInterview(id, {
        date: scheduleDate,
        time: scheduleTime,
      });

      console.log("response", response);

      // Refresh data
      const trainers = await AdminService.getPendingTrainers(currentPage);
      setApplications(Array.isArray(trainers.data) ? trainers.data : []);

      setIsScheduleModalOpen(false);
      toast.success("Interview scheduled successfully");
    } catch (error) {
      console.error("Error scheduling interview:", error);
      alert("Failed to schedule interview");
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

      const trainers = await AdminService.getPendingTrainers(currentPage);
      setApplications(Array.isArray(trainers.data) ? trainers.data : []);

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
        toast.error("Weekly salary at least 500");
      } else {
        await AdminService.approveTrainer(id,weeklySalary);

        const trainers = await AdminService.getPendingTrainers(currentPage);
        setApplications(Array.isArray(trainers.data) ? trainers.data : []);

        setIsApprovalModalOpen(false);
        toast.success("Approal Of Trainer successfully");
      }
    } catch (error) {
      console.error("Error approving trainer", error);
      toast.error("Failed to Approve");
    }
  };
  
  const handleReject = async (id:string)=>{
    try {
      
        await AdminService.rejectTrainer(id);
  
        const trainers = await AdminService.getPendingTrainers(currentPage);
        setApplications(Array.isArray(trainers.data) ? trainers.data : []);
  
        setIsApprovalModalOpen(false);
        toast.success("Reject of Trainer successfully");
      
    } catch (error) {
      console.error("Error rejecting trainer", error);
      toast.error("Failed to reject");
    }
  }

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
        handleReject(application._id);
        break;
      default:
        break;
    }
  };

  const totalPages = Math.ceil(applications.length / itemsPerPage);
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

      {/* Details Modal */}
      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent className="max-w-4xl bg-gray-800 text-white border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white">Trainer Details</DialogTitle>
          </DialogHeader>
          {selectedApplication && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-indigo-400">
                  Basic Information
                </h3>
                <div className="space-y-2">
                  <div>
                    <Label className="text-gray-400">Name</Label>
                    <p className="text-white">{selectedApplication.name}</p>
                  </div>
                  <div>
                    <Label className="text-gray-400">Email</Label>
                    <p className="text-white">{selectedApplication.email}</p>
                  </div>
                  <div>
                    <Label className="text-gray-400">Phone</Label>
                    <p className="text-white">
                      {selectedApplication.basicInfo?.phoneNumber || "N/A"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-gray-400">Location</Label>
                    <p className="text-white">
                      {selectedApplication.basicInfo?.location || "N/A"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-gray-400">Gender</Label>
                    <p className="text-white">
                      {selectedApplication.basicInfo?.gender || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Professional Summary */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-indigo-400">
                  Professional Summary
                </h3>
                <div className="space-y-2">
                  <div>
                    <Label className="text-gray-400">Experience</Label>
                    <p className="text-white">
                      {selectedApplication.professionalSummary
                        ?.yearsOfExperience || "N/A"}{" "}
                      years
                    </p>
                  </div>
                  <div>
                    <Label className="text-gray-400">Specializations</Label>
                    <p className="text-white">
                      {selectedApplication.professionalSummary?.specializations?.join(
                        ", "
                      ) || "N/A"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-gray-400">Coaching Type</Label>
                    <p className="text-white">
                      {selectedApplication.professionalSummary?.coachingType?.join(
                        ", "
                      ) || "N/A"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-gray-400">Resume</Label>
                    {selectedApplication.sampleMaterials?.demoVideoLink ? (
                      <a
                        href={selectedApplication.sampleMaterials.resumeFile}
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
                      {selectedApplication.professionalSummary?.certifications?.map(
                        (cert, index) => (
                          <div key={index} className="text-white">
                            <div>
                              {cert.name} ({cert.issuer})
                            </div>
                            <div>
                              <Label className="text-white">
                                Proof:
                                <span>
                                  {cert.proofFile ? (
                                    <a
                                      href={cert.proofFile}
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
                        )
                      ) || "N/A"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Sample Materials */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-indigo-400">
                  Sample Materials
                </h3>
                <div className="space-y-2">
                  <div>
                    <Label className="text-gray-400">Demo Video</Label>
                    {selectedApplication.sampleMaterials?.demoVideoLink ? (
                      <a
                        href={selectedApplication.sampleMaterials.demoVideoLink}
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
                      {selectedApplication.sampleMaterials?.portfolioLinks?.map(
                        (link, index) => (
                          <a
                            key={index}
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-400 hover:underline block"
                          >
                            Portfolio {index + 1}
                          </a>
                        )
                      ) || "N/A"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Availability */}
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
                      {selectedApplication.availability?.weeklySlots?.map(
                        (slot, index) => (
                          <div key={index} className="text-white">
                            {slot.day}: {slot.startTime} - {slot.endTime}
                          </div>
                        )
                      ) || "N/A"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Feedback*/}
              {selectedApplication?.interviewDetails?.result?.notes &&  (
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
                            .communicationSkills
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
                            .technicalKnowledge
                        ] || "N/A"}
                      </p>
                    </div>
                    <div>
                      <Label className="text-gray-400">Coaching Style</Label>
                      <p className="text-white">
                        {ratingLabels[
                          selectedApplication.interviewDetails?.result
                            .coachingStyle
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
                            .confidencePresence
                        ] || "N/A"}
                      </p>
                    </div>
                    <div>
                      <Label className="text-gray-400">Brand Alignment</Label>
                      <p className="text-white">
                        {ratingLabels[
                          selectedApplication.interviewDetails?.result
                            .brandAlignment
                        ] || "N/A"}
                      </p>
                    </div>
                    <div>
                      <Label className="text-gray-400">Equipment Quality</Label>
                      <p className="text-white">
                        {ratingLabels[
                          selectedApplication.interviewDetails?.result
                            .equipmentQuality
                        ] || "N/A"}
                      </p>
                    </div>
                    <div>
                      <Label className="text-gray-400">Notes</Label>
                      <p className="text-white">
                        {selectedApplication.interviewDetails?.result.notes ||
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
              {/* Trainer Info */}
              <div>
                <Label className="text-gray-400">Trainer</Label>
                <p className="text-white">{selectedApplication.name}</p>
              </div>

              {/* Date and Time Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Date Picker */}
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

                {/* Time Picker */}
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

              {/* Action Buttons */}
              <div className="flex justify-end space-x-2 pt-4">
                <button
                  className="px-4 py-2 rounded border border-gray-600 bg-gray-700 text-white hover:bg-gray-600 transition"
                  onClick={() => setIsScheduleModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-700 text-white transition"
                  onClick={() =>
                    handleScheduleInterview(selectedApplication._id)
                  }
                >
                  Schedule Interview
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Approval  Modal */}
      <Dialog open={isApprovalModalOpen} onOpenChange={setIsApprovalModalOpen}>
        <DialogContent className="bg-gray-800 text-white border border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white">Schedule Interview</DialogTitle>
          </DialogHeader>

          {selectedApplication && (
            <div className="space-y-4">
              {/* Trainer Info */}
              <div>
                <Label className="text-gray-400">Trainer</Label>
                <p className="text-white">{selectedApplication.name}</p>
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
                      setWeeklySalary(0); // or null if you want to allow emptiness
                    } else {
                      const num = parseInt(value);
                      if (!isNaN(num)) {
                        if (num <= 2500) {
                          setWeeklySalary(num);
                        }
                      }
                    }
                  }}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-2 pt-4">
                <button
                  className="px-4 py-2 rounded border border-gray-600 bg-gray-700 text-white hover:bg-gray-600 transition"
                  onClick={() => setIsApprovalModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-700 text-white transition"
                  onClick={() => handleApproval(selectedApplication._id)}
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
                <p className="text-white">{selectedApplication.name}</p>
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
                      value={feedbackData[item.id].toString()}
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
                        {[1, 2, 3, 4, 5].map((num) => {
                          return (
                            <SelectItem key={num} value={num.toString()}>
                              {num} -{" "}
                              {ratingLabels[num as keyof typeof ratingLabels]}
                            </SelectItem>
                          );
                        })}
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
                  onClick={() => handleSubmitFeedback(selectedApplication._id)}
                >
                  Submit Feedback
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Applications Table */}
      <Card className="bg-gray-800 rounded-lg overflow-hidden border-none">
        <Table className="border-none">
          <TableHeader>
            <TableRow className="bg-gray-900 hover:bg-gray-900 border-none">
              <TableHead className="text-gray-400">Trainer</TableHead>
              <TableHead className="text-gray-400">Specialization</TableHead>
              <TableHead className="text-gray-400">Experience</TableHead>
              <TableHead className="text-gray-400">Applied On</TableHead>
              <TableHead className="text-gray-400">Status</TableHead>
              <TableHead className="text-gray-400 text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedApplications.map((application) => {
              const status = application.status?.toLowerCase() || "unknown";
              const profilePhoto = application.basicInfo?.profilePhoto;

              let statusClass = "bg-gray-200 text-gray-800";
              let statusText = application.status || "Unknown";

              if (
                status === "interviewed" ||
                status === "interview completed"
              ) {
                statusClass = "bg-yellow-200 text-yellow-800";
                statusText = "Interview Completed";
              } else if (
                status === "interview_scheduled" ||
                status === "interview scheduled"
              ) {
                statusClass = "bg-green-200 text-green-800";
                statusText = "Interview Scheduled, Time: ";
              } else if (status === "applied" || status === "not scheduled") {
                statusClass = "bg-purple-200 text-purple-800";
                statusText = "Not Scheduled";
              }

              return (
                <TableRow
                  key={application._id}
                  className="bg-gray-800 hover:bg-gray-700"
                >
                  <TableCell>
                    <div className="flex items-center">
                      <div className="relative">
                        {profilePhoto ? (
                          <>
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
                          </>
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-600 flex items-center justify-center text-white text-sm font-medium uppercase">
                            {application.name?.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-white">
                          {application.name}
                        </div>
                        <div className="text-sm text-gray-400">
                          {application.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-white">
                    {application.professionalSummary?.specializations?.join(
                      ", "
                    ) || "N/A"}
                  </TableCell>
                  <TableCell className="text-white">
                    {application.professionalSummary?.yearsOfExperience ??
                      "N/A"}{" "}
                    years
                  </TableCell>
                  <TableCell className="text-gray-400">
                    {new Date(
                      application.createdAt || application.createdAt
                    ).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${statusClass}`}
                    >
                      {statusText}
                      {application.status === "interview_scheduled" && (
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
                        onClick={() => {
                          setSelectedApplication(application);
                          setIsDetailsModalOpen(true);
                        }}
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
                        new Date(
                          application.interviewDetails.endTime
                        ).getTime() <= Date.now() ? (
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
                          {new Date(
                            application.interviewDetails.startTime
                          ).getTime() <= Date.now() ? (
                            <Button
                              variant="ghost"
                              className="text-indigo-400 hover:text-indigo-300"
                              onClick={() =>
                                handleJoinRoom(
                                  application.interviewDetails.roomId
                                )
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

      {/* Pagination */}
      <div className="flex justify-between items-center px-6 py-4 mt-4 bg-gray-800 rounded-lg">
        <div className="text-sm text-gray-400">
          Showing {(currentPage - 1) * itemsPerPage + 1}–
          {Math.min(currentPage * itemsPerPage, applications.length)} of{" "}
          {applications.length} applications
        </div>
        <div className="flex space-x-2">
          <Button
            className="bg-gray-700 hover:bg-gray-600"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
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
    </div>
  );
};

export default PendingApplicationsTable;
