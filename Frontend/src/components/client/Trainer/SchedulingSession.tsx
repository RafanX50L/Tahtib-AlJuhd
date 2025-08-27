import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, User, Video, X, AlertCircle, Users } from "lucide-react";
import { format, differenceInMinutes } from "date-fns";
import { toast } from "sonner";
import { ClientService } from "@/services/implementation/clientServices";
import { cn } from "@/lib/utils";

interface Session {
  _id: string;
  trainerId: string;
  clientId?: string | null;
  startTime: string;
  endTime: string;
  status: "free" | "booked" | "cancelled";
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

  const handleCancelBooking = async (slotId: string) => {
    if (!user?._id) {
      toast.error("Please log in to cancel a booking");
      return;
    }
    try {
      await ClientService.cancelSlotBooking(slotId);
      await fetchSlots(selectedDate);
      toast.success("Booking cancelled successfully");
    } catch (error: any) {
      console.error("Error cancelling booking:", error);
      toast.error(error.message || "Failed to cancel booking");
    }
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
      default:
        return null;
    }
  };

  const selectedDateSlots = slots.filter(
    (slot) =>
      new Date(slot.startTime).toDateString() === selectedDate.toDateString()
  );
  const isToday = selectedDate.toDateString() === new Date().toDateString();

  return (
    <div className={cn(
      "w-full md:w-1/2 bg-gray-950 border-t md:border-t-0 md:border-l border-gray-700 flex flex-col",
      "h-[calc(100vh-12rem)] sm:h-[calc(100vh-8rem)] md:h-[calc(100vh-6rem)]"
    )}>
      {/* Plan Status Banner */}
      {contract && (
        <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 border border-blue-500/30 p-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-blue-400" />
                <span className="text-xs sm:text-sm font-medium text-blue-300">Plan: {contract.planName}</span>
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
          {(contract.sessionsRemaining <= 2 || new Date(contract.endDate) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)) && (
            <div className="mt-2 flex items-center gap-2 text-amber-300">
              <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="text-xs sm:text-sm">
                {contract.sessionsRemaining <= 2 
                  ? `Only ${contract.sessionsRemaining} session${contract.sessionsRemaining === 1 ? '' : 's'} remaining!`
                  : "Plan expires soon. Consider renewing!"
                }
              </span>
            </div>
          )}
        </div>
      )}
      <style >{`
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
            min={format(new Date(), "yyyy-MM-dd")}
          />
          <div className="text-xs sm:text-sm text-gray-400">
            {isToday ? (
              <span className="text-green-400">Today's sessions</span>
            ) : (
              <span>Sessions for {format(selectedDate, "MMMM d, yyyy")}</span>
            )}
          </div>
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
            <p className="text-sm sm:text-base">No sessions scheduled for this date</p>
          </div>
        ) : (
          <div className="space-y-4">
            {selectedDateSlots.map((slot) => (
              <div
                key={slot._id}
                className={`p-3 sm:p-4 rounded-lg border-2 ${getStatusColor(slot.status)} ${
                  isSlotStartingSoon(slot.startTime)
                    ? "ring-2 ring-yellow-500 ring-opacity-50"
                    : ""
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(slot.status)}
                    <span className="font-medium capitalize text-sm sm:text-base">{slot.status}</span>
                  </div>
                  {isSlotStartingSoon(slot.startTime) && (
                    <span className="bg-yellow-500 text-black text-xs px-2 py-1 rounded-full font-medium">
                      Starting Soon
                    </span>
                  )}
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-gray-300 text-sm sm:text-base">
                    <Clock className="w-4 h-4" />
                    <span>{formatTime(slot.startTime)}</span>
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
                <div className="flex gap-2">
                  {slot.status === "booked" && slot.clientId === user?._id && (
                    <>
                      <Button
                        size="sm"
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm"
                        onClick={() =>
                          window.open(`/room/${slot.meetingLink}`, "_blank")
                        }
                      >
                        <Video className="w-4 h-4 mr-1" />
                        Join
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black text-xs sm:text-sm"
                        onClick={() => handleCancelBooking(slot._id)}
                      >
                        Cancel
                      </Button>
                    </>
                  )}
                  {slot.status === "free" && contract?.sessionsRemaining! > 0 && (
                    <Button
                      size="sm"
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm"
                      onClick={() => handleBookSlot(slot._id)}
                    >
                      Book
                    </Button>
                  )}
                  {slot.status === "booked" && slot.clientId !== user?._id && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 border-gray-600 text-gray-400"
                      disabled
                    >
                      Booked
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SchedulingSection;