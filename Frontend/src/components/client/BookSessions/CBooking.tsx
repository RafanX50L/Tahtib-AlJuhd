import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { AppDispatch, RootState } from "@/store/store";
import {
  fetchAvailability,
  bookSlot,
  setDate,
  setTrainer,
  setCalendlyLink,
} from "@/store/slices/schedulingSlice";
import { format, addDays, isSameDay, startOfDay } from "date-fns";
import { ClientService } from "@/services/implementation/clientServices";
import { formatTime12Hour, utcToLocalTime, getUserTimezone } from "@/utils/timezone.utils";
import {
  Calendar,
  Clock,
  Users,
  AlertCircle,
  Star,
  MapPin,
  Award,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
} from "lucide-react";
import { toast } from "sonner";
import { InlineWidget } from "react-calendly";
import { useSocket } from "@/hooks/socketio";
import { chatEnum } from "@/lib/chat-enum";
import BookingConfirmationModal from "./BookingConformationModal";
import { ICurrentTrainerContractView } from "@/interfaces/shared/contract";
import { ITrainerByIdView } from "@/interfaces/client/IClientTrainer";

export default function CBooking() {
  const socket = useSocket();
  const dispatch = useDispatch<AppDispatch>();
  const params = useParams();
  const { trainerId, dateISO, slots, loading, calendlyLink } = useSelector(
    (s: RootState) => s.scheduling
  );
  const authUser = useSelector((s: RootState) => s.auth.user);
  const [contract, setContract] = useState<ICurrentTrainerContractView>();
  const { user } = useSelector((s: RootState) => s.auth);
  const [contractLoading, setContractLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{
    time: string;
    duration: number;
  } | null>(null);
  const [trainerData, setTrainerData] = useState<ITrainerByIdView>();
  const [modalOpen, setModalOpen] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const isContractExpired =
    contract && new Date(contract.endDate) < new Date(dateISO);
  const today = new Date();

  // Generate date options for current and next week
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
  const startOfWeek = addDays(today, currentWeekOffset * 7);
  const weekDates = Array.from({ length: 7 }, (_, i) =>
    addDays(startOfWeek, i)
  );

  // Get user's timezone for display
  const userTimezone = getUserTimezone();

  useEffect(() => {
    const id = params.trainerId as string | undefined;
    if (id) dispatch(setTrainer(id));
  }, [params.trainerId, dispatch]);

  useEffect(() => {
    if (trainerId) dispatch(fetchAvailability({ trainerId, dateISO }));
  }, [trainerId, dateISO, dispatch]);

  useEffect(() => {
    (async () => {
      if (!trainerId) return;
      try {
        const data = await ClientService.getTrainerById(trainerId);
        setTrainerData(data);
        const link = data?.calendlyLink || data?.trainer?.calendlyLink;
        if (link) dispatch(setCalendlyLink(link));
      } catch (err: unknown) {
        const error = err as { message: string };
        toast.error(error.message);
      }
    })();
  }, [trainerId, dispatch]);

  useEffect(() => {
    const fetchContract = async () => {
      if (!authUser?._id) return;
      setContractLoading(true);
      try {
        const response = await ClientService.getCurrentTrainerContract();
        setContract(response);
      } catch (error) {
        console.error("Error fetching contract:", error);
      } finally {
        setContractLoading(false);
      }
    };
    fetchContract();
  }, [authUser?._id]);

  const onBook = async (time: string, duration: number) => {
    const clientId = authUser?._id as string | undefined;
    if (!trainerId || !clientId) return;

    if (!contract) {
      toast.error("No active plan found. Please purchase a plan first.");
      return;
    }

    if (contract.sessionsRemaining <= 0) {
      toast.error("No sessions remaining in your plan");
      return;
    }

    if (isContractExpired) {
      toast.error("Your plan has expired. Please renew your plan.");
      return;
    }

    setBookingLoading(true);
    const res = await dispatch(
      bookSlot({
        trainerId,
        clientId,
        date: dateISO,
        time,
        duration,
        contractId: contract.id,
      })
    );
    if (res.meta?.requestStatus === "fulfilled") {
      dispatch(fetchAvailability({ trainerId, dateISO }));
      setModalOpen(false);
      setContract((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          sessionsRemaining: prev.sessionsRemaining - 1,
        };
      });

      toast.success(
        "🎉 Session booked successfully! You'll receive a confirmation email soon."
      );
      socket?.emit(chatEnum.sendNotification, {
        sender: user?._id,
        receiver: trainerId,
        role: "trainer",
        text: `New Session Bookings by ${user?.name}`,
        category: "session_booked",
      });
    } else {
      console.error("Failed to book session. Please try again.");
    }
    setBookingLoading(false);
  };

  const handleSlotClick = (slot: { time: string; duration: number }) => {
    if (isContractExpired) {
      toast.error("Your plan has expired. Please renew your plan.");
      return;
    }
    setSelectedSlot(slot);
    setModalOpen(true);
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    dispatch(setDate(format(date, "yyyy-MM-dd")));
  };

  const getPlanStatusColor = () => {
    if (isContractExpired)
      return "from-[#FF4757]/20 to-[#FF6B7A]/20 border-[#FF4757]/30";
    if (contract && contract?.sessionsRemaining <= 2)
      return "from-[#FF9F43]/20 to-[#FFBB33]/20 border-[#FF9F43]/30";
    return "from-[#5D5FEF]/20 to-[#FF4757]/20 border-[#5D5FEF]/30";
  };

  const getPlanStatusIcon = () => {
    if (isContractExpired || (contract && contract?.sessionsRemaining <= 2))
      return AlertCircle;
    return Users;
  };

  const StatusIcon = getPlanStatusIcon();

  return (
    <div className="min-h-screen bg-[#12151E] text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Trainer & Plan Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Trainer Card */}
            {trainerData && (
              <div className="bg-gradient-to-br from-[#1E2235] to-[rgba(30,34,53,0.7)] border border-[#2A3042] rounded-2xl shadow-lg overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#5D5FEF] to-[#FF4757]"></div>
                <div className="relative">
                  {trainerData.photo && (
                    <div className="aspect-video bg-gradient-to-br from-[#5D5FEF] to-[#FF4757]">
                      <img
                        src={trainerData.photo}
                        alt={trainerData.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="absolute -bottom-8 left-6">
                    <div className="w-16 h-16 bg-[#1E2235] rounded-2xl p-1 shadow-lg border border-[#2A3042]">
                      <div className="w-full h-full bg-gradient-to-br from-[#5D5FEF] to-[#FF4757] rounded-xl flex items-center justify-center">
                        <Users className="h-8 w-8 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="pt-12 p-6">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {trainerData.name}
                  </h2>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-[#5D5FEF]" />
                      <span className="text-sm text-[#A0A7B8]">
                        {trainerData.Specialty?.join(", ")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-[#FF9F43]" />
                      <span className="text-sm text-[#A0A7B8]">
                        {trainerData.experience} years experience
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-[#00D68F]" />
                      <span className="text-sm text-[#A0A7B8]">
                        {trainerData.location}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Plan Status Card */}
            {contract && (
              <div
                className={`bg-gradient-to-r ${getPlanStatusColor()} rounded-2xl p-6 shadow-lg border backdrop-blur-sm`}
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#5D5FEF] to-[#FF4757]"></div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <StatusIcon className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">
                    Your Plan
                  </h3>
                </div>

                <div className="space-y-4">
                  <div className="bg-white/10 rounded-xl p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-white/70 text-sm">Plan Name</p>
                        <p className="text-white font-medium">
                          {contract.planName}
                        </p>
                      </div>
                      <div>
                        <p className="text-white/70 text-sm">Sessions Left</p>
                        <p className="text-white font-medium text-xl">
                          {contract.sessionsRemaining}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/10 rounded-xl p-4">
                    <p className="text-white/70 text-sm">Valid Until</p>
                    <p className="text-white font-medium">
                      {format(new Date(contract.endDate), "MMMM d, yyyy")}
                    </p>
                  </div>

                  {(contract.sessionsRemaining <= 2 || isContractExpired) && (
                    <div className="bg-white/20 rounded-xl p-4">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-white" />
                        <span className="text-white text-sm font-medium">
                          {isContractExpired
                            ? "Plan expired - please renew to book sessions"
                            : `Only ${contract.sessionsRemaining} session${contract.sessionsRemaining === 1 ? "" : "s"} remaining!`}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {!contract && !contractLoading && (
              <div className="bg-gradient-to-r from-[#FF9F43]/20 to-[#FFBB33]/20 border border-[#FF9F43]/30 rounded-2xl p-6 shadow-lg">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF9F43] to-[#FFBB33]"></div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#FF9F43]/20 rounded-full flex items-center justify-center">
                    <AlertCircle className="h-5 w-5 text-[#FF9F43]" />
                  </div>
                  <div>
                    <h3 className="font-medium text-[#FF9F43]">
                      No Active Plan
                    </h3>
                    <p className="text-sm text-[#A0A7B8]">
                      Purchase a plan to start booking sessions
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Booking Interface */}
          <div className="lg:col-span-2 space-y-6">
            {/* Calendly Widget */}
            {calendlyLink && (
              <div className="bg-gradient-to-br from-[#1E2235] to-[rgba(30,34,53,0.7)] border border-[#2A3042] rounded-2xl shadow-lg overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#5D5FEF] to-[#FF4757]"></div>
                <div className="p-6 border-b border-[#2A3042]">
                  <h3 className="text-lg font-semibold text-white">
                    Quick Booking with Calendly
                  </h3>
                </div>
                <InlineWidget
                  url={calendlyLink}
                  styles={{ height: "700px" }}
                  pageSettings={{
                    backgroundColor: "1E2235",
                    primaryColor: "5D5FEF",
                    textColor: "FFFFFF",
                  }}
                />
              </div>
            )}

            {/* Date Selection */}
            <div className="bg-gradient-to-br from-[#1E2235] to-[rgba(30,34,53,0.7)] border border-[#2A3042] rounded-2xl shadow-lg p-6">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#5D5FEF] to-[#FF4757]"></div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-[#5D5FEF] to-[#FF4757] rounded-full flex items-center justify-center">
                    <CalendarDays className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      Select Date
                    </h3>
                    <p className="text-sm text-[#A0A7B8]">
                      {format(startOfWeek, "MMM d")} -{" "}
                      {format(addDays(startOfWeek, 6), "MMM d, yyyy")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      setCurrentWeekOffset((prev) => Math.max(prev - 1, 0))
                    }
                    disabled={currentWeekOffset === 0}
                    className="p-2 rounded-lg hover:bg-[rgba(42,48,66,0.5)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4 text-[#A0A7B8]" />
                  </button>
                  <button
                    onClick={() => {
                      const maxWeeks = contract
                        ? Math.ceil(
                            (new Date(contract.endDate).getTime() -
                              today.getTime()) /
                              (7 * 24 * 60 * 60 * 1000)
                          )
                        : 12; // Default to 12 weeks if no contract
                      setCurrentWeekOffset((prev) =>
                        Math.min(prev + 1, maxWeeks)
                      );
                    }}
                    disabled={
                      contract
                        ? addDays(startOfWeek, 6) >= new Date(contract.endDate)
                        : currentWeekOffset >= 12
                    }
                    className="p-2 rounded-lg hover:bg-[rgba(42,48,66,0.5)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="h-4 w-4 text-[#A0A7B8]" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-2">
                {weekDates.map((date, index) => {
                  const isSelected = isSameDay(date, selectedDate);
                  const isToday = isSameDay(date, today);
                  const isPast = date < startOfDay(today);
                  const isAfterExpiration =
                    contract && date > new Date(contract.endDate);
                  const isDisabled = isPast || isAfterExpiration;

                  return (
                    <button
                      key={index}
                      onClick={() => !isDisabled && handleDateSelect(date)}
                      disabled={isDisabled}
                      className={`p-3 rounded-xl text-center transition-all ${
                        isDisabled
                          ? "opacity-30 cursor-not-allowed"
                          : isSelected
                            ? "bg-gradient-to-r from-[#5D5FEF] to-[#FF4757] text-white shadow-lg transform scale-105"
                            : isToday
                              ? "bg-[#5D5FEF]/20 text-[#5D5FEF] border border-[#5D5FEF]/30"
                              : "hover:bg-[rgba(42,48,66,0.5)] text-[#A0A7B8]"
                      }`}
                    >
                      <div className="text-xs font-medium">
                        {format(date, "EEE")}
                      </div>
                      <div className="text-sm font-semibold mt-1">
                        {format(date, "d")}
                      </div>
                      {isAfterExpiration && (
                        <div className="text-[10px] text-[#FF4757] mt-1">
                          Expired
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {contract && (
                <div className="mt-4 text-center">
                  <p className="text-xs text-[#A0A7B8]">
                    Plan expires on{" "}
                    {format(new Date(contract.endDate), "MMMM d, yyyy")}
                  </p>
                </div>
              )}
            </div>

            {/* Available Slots */}
            <div className="bg-gradient-to-br from-[#1E2235] to-[rgba(30,34,53,0.7)] border border-[#2A3042] rounded-2xl shadow-lg p-6">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#5D5FEF] to-[#FF4757]"></div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-[#00D68F] to-[#33DEAC] rounded-full flex items-center justify-center">
                    <Clock className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      Available Time Slots
                    </h3>
                    <p className="text-sm text-[#A0A7B8]">
                      {format(selectedDate, "EEEE, MMMM d")}
                    </p>
                  </div>
                </div>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 border-3 border-[#5D5FEF]/30 border-t-[#5D5FEF] rounded-full animate-spin"></div>
                    <span className="text-[#A0A7B8]">
                      Loading available slots...
                    </span>
                  </div>
                </div>
              ) : slots.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 text-[#2A3042] mx-auto mb-4" />
                  <p className="text-[#A0A7B8] text-lg">
                    No slots available for this date
                  </p>
                  <p className="text-[#2A3042] text-sm mt-2">
                    Try selecting a different date
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {slots.map((slot, index) => (
                    <button
                      key={`${slot.time}-${index}`}
                      onClick={() => handleSlotClick(slot)}
                      disabled={slot.isBooked || isContractExpired}
                      className={`group relative p-4 rounded-xl border-2 transition-all duration-200 ${
                        slot.isBooked || isContractExpired
                          ? "border-[#2A3042] bg-[rgba(42,48,66,0.3)] opacity-60 cursor-not-allowed"
                          : "border-[#2A3042] hover:border-[#5D5FEF] hover:bg-[#5D5FEF]/10 hover:scale-105 hover:shadow-lg"
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-lg font-semibold text-white mb-1">
                          {formatTime12Hour(slot.time)}
                        </div>
                        <div className="text-sm text-[#A0A7B8] mb-2">
                          {slot.duration} min
                        </div>
                        <div
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                            slot.isBooked
                              ? "bg-[#FF4757]/20 text-[#FF4757]"
                              : "bg-[#00D68F]/20 text-[#00D68F]"
                          }`}
                        >
                          <div
                            className={`w-2 h-2 rounded-full ${
                              slot.isBooked ? "bg-[#FF4757]" : "bg-[#00D68F]"
                            }`}
                          />
                          {slot.isBooked ? "Booked" : "Available"}
                        </div>
                      </div>

                      {!slot.isBooked && !isContractExpired && (
                        <div className="absolute inset-0 rounded-xl ring-0 group-hover:ring-2 ring-[#5D5FEF] transition-all duration-200 pointer-events-none" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Booking Confirmation Modal */}
        <BookingConfirmationModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onConfirm={() =>
            selectedSlot && onBook(selectedSlot.time, selectedSlot.duration)
          }
          selectedSlot={selectedSlot}
          dateISO={dateISO}
          trainerData={trainerData as ITrainerByIdView}
          contract={contract as ICurrentTrainerContractView}
          isContractExpired={isContractExpired as boolean}
          loading={bookingLoading}
        />
      </div>
    </div>
  );
}
