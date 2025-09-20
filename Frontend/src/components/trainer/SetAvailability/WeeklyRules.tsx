import  { useState } from "react";
import { TrainerService } from "../../../services/implementation/trainerServices";
import { Button } from "../../ui/button";
import { toast } from "sonner";
import { Settings, Plus, Trash2, Activity, Edit2 } from "lucide-react";

interface DayWindow {
  startTime: string;
  endTime: string;
}

interface WeeklyRulesPayload {
  weeklyRules: Record<string, DayWindow[]>;
  slotLength: number;
  bufferMinutes: number;
}

interface WeeklyRulesProps {
  userId: string | undefined;
  weeklyRules: WeeklyRulesPayload;
  setWeeklyRules: (rules: WeeklyRulesPayload) => void;
  showWeeklyRules: boolean;
  setShowWeeklyRules: (value: boolean) => void;
}

const WeeklyRules = ({ userId, weeklyRules, setWeeklyRules, showWeeklyRules, setShowWeeklyRules }: WeeklyRulesProps) => {
  const [isEditingRules, setIsEditingRules] = useState(false);

  const timeToMinutes = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const hasOverlap = (day: string, newWindow: DayWindow, excludeIndex?: number) => {
    const existingWindows = (weeklyRules.weeklyRules?.[day] || []).filter((_, idx) => idx !== excludeIndex);
    const newStart = timeToMinutes(newWindow.startTime);
    const newEnd = timeToMinutes(newWindow.endTime);

    if (newStart >= newEnd) return true;

    return existingWindows.some((window) => {
      const start = timeToMinutes(window.startTime);
      const end = timeToMinutes(window.endTime);
      return newStart < end && newEnd > start;
    });
  };

  const getDefaultWindow = (day: string): DayWindow => {
    const existingWindows = weeklyRules.weeklyRules?.[day] || [];
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
      const hours = Math.floor(minutes / 60).toString().padStart(2, "0");
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
      toast.error(`Cannot add window for ${day}: Time overlaps with existing window.`);
      return;
    }
    setWeeklyRules({
      ...weeklyRules,
      weeklyRules: {
        ...(weeklyRules.weeklyRules || {}),
        [day]: [ ...(weeklyRules.weeklyRules?.[day] || []), newWindow ],
      },
    });
    toast.success(`Added new time window for ${day}`);
  };

  const handleRemoveWindow = (day: string, index: number) => {
    setWeeklyRules({
      ...weeklyRules,
      weeklyRules: {
        ...(weeklyRules.weeklyRules || {}),
        [day]: (weeklyRules.weeklyRules?.[day] || []).filter((_, idx) => idx !== index),
      },
    });
    toast.success(`Removed time window for ${day}`);
  };

  const handleUpdateWindow = (day: string, index: number, field: "startTime" | "endTime", value: string) => {
    const updatedWindow = {
      ...((weeklyRules.weeklyRules?.[day] || [])[index] || {}),
      [field]: value,
    } as DayWindow;
    if (hasOverlap(day, updatedWindow, index)) {
      toast.error(`Cannot update time for ${day}: New time would cause an overlap.`);
      return;
    }
    setWeeklyRules({
      ...weeklyRules,
      weeklyRules: {
        ...(weeklyRules.weeklyRules || {}),
        [day]: (weeklyRules.weeklyRules?.[day] || []).map((window, idx) =>
          idx === index ? { ...window, [field]: value } : window
        ),
      },
    });
  };

  const saveWeeklyRules = async () => {
    if (!userId) return;
    try {
      await TrainerService.setWeeklyRules({
        trainerId: userId,
        rules: weeklyRules,
      });
      toast.success("Weekly rules saved successfully");
      setShowWeeklyRules(false);
      setIsEditingRules(false);
    } catch (error) {
      toast.error(`Failed to save weekly rules : ${error}`);
    }
  };

  const allDaysEmpty = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].every(
    (day) => (weeklyRules.weeklyRules?.[day] || []).length === 0
  );

  return (
    <div className={`transition-all duration-500 ease-in-out overflow-hidden ${showWeeklyRules ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"}`}>
      <div className="bg-[#1e1e1e] rounded-2xl border border-[#2c2c2c] p-6 shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] rounded-lg">
            <Settings className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-white">Weekly Availability Rules</h2>
        </div>

        {allDaysEmpty && (
          <div className="mb-6 p-4 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/20 rounded-lg">
                <Activity className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h3 className="text-amber-400 font-semibold mb-1">No Availability Set</h3>
                <p className="text-amber-300/80 text-sm">
                  You haven&apos;t set any weekly availability slots yet. Add time slots to allow clients to book sessions with you.
                </p>
              </div>
            </div>
            <div className="mt-3">
              <Button
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
                onClick={() => setIsEditingRules(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Availability Slots
              </Button>
            </div>
          </div>
        )}

        {isEditingRules ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day, index) => (
                <div
                  key={day}
                  className="bg-[#141414] border border-[#2c2c2c] rounded-xl p-4 hover:border-[#6366f1] transition-all duration-300"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="text-sm font-medium text-gray-300 mb-3">{day}</div>
                  {(weeklyRules.weeklyRules?.[day] || []).map((w: DayWindow, idx: number) => (
                    <div key={idx} className="flex gap-2 mb-2">
                      <input
                        type="time"
                        value={w.startTime}
                        onChange={(e) => handleUpdateWindow(day, idx, "startTime", e.target.value)}
                        className="flex-1 p-2 bg-[#2c2c2c] border border-[#3c3c3c] rounded-lg text-white focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1] transition-colors"
                      />
                      <input
                        type="time"
                        value={w.endTime}
                        onChange={(e) => handleUpdateWindow(day, idx, "endTime", e.target.value)}
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
                  ))}
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
                <span className="text-gray-300 text-sm font-medium">Slot Length (min)</span>
                <input
                  type="number"
                  min={15}
                  step={15}
                  value={weeklyRules.slotLength || 30}
                  onChange={(e) => setWeeklyRules({ ...weeklyRules, slotLength: Number(e.target.value) })}
                  className="w-20 p-2 bg-[#2c2c2c] border border-[#3c3c3c] rounded-lg text-white focus:border-[#6366f1]"
                />
              </div>
              <div className="flex items-center gap-3">
                <span className="text-gray-300 text-sm font-medium">Buffer (min)</span>
                <input
                  type="number"
                  min={0}
                  step={5}
                  value={weeklyRules.bufferMinutes || 0}
                  onChange={(e) => setWeeklyRules({ ...weeklyRules, bufferMinutes: Number(e.target.value) })}
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
        ) : weeklyRules.weeklyRules ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day, index) => (
                <div
                  key={day}
                  className="bg-[#141414] border border-[#2c2c2c] rounded-xl p-4 hover:border-[#6366f1] transition-all duration-300"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="text-sm font-medium text-gray-300 mb-3">{day}</div>
                  {(weeklyRules.weeklyRules?.[day] || []).length === 0 ? (
                    <div className="text-gray-500 text-sm">No availability set</div>
                  ) : (
                    (weeklyRules.weeklyRules?.[day] || []).map((w: DayWindow, idx: number) => (
                      <div key={idx} className="flex gap-2 mb-2">
                        <span className="flex-1 p-2 bg-[#2c2c2c] border border-[#3c3c3c] rounded-lg text-white">
                          {w.startTime} - {w.endTime}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-3">
                <span className="text-gray-300 text-sm font-medium">Slot Length (min)</span>
                <span className="p-2 bg-[#2c2c2c] border border-[#3c3c3c] rounded-lg text-white">
                  {weeklyRules.slotLength}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-gray-300 text-sm font-medium">Buffer (min)</span>
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
        ) : (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#6366f1] mx-auto mb-4"></div>
            <p className="text-gray-400 text-lg">Loading rules...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeeklyRules;


