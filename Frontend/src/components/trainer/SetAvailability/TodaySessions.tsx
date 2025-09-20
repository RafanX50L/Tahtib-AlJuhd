import { Clock, Calendar } from "lucide-react";
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

interface TodaySessionsProps {
  todayBookedSlots: Slot[];
  isLoading: boolean;
  currentTime: Date;
  handleCancelBooking: (slotId: string, startTime: string, endTime: string, clientId: string) => void;
  handleMarkAsComplete: (slotId: string) => void;
  navigate: (path: string) => void;
}

const TodaySessions = ({ todayBookedSlots, isLoading, currentTime, handleCancelBooking, handleMarkAsComplete, navigate }: TodaySessionsProps) => {
  return (
    <div className="bg-[#1e1e1e] rounded-2xl border border-[#2c2c2c] p-6 shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg">
          <Clock className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-xl font-semibold text-white">Today's Booked Sessions</h2>{/* eslint-disable-line */}
        <div className="bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white text-xs px-3 py-1 rounded-full font-medium">
          {todayBookedSlots.filter((s) => s.status !== "completed").length} active sessions
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#6366f1]"></div>
        </div>
      ) : todayBookedSlots.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] rounded-full flex items-center justify-center mx-auto mb-4 opacity-50">
            <Calendar className="w-10 h-10 text-white" />
          </div>
          <p className="text-gray-400 text-lg">No booked sessions for today</p>
          <p className="text-gray-500 text-sm mt-2">Your schedule is clear!</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {todayBookedSlots.map((slot, index) => (
            <SessionCard
              key={slot.id}
              slot={slot}
              index={index}
              currentTime={currentTime}
              handleCancelBooking={handleCancelBooking}
              handleMarkAsComplete={handleMarkAsComplete}
              navigate={navigate}
              isDetailed={false}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TodaySessions;


