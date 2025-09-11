import { JSX } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, UserCheck, Clock, User, Star, Video } from "lucide-react";

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

interface SessionCardProps {
  slot: Slot;
  index: number;
  currentTime: Date;
  handleCancelBooking: (slotId: string, startTime: string, endTime: string, clientId: string) => void;
  handleMarkAsComplete: (slotId: string) => void;
  navigate: (path: string) => void;
  isDetailed: boolean;
}

const SessionCard = ({ slot, index, currentTime, handleCancelBooking, handleMarkAsComplete, navigate, isDetailed }: SessionCardProps) => {
  const isSlotStartingSoon = (startTime: string) => {
    const now = currentTime;
    const slotStart = new Date(startTime);
    const timeDiff = slotStart.getTime() - now.getTime();
    return timeDiff > 0 && timeDiff <= 30 * 60 * 1000;
  };

  const isSessionEnded = (endTime: string) => {
    const now = currentTime;
    const slotEnd = new Date(endTime);
    return now > slotEnd;
  };

  const canJoinSession = (startTime: string) => {
    const now = currentTime;
    const slotStart = new Date(startTime);
    const timeDiff = slotStart.getTime() - now.getTime();
    return timeDiff <= 5 * 60 * 1000 && timeDiff > -60 * 60 * 1000;
  };

  const canCancelSession = (startTime: string, endTime: string) => {
    const now = currentTime;
    const slotStart = new Date(startTime);
    const slotEnd = new Date(endTime);
    const timeDiff = slotStart.getTime() - now.getTime();
    if (now > slotEnd) return false;
    return timeDiff > 30 * 60 * 1000;
  };

  const isSessionOngoing = (startTime: string, endTime: string) => {
    const now = currentTime;
    const slotStart = new Date(startTime);
    const slotEnd = new Date(endTime);
    return now >= slotStart && now <= slotEnd;
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const renderSessionActions = () => {
    const buttons = [] as JSX.Element[];
    const sessionEnded = isSessionEnded(slot.endTime);
    const canJoin = canJoinSession(slot.startTime);
    const canCancel = canCancelSession(slot.startTime, slot.endTime);
    const ongoing = isSessionOngoing(slot.startTime, slot.endTime);

    if (sessionEnded && slot.status !== "completed") {
      buttons.push(
        <Button
          key="complete"
          size="sm"
          className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 text-white shadow-lg hover:shadow-xl transition-all duration-300"
          onClick={() => handleMarkAsComplete(slot.id)}
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          Mark as Complete
        </Button>
      );
    }

    if (slot.status === "completed") {
      return (
        <div className="flex-1 text-center px-4 py-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 rounded-lg font-medium">
          <CheckCircle className="w-4 h-4 inline mr-2" />
          Completed
        </div>
      );
    }

    if ((canJoin || ongoing) && !sessionEnded) {
      buttons.push(
        <Button
          key="join"
          size="sm"
          className="flex-1 bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white shadow-lg hover:shadow-xl transition-all duration-300"
          onClick={() => navigate(`/room/${slot.meetingLink}`)}
        >
          <Video className="w-4 h-4 mr-2" />
          {ongoing ? "Join Now" : "Join Session"}
        </Button>
      );
    }

    if (canCancel) {
      buttons.push(
        <Button
          key="cancel"
          size="sm"
          variant="outline"
          className="border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10 hover:border-yellow-400"
          onClick={() => handleCancelBooking(slot.id, slot.startTime, slot.endTime, slot.clientId as string)}
        >
          Cancel
        </Button>
      );
    }

    if (buttons.length === 0 && !sessionEnded) {
      const slotStart = new Date(slot.startTime);
      const timeDiff = slotStart.getTime() - currentTime.getTime();
      const minutesUntilStart = Math.floor(timeDiff / (60 * 1000));
      if (minutesUntilStart > 5 && minutesUntilStart <= 30) {
        return (
          <div className="text-sm text-yellow-500 font-medium">
            Starting in {minutesUntilStart} minutes
          </div>
        );
      }
    }

    return buttons.length > 0 ? <div className="flex gap-3">{buttons}</div> : null;
  };

  return isDetailed ? (
    <div
      id={`detail-slot-${slot.id}`}
      className={`group flex items-center justify-between p-6 rounded-xl border bg-gradient-to-r from-[#2c2c2c] to-[#252525] border-[#3c3c3c] hover:border-[#6366f1] transition-all duration-500 hover:shadow-xl ${
        isSlotStartingSoon(slot.startTime) && slot.status !== "completed" ? "ring-2 ring-yellow-500/50" : ""
      } ${isSessionOngoing(slot.startTime, slot.endTime) && slot.status !== "completed" ? "ring-2 ring-green-500/50" : ""}`}
      style={{ animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both` }}
    >
      <div className="flex items-center gap-6">
        <div className={`p-3 rounded-lg ${slot.status === "completed" ? "bg-gradient-to-r from-green-500 to-emerald-600" : "bg-gradient-to-r from-blue-500 to-indigo-600"}`}>
          {slot.status === "completed" ? <CheckCircle className="w-6 h-6 text-white" /> : <UserCheck className="w-6 h-6 text-white" />}
        </div>
        <div>
          <div className="flex items-center gap-4 text-white mb-2">
            <span className="font-semibold text-lg">
              {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
            </span>
            {isSlotStartingSoon(slot.startTime) && slot.status !== "completed" && (
              <span className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black text-xs px-3 py-1 rounded-full font-bold animate-pulse">
                Starting Soon!
              </span>
            )}
            {isSessionOngoing(slot.startTime, slot.endTime) && slot.status !== "completed" && (
              <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs px-3 py-1 rounded-full font-bold animate-pulse">
                Live Now!
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <User className="w-4 h-4" />
            <span>Client: {slot.clientName}</span>
            <Star className="w-3 h-3 text-yellow-500 fill-current ml-2" />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className={`px-4 py-2 rounded-full text-sm font-medium ${slot.status === "completed" ? "bg-green-500/20 text-green-400" : "bg-blue-500/20 text-blue-400"}`}>
          {slot.status === "completed" ? "Completed" : "Booked"}
        </div>
        {renderSessionActions()}
      </div>

      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#6366f1]/5 to-[#8b5cf6]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
    </div>
  ) : (
    <div
      id={`slot-${slot.id}`}
      className={`group relative bg-gradient-to-br from-[#2c2c2c] to-[#1a1a1a] rounded-xl border border-[#3c3c3c] p-6 hover:border-[#6366f1] transition-all duration-500 hover:scale-105 hover:shadow-2xl ${
        isSlotStartingSoon(slot.startTime) ? "ring-2 ring-yellow-500/50 shadow-yellow-500/20" : ""
      } animate-fadeInUp`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          {slot.status === "completed" ? (
            <>
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-green-400 font-medium">Completed</span>
            </>
          ) : (
            <>
              <UserCheck className="w-5 h-5 text-blue-400" />
              <span className="text-blue-400 font-medium">Booked</span>
            </>
          )}
        </div>
        {isSlotStartingSoon(slot.startTime) && slot.status !== "completed" && (
          <span className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black text-xs px-3 py-1 rounded-full font-bold animate-pulse">
            Starting Soon!
          </span>
        )}
        {isSessionOngoing(slot.startTime, slot.endTime) && slot.status !== "completed" && (
          <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs px-3 py-1 rounded-full font-bold animate-pulse">
            Live Now!
          </span>
        )}
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-3 text-gray-300">
          <Clock className="w-4 h-4 text-[#6366f1]" />
          <span className="font-medium">
            {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
          </span>
        </div>
        <div className="flex items-center gap-3 text-gray-300">
          <User className="w-4 h-4 text-[#6366f1]" />
          <span>{slot.clientName}</span>
          <Star className="w-3 h-3 text-yellow-500 fill-current" />
        </div>
      </div>

      {renderSessionActions()}

      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#6366f1]/5 to-[#8b5cf6]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
    </div>
  );
};

export default SessionCard;


