import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { RootState } from "@/store/store";
import { useSocket } from "@/hooks/socketio";
import { TrainerService } from "@/services/implementation/trainerServices";
import { chatEnum } from "@/lib/chat-enum";
import { SchedulingAPI } from "@/services/implementation/schedulingService";
import Header from "./Header";
import WeeklyRules from "./WeeklyRules";
import DateSelector from "./DateSelector";
import TodaySessions from "./TodaySessions";
import SelectedDateSessions from "./SelectedDateSessions";



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

interface DayWindow {
  startTime: string;
  endTime: string;
}

interface WeeklyRulesPayload {
  weeklyRules: Record<string, DayWindow[]>;
  slotLength: number;
  bufferMinutes: number;
}

const SetAvailabilityPage = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showWeeklyRules, setShowWeeklyRules] = useState(false);
  const [animatedCards, setAnimatedCards] = useState<string[]>([]); // eslint-disable-line
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigate = useNavigate();
  const socket = useSocket();

  const [weeklyRules, setWeeklyRules] = useState<WeeklyRulesPayload>({
    weeklyRules: {
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: [],
      Saturday: [],
      Sunday: [],
    },
    slotLength: 30,
    bufferMinutes: 0,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        if (!user?._id) return;
        const rules = await TrainerService.getWeeklyRules(user._id);
        if (rules) setWeeklyRules(rules);
        setIsLoading(false);
      } catch (err) {
        console.log(err);
      }
    })();
  }, [user?._id]);

  useEffect(() => {
    (async () => {
      try {
        if (!user?._id || !selectedDate) return;
        const fromDate = new Date(selectedDate);
        fromDate.setHours(0, 0, 0, 0);
        const toDate = new Date(selectedDate);
        toDate.setHours(23, 59, 59, 999);
        const res = await TrainerService.getSlots(user._id, fromDate.toISOString(), toDate.toISOString());
        setSlots(res.data || []);
      } catch (err) {
        console.log(err);
      }
    })();
  }, [user?._id, selectedDate]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedCards(slots.map((slot) => slot.id));
    }, 100);
    return () => clearTimeout(timer);
  }, [slots]);

  const getBookedSlots = () => {
    return slots
      .filter((slot) => (slot.status === "booked" || slot.status === "completed") && slot.clientId)
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  };

  const getTodayBookedSlots = () => {
    const today = new Date().toDateString();
    return getBookedSlots().filter((slot) => new Date(slot.startTime).toDateString() === today);
  };

  const getSelectedDateBookedSlots = () => {
    const selectedDateString = selectedDate.toDateString();
    return getBookedSlots().filter((slot) => new Date(slot.startTime).toDateString() === selectedDateString);
  };

  const handleCancelBooking = async (slotId: string, startTime: string, endTime: string, clientId: string) => {
    try {
      const element = document.getElementById(`slot-${slotId}`);
      if (element) {
        element.style.transform = "scale(0.95)";
        setTimeout(() => {
          element.style.transform = "scale(1)";
        }, 150);
      }

      toast.custom(
        (t) => (
          <div className="bg-white rounded-xl shadow-2xl border border-gray-100 p-6 max-w-md mx-auto transform transition-all duration-300 ease-out">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0 w-10 h-10 bg-red-50 rounded-full flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Cancel Booking</h3>
                <p className="text-sm text-gray-600">This action cannot be undone</p>
              </div>
            </div>
            <div className="mb-6">
              <p className="text-gray-700 leading-relaxed">
                Are you sure you want to cancel this session? The client will lose their reservation and must book a new slot if they wish to reschedule.
              </p>
            </div>
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
                    await SchedulingAPI.cancel(slotId, clientId);
                    setSlots(
                      slots.map((slot) =>
                        slot.id === slotId
                          ? { ...slot, status: "free" as const, clientId: null, clientName: undefined }
                          : slot
                      )
                    );
                    const formattedStart = new Date(startTime).toLocaleString("en-IN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    });
                    const formattedEnd = new Date(endTime).toLocaleString("en-IN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    });
                    socket?.emit(chatEnum.sendNotification, {
                      sender: user?._id,
                      receiver: clientId,
                      role: "trainer",
                      text: `Session canceled by ${user?.name} from ${formattedStart} to ${formattedEnd}`,
                      category: "session_canceled",
                    });
                    toast.success("Booking cancelled successfully");
                  } catch (error) {
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
          style: { background: "transparent", boxShadow: "none" },
        }
      );
    } catch (error) {
      toast.error(`Failed to cancel booking : ${error}`);
    }
  };

  const handleMarkAsComplete = async (slotId: string) => {
    try {
      await SchedulingAPI.completeBooking(slotId);
      setSlots(slots.map((slot) => (slot.id === slotId ? { ...slot, status: "completed" as const } : slot)));
      toast.success("Session marked as complete");
    } catch (error) {
      toast.error(`Failed to mark session as complete : ${error}`);
    }
  };

  const todayBookedSlots = getTodayBookedSlots();
  const selectedDateBookedSlots = getSelectedDateBookedSlots();
  const isToday = selectedDate.toDateString() === new Date().toDateString();
  const totalBookedSlots = getBookedSlots().filter((s) => s.status !== "completed").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f0f] via-[#1a1a1a] to-[#141414] p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <Header
          totalBookedSlots={totalBookedSlots}
          todayBookedSlots={todayBookedSlots}
          showWeeklyRules={showWeeklyRules}
          setShowWeeklyRules={setShowWeeklyRules}
        />
        <WeeklyRules
          userId={user?._id}
          weeklyRules={weeklyRules}
          setWeeklyRules={setWeeklyRules}
          showWeeklyRules={showWeeklyRules}
          setShowWeeklyRules={setShowWeeklyRules}
        />
        <DateSelector selectedDate={selectedDate} setSelectedDate={setSelectedDate} isToday={isToday} />
        {isToday && (
          <TodaySessions
            todayBookedSlots={todayBookedSlots}
            isLoading={isLoading}
            currentTime={currentTime}
            handleCancelBooking={handleCancelBooking}
            handleMarkAsComplete={handleMarkAsComplete}
            navigate={navigate}
          />
        )}
        <SelectedDateSessions
          selectedDateBookedSlots={selectedDateBookedSlots}
          isToday={isToday}
          currentTime={currentTime}
          selectedDate={selectedDate}
          handleCancelBooking={handleCancelBooking}
          handleMarkAsComplete={handleMarkAsComplete}
          navigate={navigate}
        />
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
        .animate-fadeInUp { animation: fadeInUp 0.6s ease-out forwards; }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
        .animate-scaleIn { animation: scaleIn 0.3s ease-out; }
        html { scroll-behavior: smooth; }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #1a1a1a; }
        ::-webkit-scrollbar-thumb { background: #6366f1; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #8b5cf6; }
      `}</style>
    </div>
  );
};

export default SetAvailabilityPage;


