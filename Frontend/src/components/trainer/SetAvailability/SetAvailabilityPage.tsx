import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { TrainerService } from "@/services/implementation/trainerServices";
import { AvailabilityAPI } from "@/services/implementation/availabilityService";
import {
  Calendar,
  Clock,
  Plus,
  User,
  CheckCircle,
  XCircle,
  Trash2,
  UserCheck,
  AlertCircle,
  Video,
  Settings,
  ChevronDown,
  ChevronUp,
  Star,
  MapPin,
  Activity,
  Edit2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface Slot {
  _id: string;
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

export interface WeeklyRulesPayload {
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
  const [isEditingRules, setIsEditingRules] = useState(false);
  const [animatedCards, setAnimatedCards] = useState<string[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigate = useNavigate();

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

  // Update current time every minute for real-time button updates
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  // Load real data: weekly rules and slots for selected date
  useEffect(() => {
    (async () => {
      try {
        if (!user?._id) return;
        // Fetch weekly rules from backend
        const rules = await TrainerService.getWeeklyRules(user._id);
        if (rules)
          setWeeklyRules(rules);
        console.log(rules);
      } catch (err) {
        // ignore quietly
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
        const res = await TrainerService.getSlots(
          user._id,
          fromDate.toISOString(),
          toDate.toISOString()
        );
        setSlots(res.data || []);
      } catch (err) {
        // ignore quietly
      }
    })();
  }, [user?._id, selectedDate]);

  // Save weekly rules helper
  const saveWeeklyRules = async () => {
    if (!user?._id) return;
    try {
      await AvailabilityAPI.setWeeklyRules({
        trainerId: user._id,
        rules: weeklyRules,
      });
      toast.success("Weekly rules saved successfully");
      setShowWeeklyRules(!showWeeklyRules);
      setIsEditingRules(false); // Exit edit mode after saving
    } catch (error) {
      toast.error("Failed to save weekly rules");
    }
  };

  useEffect(() => {
    // Animate cards on load
    const timer = setTimeout(() => {
      setAnimatedCards(slots.map((slot) => slot._id));
    }, 100);
    return () => clearTimeout(timer);
  }, [slots]);

  // Filter to show only booked sessions
  const getBookedSlots = () => {
    return slots
      .filter((slot) => (slot.status === "booked" || slot.status === "completed") && slot.clientId)
      .sort(
        (a, b) =>
          new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
      );
  };

  const getTodayBookedSlots = () => {
    const today = new Date().toDateString();
    return getBookedSlots().filter(
      (slot) => new Date(slot.startTime).toDateString() === today
    );
  };

  const getSelectedDateBookedSlots = () => {
    const selectedDateString = selectedDate.toDateString();
    return getBookedSlots().filter(
      (slot) => new Date(slot.startTime).toDateString() === selectedDateString
    );
  };

  const isSlotStartingSoon = (startTime: string) => {
    const now = new Date();
    const slotStart = new Date(startTime);
    const timeDiff = slotStart.getTime() - now.getTime();
    return timeDiff > 0 && timeDiff <= 30 * 60 * 1000; // 30 minutes
  };

  // Check if session has ended
  const isSessionEnded = (endTime: string) => {
    const now = currentTime;
    const slotEnd = new Date(endTime);
    return now > slotEnd;
  };

  // Check if join button should be shown (5 minutes before start)
  const canJoinSession = (startTime: string) => {
    const now = currentTime;
    const slotStart = new Date(startTime);
    const timeDiff = slotStart.getTime() - now.getTime();
    return timeDiff <= 5 * 60 * 1000 && timeDiff > -60 * 60 * 1000; // 5 min before to 1 hour after start
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

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const handleCancelBooking = async (slotId: string) => {
    try {
      const element = document.getElementById(`slot-${slotId}`);
      if (element) {
        element.style.transform = "scale(0.95)";
        setTimeout(() => {
          element.style.transform = "scale(1)";
        }, 150);
      }

      setSlots(
        slots.map((slot) =>
          slot._id === slotId
            ? {
                ...slot,
                status: "free" as const,
                clientId: null,
                clientName: undefined,
              }
            : slot
        )
      );
      toast.success("Booking cancelled successfully");
    } catch (error: any) {
      toast.error("Failed to cancel booking");
    }
  };

  const handleMarkAsComplete = async (slotId: string) => {
    try {
      setSlots(
        slots.map((slot) =>
          slot._id === slotId
            ? {
                ...slot,
                status: "completed" as const,
              }
            : slot
        )
      );
      toast.success("Session marked as complete");
    } catch (error: any) {
      toast.error("Failed to mark session as complete");
    }
  };

  const timeToMinutes = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const hasOverlap = (
    day: string,
    newWindow: DayWindow,
    excludeIndex?: number
  ) => {
    const existingWindows = (weeklyRules.weeklyRules[day] || []).filter(
      (_, idx) => idx !== excludeIndex
    );
    const newStart = timeToMinutes(newWindow.startTime);
    const newEnd = timeToMinutes(newWindow.endTime);

    if (newStart >= newEnd) {
      return true;
    }

    return existingWindows.some((window) => {
      const start = timeToMinutes(window.startTime);
      const end = timeToMinutes(window.endTime);
      return newStart < end && newEnd > start;
    });
  };

  const getDefaultWindow = (day: string): DayWindow => {
    const existingWindows = weeklyRules.weeklyRules[day] || [];
    if (existingWindows.length === 0) {
      return { startTime: "09:00", endTime: "10:00" };
    }
    const latestEnd = existingWindows.reduce((max, window) => {
      const endMinutes = timeToMinutes(window.endTime);
      return Math.max(max, endMinutes);
    }, 0);
    const newStartMinutes = latestEnd + 60;
    const newEndMinutes = newStartMinutes + 60;
    const formatTime = (minutes: number) => {
      const hours = Math.floor(minutes / 60)
        .toString()
        .padStart(2, "0");
      const mins = (minutes % 60).toString().padStart(2, "0");
      return `${hours}:${mins}`;
    };
    return {
      startTime: formatTime(newStartMinutes),
      endTime: formatTime(newEndMinutes),
    };
  };

  const handleAddWindow = (day: string) => {
    const newWindow = getDefaultWindow(day);
    if (hasOverlap(day, newWindow)) {
      toast.error(
        `Cannot add window for ${day}: Time overlaps with existing window.`
      );
      return;
    }
    setWeeklyRules((prev) => ({
      ...prev,
      weeklyRules: {
        ...prev.weeklyRules,
        [day]: [...(prev.weeklyRules[day] || []), newWindow],
      },
    }));
    toast.success(`Added new time window for ${day}`);
  };

  const handleRemoveWindow = (day: string, index: number) => {
    setWeeklyRules((prev) => ({
      ...prev,
      weeklyRules: {
        ...prev.weeklyRules,
        [day]: (prev.weeklyRules[day] || []).filter((_, idx) => idx !== index),
      },
    }));
    toast.success(`Removed time window for ${day}`);
  };

  const handleUpdateWindow = (
    day: string,
    index: number,
    field: "startTime" | "endTime",
    value: string
  ) => {
    const updatedWindow = {
      ...(weeklyRules.weeklyRules[day] || [])[index],
      [field]: value,
    };
    if (hasOverlap(day, updatedWindow, index)) {
      toast.error(
        `Cannot update time for ${day}: New time would cause an overlap.`
      );
      return;
    }
    setWeeklyRules((prev) => ({
      ...prev,
      weeklyRules: {
        ...prev.weeklyRules,
        [day]: (prev.weeklyRules[day] || []).map((window, idx) =>
          idx === index ? { ...window, [field]: value } : window
        ),
      },
    }));
  };

  // Render session action buttons based on time logic
  const renderSessionActions = (slot: Slot) => {
    const buttons = [];
    const sessionEnded = isSessionEnded(slot.endTime);
    const canJoin = canJoinSession(slot.startTime);
    const canCancel = canCancelSession(slot.startTime, slot.endTime);
    const ongoing = isSessionOngoing(slot.startTime, slot.endTime);

    // If session has ended and not marked complete
    if (sessionEnded && slot.status !== "completed") {
      buttons.push(
        <Button
          key="complete"
          size="sm"
          className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 text-white shadow-lg hover:shadow-xl transition-all duration-300"
          onClick={() => handleMarkAsComplete(slot._id)}
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          Mark as Complete
        </Button>
      );
    }

    // If session is completed
    if (slot.status === "completed") {
      return (
        <div className="flex-1 text-center px-4 py-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 rounded-lg font-medium">
          <CheckCircle className="w-4 h-4 inline mr-2" />
          Completed
        </div>
      );
    }

    // If session is ongoing or can join (5 min before start)
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

    // Show cancel button only if allowed (more than 30 min before start)
    if (canCancel) {
      buttons.push(
        <Button
          key="cancel"
          size="sm"
          variant="outline"
          className="border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10 hover:border-yellow-400"
          onClick={() => handleCancelBooking(slot._id)}
        >
          Cancel
        </Button>
      );
    }

    // If no buttons to show, show status
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

    return buttons.length > 0 ? (
      <div className="flex gap-3">
        {buttons}
      </div>
    ) : null;
  };

  const todayBookedSlots = getTodayBookedSlots();
  const selectedDateBookedSlots = getSelectedDateBookedSlots();
  const isToday = selectedDate.toDateString() === new Date().toDateString();
  const totalBookedSlots = getBookedSlots().filter(s => s.status !== "completed").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f0f] via-[#1a1a1a] to-[#141414] p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Animated Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] rounded-2xl p-8 text-white shadow-2xl">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent animate-pulse">
                  Session Management
                </h1>
                <p className="text-gray-200 text-lg">
                  Manage your client sessions with ease
                </p>
                <div className="flex items-center gap-6 mt-4">
                  <div className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    <span className="text-sm">
                      {totalBookedSlots} Active Sessions
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    <span className="text-sm">
                      {todayBookedSlots.filter(s => s.status !== "completed").length} Today
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={() => setShowWeeklyRules(!showWeeklyRules)}
                  variant="outline"
                  className="border-white text-blue-700 hover:bg-white/10 backdrop-blur-sm transition-all duration-300"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Availability Rules
                  {showWeeklyRules ? (
                    <ChevronUp className="w-4 h-4 ml-2" />
                  ) : (
                    <ChevronDown className="w-4 h-4 ml-2" />
                  )}
                </Button>
              </div>
            </div>
          </div>

          <div
            className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full animate-bounce"
            style={{ animationDuration: "3s" }}
          ></div>
          <div
            className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full animate-bounce"
            style={{ animationDuration: "4s", animationDelay: "1s" }}
          ></div>
        </div>

        {/* Weekly Rules - Collapsible */}
        <div
          className={`transition-all duration-500 ease-in-out overflow-hidden ${
            showWeeklyRules ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="bg-[#1e1e1e] rounded-2xl border border-[#2c2c2c] p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] rounded-lg">
                <Settings className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-white">
                Weekly Availability Rules
              </h2>
            </div>

            {isEditingRules ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  {[
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                    "Sunday",
                  ].map((day, index) => (
                    <div
                      key={day}
                      className="bg-[#141414] border border-[#2c2c2c] rounded-xl p-4 hover:border-[#6366f1] transition-all duration-300"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="text-sm font-medium text-gray-300 mb-3">
                        {day}
                      </div>
                      {(weeklyRules.weeklyRules[day] || []).map(
                        (w: DayWindow, idx: number) => (
                          <div key={idx} className="flex gap-2 mb-2">
                            <input
                              type="time"
                              value={w.startTime}
                              onChange={(e) =>
                                handleUpdateWindow(
                                  day,
                                  idx,
                                  "startTime",
                                  e.target.value
                                )
                              }
                              className="flex-1 p-2 bg-[#2c2c2c] border border-[#3c3c3c] rounded-lg text-white focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1] transition-colors"
                            />
                            <input
                              type="time"
                              value={w.endTime}
                              onChange={(e) =>
                                handleUpdateWindow(
                                  day,
                                  idx,
                                  "endTime",
                                  e.target.value
                                )
                              }
                              className="flex-1 p-2 bg-[#2c2c2c] border border-[#3c3c3c] rounded-lg text-white focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1] transition-colors"
                            />
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                              onClick={() => handleRemoveWindow(day, idx)}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        )
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full border-[#3c3c3c] text-gray-400 hover:bg-[#2c2c2c] hover:text-white"
                        onClick={() => handleAddWindow(day)}
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Add Window
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-4 items-center">
                  <div className="flex items-center gap-3">
                    <span className="text-gray-300 text-sm font-medium">
                      Slot Length (min)
                    </span>
                    <input
                      type="number"
                      min={15}
                      step={15}
                      value={weeklyRules.slotLength || 30}
                      onChange={(e) =>
                        setWeeklyRules({
                          ...weeklyRules,
                          slotLength: Number(e.target.value),
                        })
                      }
                      className="w-20 p-2 bg-[#2c2c2c] border border-[#3c3c3c] rounded-lg text-white focus:border-[#6366f1]"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-300 text-sm font-medium">
                      Buffer (min)
                    </span>
                    <input
                      type="number"
                      min={0}
                      step={5}
                      value={weeklyRules.bufferMinutes || 0}
                      onChange={(e) =>
                        setWeeklyRules({
                          ...weeklyRules,
                          bufferMinutes: Number(e.target.value),
                        })
                      }
                      className="w-20 p-2 bg-[#2c2c2c] border border-[#3c3c3c] rounded-lg text-white focus:border-[#6366f1]"
                    />
                  </div>
                  <Button
                    className="bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] hover:from-[#5855eb] hover:to-[#7c3aed] text-white"
                    onClick={saveWeeklyRules}
                  >
                    Save Rules
                  </Button>
                  <Button
                    variant="outline"
                    className="border-gray-500 text-gray-400 hover:bg-gray-500/10"
                    onClick={() => setIsEditingRules(false)}
                  >
                    Cancel Edit
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  {[
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                    "Sunday",
                  ].map((day, index) => (
                    <div
                      key={day}
                      className="bg-[#141414] border border-[#2c2c2c] rounded-xl p-4 hover:border-[#6366f1] transition-all duration-300"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="text-sm font-medium text-gray-300 mb-3">
                        {day}
                      </div>
                      {(weeklyRules.weeklyRules[day] || []).length === 0 ? (
                        <div className="text-gray-500 text-sm">
                          No availability set
                        </div>
                      ) : (
                        (weeklyRules.weeklyRules[day] || []).map(
                          (w: DayWindow, idx: number) => (
                            <div key={idx} className="flex gap-2 mb-2">
                              <span className="flex-1 p-2 bg-[#2c2c2c] border border-[#3c3c3c] rounded-lg text-white">
                                {w.startTime} - {w.endTime}
                              </span>
                            </div>
                          )
                        )
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-4 items-center">
                  <div className="flex items-center gap-3">
                    <span className="text-gray-300 text-sm font-medium">
                      Slot Length (min)
                    </span>
                    <span className="p-2 bg-[#2c2c2c] border border-[#3c3c3c] rounded-lg text-white">
                      {weeklyRules.slotLength}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-300 text-sm font-medium">
                      Buffer (min)
                    </span>
                    <span className="p-2 bg-[#2c2c2c] border border-[#3c3c3c] rounded-lg text-white">
                      {weeklyRules.bufferMinutes}
                    </span>
                  </div>
                  <Button
                    className="bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] hover:from-[#5855eb] hover:to-[#7c3aed] text-white"
                    onClick={() => setIsEditingRules(true)}
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit Rules
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Date Selector */}
        <div className="bg-[#1e1e1e] rounded-2xl border border-[#2c2c2c] p-6 shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] rounded-lg">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-white">Select Date</h2>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <input
              type="date"
              value={selectedDate.toISOString().split("T")[0]}
              onChange={(e) => setSelectedDate(new Date(e.target.value))}
              className="p-3 bg-[#2c2c2c] border border-[#3c3c3c] rounded-xl text-white focus:ring-2 focus:ring-[#6366f1] focus:outline-none focus:border-[#6366f1] transition-all duration-300"
              min={new Date().toISOString().split("T")[0]}
            />
            <div className="text-sm text-gray-400 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              {isToday ? (
                <span className="text-green-400 font-medium">
                  Today's booked sessions
                </span>
              ) : (
                <span>
                  Booked sessions for{" "}
                  {selectedDate.toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Today's Booked Sessions */}
        {isToday && (
          <div className="bg-[#1e1e1e] rounded-2xl border border-[#2c2c2c] p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-white">
                Today's Booked Sessions
              </h2>
              <div className="bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white text-xs px-3 py-1 rounded-full font-medium">
                {todayBookedSlots.filter(s => s.status !== "completed").length} active sessions
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
                <p className="text-gray-400 text-lg">
                  No booked sessions for today
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  Your schedule is clear!
                </p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {todayBookedSlots.map((slot, index) => (
                  <div
                    key={slot._id}
                    id={`slot-${slot._id}`}
                    className={`group relative bg-gradient-to-br from-[#2c2c2c] to-[#1a1a1a] rounded-xl border border-[#3c3c3c] p-6 hover:border-[#6366f1] transition-all duration-500 hover:scale-105 hover:shadow-2xl ${
                      isSlotStartingSoon(slot.startTime)
                        ? "ring-2 ring-yellow-500/50 shadow-yellow-500/20"
                        : ""
                    } ${animatedCards.includes(slot._id) ? "animate-fadeInUp" : "opacity-0"}`}
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
                          {formatTime(slot.startTime)} -{" "}
                          {formatTime(slot.endTime)}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-300">
                        <User className="w-4 h-4 text-[#6366f1]" />
                        <span>{slot.clientName}</span>
                        <Star className="w-3 h-3 text-yellow-500 fill-current" />
                      </div>
                    </div>

                    {renderSessionActions(slot)}

                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#6366f1]/5 to-[#8b5cf6]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Selected Date Booked Sessions */}
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
              {selectedDateBookedSlots.filter(s => s.status !== "completed").length} active sessions
            </div>
          </div>

          {selectedDateBookedSlots.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] rounded-full flex items-center justify-center mx-auto mb-4 opacity-50">
                <Clock className="w-10 h-10 text-white" />
              </div>
              <p className="text-gray-400 text-lg">
                No booked sessions for this date
              </p>
              <p className="text-gray-500 text-sm mt-2">
                Sessions will appear here when clients book
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {selectedDateBookedSlots.map((slot, index) => (
                <div
                  key={slot._id}
                  id={`detail-slot-${slot._id}`}
                  className={`group flex items-center justify-between p-6 rounded-xl border bg-gradient-to-r from-[#2c2c2c] to-[#252525] border-[#3c3c3c] hover:border-[#6366f1] transition-all duration-500 hover:shadow-xl ${
                    isToday && isSlotStartingSoon(slot.startTime) && slot.status !== "completed"
                      ? "ring-2 ring-yellow-500/50"
                      : ""
                  } ${
                    isToday && isSessionOngoing(slot.startTime, slot.endTime) && slot.status !== "completed"
                      ? "ring-2 ring-green-500/50"
                      : ""
                  }`}
                  style={{
                    animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
                  }}
                >
                  <div className="flex items-center gap-6">
                    <div className={`p-3 rounded-lg ${
                      slot.status === "completed" 
                        ? "bg-gradient-to-r from-green-500 to-emerald-600"
                        : "bg-gradient-to-r from-blue-500 to-indigo-600"
                    }`}>
                      {slot.status === "completed" ? (
                        <CheckCircle className="w-6 h-6 text-white" />
                      ) : (
                        <UserCheck className="w-6 h-6 text-white" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-4 text-white mb-2">
                        <span className="font-semibold text-lg">
                          {formatTime(slot.startTime)} -{" "}
                          {formatTime(slot.endTime)}
                        </span>
                        {isToday && isSlotStartingSoon(slot.startTime) && slot.status !== "completed" && (
                          <span className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black text-xs px-3 py-1 rounded-full font-bold animate-pulse">
                            Starting Soon!
                          </span>
                        )}
                        {isToday && isSessionOngoing(slot.startTime, slot.endTime) && slot.status !== "completed" && (
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
                    <div className={`px-4 py-2 rounded-full text-sm font-medium ${
                      slot.status === "completed"
                        ? "bg-green-500/20 text-green-400"
                        : "bg-blue-500/20 text-blue-400"
                    }`}>
                      {slot.status === "completed" ? "Completed" : "Booked"}
                    </div>
                    {renderSessionActions(slot)}
                  </div>

                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#6366f1]/5 to-[#8b5cf6]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }

        html {
          scroll-behavior: smooth;
        }

        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: #1a1a1a;
        }

        ::-webkit-scrollbar-thumb {
          background: #6366f1;
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #8b5cf6;
        }
      `}</style>
    </div>
  );
};

export default SetAvailabilityPage;