import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  User,
  Video,
  X,
  AlertCircle,
  Users,
  CheckCircle,
} from "lucide-react";
import { format, differenceInMinutes } from "date-fns";
import { toast } from "sonner";
import { ClientService } from "@/services/implementation/clientServices";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { SchedulingAPI } from "@/services/implementation/schedulingService";
import { chatEnum } from "@/lib/chat-enum";
import { useSocket } from "@/hooks/socketio";

interface Session {
  _id: string;
  trainerId: string;
  clientId?: string | null;
  startTime: string;
  endTime: string;
  status: "free" | "booked" | "cancelled" | "completed";
  meetingLink?: string;
  clientName?: string;
  type?: string;
  location?: string;
  duration?: string;
}

interface Contract {
  trainerId: string;
  sessionsRemaining: number;
  planName: string;
  endDate: string;
}

interface SchedulingSectionProps {
  contract: Contract | null;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
}

const SchedulingSection: React.FC<SchedulingSectionProps> = ({
  contract,
  selectedDate,
  setSelectedDate,
}) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [slots, setSlots] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigate = useNavigate();
  const socket = useSocket();

  // Update current time every minute for real-time session status updates
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (contract?.trainerId) {
      fetchSlots(selectedDate);
    }
  }, [contract, selectedDate]);

  const fetchSlots = async (date: Date) => {
    setIsLoading(true);
    try {
      const fromDate = new Date(date);
      fromDate.setHours(0, 0, 0, 0);
      const toDate = new Date(date);
      toDate.setHours(23, 59, 59, 999);
      const response = await ClientService.getSlots(
        contract?.trainerId || "",
        fromDate.toISOString(),
        toDate.toISOString()
      );
      const mappedSlots: Session[] = response.data.map((slot: any) => ({
        _id: slot._id,
        trainerId: slot.trainerId,
        clientId: slot.clientId,
        startTime: slot.startTime,
        endTime: slot.endTime,
        status: slot.status,
        meetingLink: slot.meetingLink,
        clientName: slot.clientName || undefined,
        type: slot.type || "Training Session",
        location: slot.location || "TBD",
        duration: `${differenceInMinutes(new Date(slot.endTime), new Date(slot.startTime))} min`,
      }));
      setSlots(mappedSlots);
    } catch (error) {
      console.error("Error fetching slots:", error);
      toast.error("Failed to fetch slots");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookSlot = async (slotId: string) => {
    if (!user?._id) {
      toast.error("Please log in to book a slot");
      return;
    }

    // Check plan validity
    if (!contract) {
      toast.error("No active plan found. Please purchase a plan first.");
      return;
    }

    if (contract.sessionsRemaining <= 0) {
      toast.error("No sessions remaining in your plan");
      return;
    }

    const planEndDate = new Date(contract.endDate);
    if (planEndDate < new Date()) {
      toast.error("Your plan has expired. Please renew your plan.");
      return;
    }

    // Check if trying to book a past slot
    const slot = slots.find((s) => s._id === slotId);
    if (slot && new Date(slot.startTime) < new Date()) {
      toast.error("Cannot book a session that has already started");
      return;
    }

    try {
      // call backend to enforce sessionsRemaining and plan validity
      await ClientService.bookSlot(user!._id, slotId);
      await fetchSlots(selectedDate);
      toast.success("Slot booked successfully");
    } catch (error: any) {
      console.error("Error booking slot:", error);
      toast.error(error.message || "Failed to book slot");
      await fetchSlots(selectedDate);
    }
  };

  const handleCancelBooking = async (
    slotId: string,
    startTime: string,
    endTime: string,
    clinetId: string
  ) => {
    if (!user?._id) {
      toast.error("Please log in to cancel a booking");
      return;
    }

    const slot = slots.find((s) => s._id === slotId);
    if (slot && !canCancelSession(slot.startTime, slot.endTime)) {
      toast.error(
        "Cannot cancel session within 30 minutes of start time or after it has ended"
      );
      return;
    }

    // ✅ Show confirmation toast
    toast.custom(
      (t) => (
        <div className="bg-white rounded-xl shadow-2xl border border-gray-100 p-6 max-w-md mx-auto transform transition-all duration-300 ease-out">
          {/* Header with icon */}
          <div className="flex items-center mb-4">
            <div className="flex-shrink-0 w-10 h-10 bg-red-50 rounded-full flex items-center justify-center mr-3">
              <svg
                className="w-5 h-5 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Cancel Booking
              </h3>
              <p className="text-sm text-gray-600">
                This action cannot be undone
              </p>
            </div>
          </div>

          {/* Message */}
          <div className="mb-6">
            <p className="text-gray-700 leading-relaxed">
              Are you sure you want to cancel this booking? You'll need to make
              a new reservation if you change your mind.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => toast.dismiss(t)}
              className="px-4 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
            >
              Keep Booking
            </button>
            <button
              onClick={async () => {
                try {
                  await SchedulingAPI.cancel(slotId, clinetId);
                  await fetchSlots(selectedDate);
                  const formattedStart = new Date(startTime).toLocaleString(
                    "en-IN",
                    {
                      dateStyle: "medium",
                      timeStyle: "short",
                    }
                  );

                  const formattedEnd = new Date(endTime).toLocaleString(
                    "en-IN",
                    {
                      dateStyle: "medium",
                      timeStyle: "short",
                    }
                  );
                  socket?.emit(chatEnum.sendNotification, {
                    sender: user?._id,
                    receiver: contract?.trainerId,
                    role: "trainer",
                    text: `Session canceled by ${user?.name} from ${formattedStart} to ${formattedEnd}`,
                    category: "session_canceled",
                  });
                  toast.success("Booking cancelled successfully", {
                    icon: "✅",
                    style: {
                      background: "#10B981",
                      color: "#fff",
                      borderRadius: "12px",
                      padding: "16px",
                      fontWeight: "500",
                    },
                  });
                } catch (error: any) {
                  console.error("Error cancelling booking:", error);
                } finally {
                  toast.dismiss(t);
                }
              }}
              className="px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-2 shadow-md hover:shadow-lg"
            >
              Yes, Cancel Booking
            </button>
          </div>
        </div>
      ),
      {
        duration: 10000,
        position: "top-center",
        style: {
          background: "transparent",
          boxShadow: "none",
        },
      }
    );
  };

  // Check if session has ended (client-side logic for display purposes)
  const isSessionEnded = (endTime: string) => {
    const now = currentTime;
    const slotEnd = new Date(endTime);
    return now > slotEnd;
  };

  // Check if join button should be shown (5 minutes before start to 1 hour after start)
  const canJoinSession = (startTime: string, endTime: string) => {
    const now = currentTime;
    const slotStart = new Date(startTime);
    const slotEnd = new Date(endTime);
    const timeDiff = slotStart.getTime() - now.getTime();

    // Can join from 5 minutes before start until session ends
    return timeDiff <= 5 * 60 * 1000 && now <= slotEnd;
  };

  // Check if cancel button should be shown (hide 30 minutes before start)
  const canCancelSession = (startTime: string, endTime: string) => {
    const now = currentTime;
    const slotStart = new Date(startTime);
    const slotEnd = new Date(endTime);
    const timeDiff = slotStart.getTime() - now.getTime();

    // Can't cancel if session has already ended
    if (now > slotEnd) return false;

    // Can cancel if more than 30 minutes before start
    return timeDiff > 30 * 60 * 1000;
  };

  // Check if session is ongoing
  const isSessionOngoing = (startTime: string, endTime: string) => {
    const now = currentTime;
    const slotStart = new Date(startTime);
    const slotEnd = new Date(endTime);
    return now >= slotStart && now <= slotEnd;
  };

  // Get effective status (accounting for time-based completion)
  const getEffectiveStatus = (slot: Session): Session["status"] => {
    if (slot.status === "booked" && isSessionEnded(slot.endTime)) {
      return "completed";
    }
    return slot.status;
  };

  const formatTime = (dateString: string) => {
    return format(new Date(dateString), "hh:mm a");
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "EEE, MMM d");
  };

  const isSlotStartingSoon = (startTime: string) => {
    const now = new Date();
    const slotStart = new Date(startTime);
    const timeDiff = slotStart.getTime() - now.getTime();
    return timeDiff > 0 && timeDiff <= 30 * 60 * 1000;
  };

  const getStatusColor = (status: Session["status"]) => {
    switch (status) {
      case "free":
        return "border-green-500";
      case "booked":
        return "border-blue-500";
      case "cancelled":
        return "border-red-500";
      case "completed":
        return "border-purple-500";
      default:
        return "border-gray-700";
    }
  };

  const getStatusIcon = (status: Session["status"]) => {
    switch (status) {
      case "free":
        return <Clock className="w-4 h-4 text-green-500" />;
      case "booked":
        return <User className="w-4 h-4 text-blue-500" />;
      case "cancelled":
        return <X className="w-4 h-4 text-red-500" />;
      case "completed":
        return <CheckCircle className="w-4 h-4 text-purple-500" />;
      default:
        return null;
    }
  };

  // Render session action buttons based on time and status
  const renderSessionActions = (slot: Session) => {
    const effectiveStatus = getEffectiveStatus(slot);
    const sessionEnded = isSessionEnded(slot.endTime);
    const canJoin = canJoinSession(slot.startTime, slot.endTime);
    const canCancel = canCancelSession(slot.startTime, slot.endTime);
    const ongoing = isSessionOngoing(slot.startTime, slot.endTime);
    const isMyBooking = slot.clientId === user?._id;

    // If session is completed (ended)
    if (effectiveStatus === "completed") {
      return (
        <div className="flex-1 text-center px-4 py-2 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 text-purple-400 rounded-lg font-medium">
          <CheckCircle className="w-4 h-4 inline mr-2" />
          Completed
        </div>
      );
    }

    // If it's my booking and I can join
    if (slot.status === "booked" && isMyBooking) {
      const buttons = [];

      // Show join button if session is about to start or ongoing
      if (canJoin) {
        buttons.push(
          <Button
            key="join"
            size="sm"
            className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm"
            onClick={() => navigate(`/room/${slot.meetingLink}`)}
          >
            <Video className="w-4 h-4 mr-1" />
            {ongoing ? "Join Now" : "Join"}
          </Button>
        );
      }

      // Show cancel button if allowed
      if (canCancel) {
        buttons.push(
          <Button
            key="cancel"
            size="sm"
            variant="outline"
            className="flex-1 border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black text-xs sm:text-sm"
            onClick={() =>
              handleCancelBooking(
                slot._id,
                slot.startTime,
                slot.endTime,
                slot.clientId as string
              )
            }
          >
            Cancel
          </Button>
        );
      }

      // If no buttons available, show session status
      if (buttons.length === 0 && !sessionEnded) {
        const slotStart = new Date(slot.startTime);
        const timeDiff = slotStart.getTime() - currentTime.getTime();
        const minutesUntilStart = Math.floor(timeDiff / (60 * 1000));

        if (minutesUntilStart > 5 && minutesUntilStart <= 30) {
          return (
            <div className="text-xs sm:text-sm text-yellow-500 font-medium text-center">
              Starting in {minutesUntilStart} minutes
            </div>
          );
        }
      }

      return buttons.length > 0 ? (
        <div className="flex gap-2">{buttons}</div>
      ) : null;
    }

    // Free slot - show book button if user has sessions remaining and slot hasn't started
    if (slot.status === "free" && contract?.sessionsRemaining! > 0) {
      const slotStart = new Date(slot.startTime);
      const isPastSlot = slotStart < new Date();

      return (
        <Button
          size="sm"
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => handleBookSlot(slot._id)}
          disabled={isPastSlot}
        >
          {isPastSlot ? "Past Session" : "Book"}
        </Button>
      );
    }

    // Booked by someone else
    if (slot.status === "booked" && slot.clientId !== user?._id) {
      return (
        <Button
          size="sm"
          variant="outline"
          className="flex-1 border-gray-600 text-gray-400"
          disabled
        >
          Booked
        </Button>
      );
    }

    // No sessions remaining
    if (slot.status === "free" && contract?.sessionsRemaining! <= 0) {
      return (
        <Button
          size="sm"
          variant="outline"
          className="flex-1 border-gray-600 text-gray-400"
          disabled
        >
          No Sessions Left
        </Button>
      );
    }

    return null;
  };

  const selectedDateSlots = slots.filter(
    (slot) =>
      new Date(slot.startTime).toDateString() === selectedDate.toDateString()
  );
  const isToday = selectedDate.toDateString() === new Date().toDateString();

  return (
    <div
      className={cn(
        "w-full md:w-1/2 bg-gray-950 border-t md:border-t-0 md:border-l border-gray-700 flex flex-col",
        "h-[calc(100vh-12rem)] sm:h-[calc(100vh-8rem)] md:h-[calc(100vh-6rem)]"
      )}
    >
      {/* Plan Status Banner */}
      {contract && (
        <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 border border-blue-500/30 p-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-blue-400" />
                <span className="text-xs sm:text-sm font-medium text-blue-300">
                  Plan: {contract.planName}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-3 w-3 sm:h-4 sm:w-4 text-green-400" />
                <span className="text-xs sm:text-sm font-medium text-green-300">
                  Sessions: {contract.sessionsRemaining}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-400" />
              <span className="text-xs sm:text-sm text-yellow-300">
                Expires: {format(new Date(contract.endDate), "MMM d, yyyy")}
              </span>
            </div>
          </div>

          {/* Warning if plan is expiring soon or no sessions left */}
          {(contract.sessionsRemaining <= 2 ||
            new Date(contract.endDate) <
              new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)) && (
            <div className="mt-2 flex items-center gap-2 text-amber-300">
              <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="text-xs sm:text-sm">
                {contract.sessionsRemaining <= 2
                  ? `Only ${contract.sessionsRemaining} session${contract.sessionsRemaining === 1 ? "" : "s"} remaining!`
                  : "Plan expires soon. Consider renewing!"}
              </span>
            </div>
          )}
        </div>
      )}

      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      <div className="bg-gradient-to-br from-gray-800 to-gray-800/80 p-4 sm:p-6 border-b border-gray-700">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-[#6366f1]" />
          <h2 className="text-base sm:text-lg font-semibold">Select Date</h2>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <input
            type="date"
            value={format(selectedDate, "yyyy-MM-dd")}
            onChange={(e) => setSelectedDate(new Date(e.target.value))}
            className="p-2 sm:p-3 bg-[#2c2c2c] border border-[#3c3c3c] rounded-md text-white text-sm sm:text-base focus:ring-2 focus:ring-[#6366f1] focus:outline-none w-full sm:w-auto"
            // min={format(new Date(), "yyyy-MM-dd")}
          />
          <div className="text-xs sm:text-sm text-gray-400">
            {isToday ? (
              <span className="text-green-400">Today's sessions</span>
            ) : (
              <span>Sessions for {format(selectedDate, "MMMM d, yyyy")}</span>
            )}
          </div>
          <button
          aria-label={`Book a session with Trainer`}
          onClick={() => navigate(`/booking/${contract?.trainerId}`)}
          className="px-6 py-3 bg-gray-800 text-white rounded-xl font-medium hover:bg-gray-700 transition-colors"
        >
          Book a Session
        </button>
        </div>
      </div>

      <div className="flex-1 p-4 overflow-y-auto no-scrollbar">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-[#6366f1]" />
          <h3 className="text-base sm:text-lg font-semibold">
            {isToday
              ? "Today's Sessions"
              : `Sessions for ${formatDate(selectedDate.toISOString())}`}
          </h3>
          <span className="bg-[#6366f1] text-white text-xs px-2 py-1 rounded-full">
            {selectedDateSlots.length}
          </span>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-[#6366f1]"></div>
          </div>
        ) : selectedDateSlots.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <Calendar className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm sm:text-base">
              No sessions scheduled for this date
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {selectedDateSlots.map((slot) => {
              const effectiveStatus = getEffectiveStatus(slot);
              const ongoing = isSessionOngoing(slot.startTime, slot.endTime);

              return (
                <div
                  key={slot._id}
                  className={`p-3 sm:p-4 rounded-lg border-2 ${getStatusColor(effectiveStatus)} ${
                    isSlotStartingSoon(slot.startTime) &&
                    effectiveStatus !== "completed"
                      ? "ring-2 ring-yellow-500 ring-opacity-50"
                      : ""
                  } ${
                    ongoing && effectiveStatus !== "completed"
                      ? "ring-2 ring-green-500 ring-opacity-50"
                      : ""
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(effectiveStatus)}
                      <span className="font-medium capitalize text-sm sm:text-base">
                        {effectiveStatus}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      {isSlotStartingSoon(slot.startTime) &&
                        effectiveStatus !== "completed" && (
                          <span className="bg-yellow-500 text-black text-xs px-2 py-1 rounded-full font-medium">
                            Starting Soon
                          </span>
                        )}
                      {ongoing && effectiveStatus !== "completed" && (
                        <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium animate-pulse">
                          Live Now
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-gray-300 text-sm sm:text-base">
                      <Clock className="w-4 h-4" />
                      <span>
                        {formatTime(slot.startTime)} -{" "}
                        {formatTime(slot.endTime)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300 text-sm sm:text-base">
                      <span>
                        {slot.type || "Training Session"} • {slot.duration}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300 text-sm sm:text-base">
                      <span>{slot.location || "TBD"}</span>
                    </div>
                    {slot.clientId && slot.clientName && (
                      <div className="flex items-center gap-2 text-gray-300 text-sm sm:text-base">
                        <User className="w-4 h-4" />
                        <span>{slot.clientName}</span>
                      </div>
                    )}
                  </div>

                  {renderSessionActions(slot)}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SchedulingSection;
