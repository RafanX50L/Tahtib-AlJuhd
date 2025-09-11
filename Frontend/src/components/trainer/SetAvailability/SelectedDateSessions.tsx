import { Clock } from "lucide-react";
import SessionCard from "./SessionCard";

interface Slot {
  id: string;
  trainerId: string;
  clientId: string | null;
  clientName?: string;
  startTime: string;
  endTime: string;
  status: "booked" | "free" | "cancelled" | "completed";
  meetingLink: string;
  createdAt: string;
  updatedAt: string;
}

interface SelectedDateSessionsProps {
  selectedDateBookedSlots: Slot[];
  isToday: boolean;
  currentTime: Date;
  selectedDate: Date;
  handleCancelBooking: (slotId: string, startTime: string, endTime: string, clientId: string) => void;
  handleMarkAsComplete: (slotId: string) => void;
  navigate: (path: string) => void;
}

const SelectedDateSessions = ({ selectedDateBookedSlots, isToday, currentTime, selectedDate, handleCancelBooking, handleMarkAsComplete, navigate }: SelectedDateSessionsProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="bg-[#1e1e1e] rounded-2xl border border-[#2c2c2c] p-6 shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] rounded-lg">
          <Clock className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-xl font-semibold text-white">
          {isToday
            ? "Today's Sessions (Detailed)"
            : `Booked Sessions - ${formatDate(selectedDate.toISOString())}`}
        </h2>
        <div className="bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white text-xs px-3 py-1 rounded-full font-medium">
          {selectedDateBookedSlots.filter((s) => s.status !== "completed").length} active sessions
        </div>
      </div>

      {selectedDateBookedSlots.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] rounded-full flex items-center justify-center mx-auto mb-4 opacity-50">
            <Clock className="w-10 h-10 text-white" />
          </div>
          <p className="text-gray-400 text-lg">No booked sessions for this date</p>
          <p className="text-gray-500 text-sm mt-2">Sessions will appear here when clients book</p>
        </div>
      ) : (
        <div className="space-y-4">
          {selectedDateBookedSlots.map((slot, index) => (
            <SessionCard
              key={slot.id}
              slot={slot}
              index={index}
              currentTime={currentTime}
              handleCancelBooking={handleCancelBooking}
              handleMarkAsComplete={handleMarkAsComplete}
              navigate={navigate}
              isDetailed={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SelectedDateSessions;


