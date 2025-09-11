import { Button } from "../../ui/button";
import { Settings, ChevronDown, ChevronUp, Activity, Calendar } from "lucide-react";

interface HeaderProps {
  totalBookedSlots: number;
  todayBookedSlots: Slot[];
  showWeeklyRules: boolean;
  setShowWeeklyRules: (value: boolean) => void;
}

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

const Header = ({ totalBookedSlots, todayBookedSlots, showWeeklyRules, setShowWeeklyRules }: HeaderProps) => {

  return (
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
                  {todayBookedSlots.filter((s) => s.status !== "completed").length} {" "}
                  Today
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
  );
};

export default Header;


