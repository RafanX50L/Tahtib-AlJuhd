import { Calendar, MapPin } from "lucide-react";

interface DateSelectorProps {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  isToday: boolean;
}

const DateSelector = ({ selectedDate, setSelectedDate, isToday }: DateSelectorProps) => {
  return (
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
        />
        <div className="text-sm text-gray-400 flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          {isToday ? (
            <span className="text-green-400 font-medium">Today&apos;s booked sessions</span>
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
  );
};

export default DateSelector;


