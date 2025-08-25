import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Clock, User, Video, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, differenceInMinutes } from "date-fns";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { ClientService } from "@/services/implementation/clientServices";
import { useLocation } from "react-router-dom";
import { useSocket } from "@/hooks/socketio";
import { chatEnum } from "@/lib/chat-enum";

interface Session {
  _id: string;
  trainerId: string;
  clientId?: string | null;
  startTime: string;
  endTime: string;
  status: "free" | "booked" | "cancelled";
  meetingLink?: string;
  clientName?: string;
  type?: string; // Optional, as not provided in API response
  location?: string; // Optional, as not provided in API response
  duration?: string; // Computed from startTime and endTime
}

interface Contract {
  chatId: string;
  sessionsRemaining: number;
  trainerId: string;
  planName: string;
  trainerName?: string; // Optional, assuming it might be included
}

interface Message {
  text: string;
  type: "sent" | "received";
  time: string;
  date: string;
  sender?: string;
}

// const socket = io("http://localhost:5000"); // Adjust to your backend Socket.IO server URL

const CurrentTrainer: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [hasSessions, setHasSessions] = useState(true);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isMobileView, setIsMobileView] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const chatMessagesRef = useRef<HTMLDivElement>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [slots, setSlots] = useState<Session[]>([]);
  const [contract, setContract] = useState<Contract | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const [trainerName, setTrainerName] = useState("");
  const [trainerPhoto, setTrainerPhoto] = useState("");
  const socket = useSocket();

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 1024);
      if (window.innerWidth > 1024) {
        setShowSidebar(true);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (user?._id) {
      const trainername = queryParams.get("name");
      const trainerphoto = queryParams.get("photo");

      if (trainername) setTrainerName(trainername);
      if (trainerphoto) setTrainerPhoto(trainerphoto);

      console.log("nice", trainername, trainerphoto);

      fetchContract();
    }

    return () => {
      socket?.off("message");
    };
  }, [user]);

  // File: CCurrentTrainers.tsx
  useEffect(() => {
    if (contract?.chatId) {
      fetchMessages(contract.chatId);
      fetchSlots(selectedDate);
      joinChatRoom(contract.chatId);
    }
  }, [contract, selectedDate]);

  const joinChatRoom = (chatId: string) => {
    socket?.on("connect", () => {
      console.log("Socket connected, joining chat:", chatId);
      socket.emit("joinChat", chatId);
    });
    socket?.on(chatEnum.receive, (msg: Message) => {
      console.log(`Received message for chat ${contract?.chatId}:`, msg);
      if (msg.sender !== user?._id) {
        setMessages((prev) => [...prev, { ...msg, type: "received" }]);
      }
    });
  };

  const fetchContract = async () => {
    try {
      const response = await ClientService.getCurrentTrainerContract();
      setContract(response);
    } catch (error) {
      console.error("Error fetching contract:", error);
      toast.error("Failed to fetch contract data");
    }
  };

  const fetchMessages = async (chatId: string) => {
    try {
      const response = await ClientService.getCurrentTrainerMessages(chatId);
      setMessages(
        response.map((msg: Message) => ({
          ...msg,
          type: msg.sender === user?._id ? "sent" : "received",
        }))
      );
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Failed to fetch chat messages");
    }
  };

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
      // Map API response to Session interface
      const mappedSlots: Session[] = response.data.map((slot: any) => ({
        _id: slot._id,
        trainerId: slot.trainerId,
        clientId: slot.clientId,
        startTime: slot.startTime,
        endTime: slot.endTime,
        status: slot.status,
        meetingLink: slot.meetingLink,
        clientName: slot.clientName || undefined, // Adjust if API provides clientName
        type: slot.type || "Training Session", // Default type if not provided
        location: slot.location || "TBD", // Default location if not provided
        duration: `${differenceInMinutes(new Date(slot.endTime), new Date(slot.startTime))} min`, // Compute duration
      }));
      setSlots(mappedSlots);
      setHasSessions(mappedSlots.length > 0);
    } catch (error) {
      console.error("Error fetching slots:", error);
      toast.error("Failed to fetch slots");
    } finally {
      setIsLoading(false);
    }
  };

  // File: CCurrentTrainers.tsx
  const sendChatMessage = () => {
    if (message.trim() && contract?.chatId && user?._id && socket) {
      const time = format(new Date(), "p");
      const newMessage = {
        text: message,
        type: "sent" as const,
        time: `Today, ${time}`,
        sender: user._id,
      };
      setMessages((prev:any) => [...prev, newMessage]);
      socket.emit(chatEnum.sendMessage, {
        chatId: contract.chatId,
        sender: user._id,
        text: message,
      });
      socket.emit(chatEnum.sendNotification, {
        senderId: user._id,
        recipientId: contract.trainerId, // Assume clientId is available in contract
        message: `New message from ${user.name}`,
        type: "new_message",
      });
      setMessage("");
    }
  };

  const handleBookSlot = async (slotId: string) => {
    if (!user?._id) {
      toast.error("Please log in to book a slot");
      return;
    }
    if (contract?.sessionsRemaining! <= 0) {
      toast.error("No sessions remaining in your plan");
      return;
    }
    try {
      // Assume ClientService.bookSlot exists
      await ClientService.bookSlot(slotId, user._id);
      setSlots((prev) =>
        prev.map((s) =>
          s._id === slotId
            ? {
                ...s,
                status: "booked",
                clientId: user._id,
                clientName: user.name || "Client",
                meetingLink:
                  s.meetingLink ||
                  `room_${Math.random().toString().slice(2, 8)}`,
              }
            : s
        )
      );
      setContract((prev) =>
        prev ? { ...prev, sessionsRemaining: prev.sessionsRemaining - 1 } : prev
      );
      toast.success("Slot booked successfully");
    } catch (error: any) {
      console.error("Error booking slot:", error);
      toast.error(error.message || "Failed to book slot");
    }
  };

  const handleCancelBooking = async (slotId: string) => {
    if (!user?._id) {
      toast.error("Please log in to cancel a booking");
      return;
    }
    try {
      // Assume ClientService.cancelSlotBooking exists
      await ClientService.cancelSlotBooking(slotId);
      setSlots((prev) =>
        prev.map((s) =>
          s._id === slotId
            ? {
                ...s,
                status: "free",
                clientId: undefined,
                clientName: undefined,
              }
            : s
        )
      );
      setContract((prev) =>
        prev ? { ...prev, sessionsRemaining: prev.sessionsRemaining + 1 } : prev
      );
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
    return timeDiff > 0 && timeDiff <= 30 * 60 * 1000; // 30 minutes
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

  const todaySlots = slots.filter(
    (slot) =>
      new Date(slot.startTime).toDateString() === new Date().toDateString()
  );
  const selectedDateSlots = slots.filter(
    (slot) =>
      new Date(slot.startTime).toDateString() === selectedDate.toDateString()
  );
  const isToday = selectedDate.toDateString() === new Date().toDateString();

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Your Trainer: {trainerName}</h1>
            <p className="text-gray-400 mt-1">
              Sessions remaining: {contract?.sessionsRemaining || 0}
            </p>
          </div>
        </div>

        {/* Main Layout */}
        <div className="flex flex-col lg:flex-row gap-6 overflow-y-scroll">
          {/* Chat Section */}
          <div
            className={cn(
              "flex-1 bg-gray-900 flex flex-col border-r border-gray-700 overflow-y-auto scrollbar-hide",
              isMobileView && !showSidebar ? "h-screen" : "h-[60vh] lg:h-[80vh]"
            )}
          >
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 border-b border-gray-700 flex items-center gap-4">
              <img
                src={trainerPhoto as string}
                alt={contract?.trainerName || "Trainer"}
                className="w-12 h-12 rounded-full object-cover border-2 border-indigo-500"
              />
              <div>
                <h3 className="text-lg font-semibold">
                  {trainerName || "Loading..."}
                </h3>
                <div className="flex items-center gap-2 text-emerald-500 text-sm">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  {/* <span>Online now</span> */}
                </div>
              </div>
            </div>

            <div
              ref={chatMessagesRef}
              className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-gray-900 to-gray-900/80 relative scrollbar-hide"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(99,102,241,0.05)_0%,transparent_50%),radial-gradient(circle_at_80%_20%,rgba(236,72,153,0.05)_0%,transparent_50%)] pointer-events-none"></div>
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={cn(
                    "mb-6 z-10",
                    msg.type === "sent"
                      ? "flex justify-end"
                      : "flex justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[70%] p-4 rounded-3xl shadow-md backdrop-blur",
                      msg.type === "sent"
                        ? "bg-gradient-to-br from-indigo-500 to-indigo-400 text-white rounded-br-lg"
                        : "bg-gray-800 border border-gray-700 text-white rounded-bl-lg"
                    )}
                  >
                    <div dangerouslySetInnerHTML={{ __html: msg.text }} />
                    <div
                      className={cn(
                        "text-xs opacity-70 mt-2",
                        msg.type === "received" ? "text-left" : "text-right"
                      )}
                    >
                      {msg.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gray-900 p-6 border-t border-gray-700 flex gap-4 items-center flex-wrap">
              <Input
                className="flex-1 bg-gray-800 border-gray-700 rounded-full text-white placeholder-gray-400"
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendChatMessage()}
              />
              <Button
                className="bg-gradient-to-r from-indigo-500 to-indigo-400 text-white rounded-full"
                size="icon"
                onClick={sendChatMessage}
              >
                <i className="fas fa-paper-plane"></i>
              </Button>
            </div>
          </div>

          {/* Sessions Section */}
          <div
            className={cn(
              "w-full lg:w-[350px] bg-gray-950 border-t lg:border-t-0 lg:border-l border-gray-700 flex flex-col",
              isMobileView && !showSidebar && "hidden"
            )}
          >
            {/* Date Selector */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-800/80 p-4 border-b border-gray-700">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-[#6366f1]" />
                <h2 className="text-lg font-semibold">Select Date</h2>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <input
                  type="date"
                  value={format(selectedDate, "yyyy-MM-dd")}
                  onChange={(e) => setSelectedDate(new Date(e.target.value))}
                  className="p-3 bg-[#2c2c2c] border border-[#3c3c3c] rounded-md text-white focus:ring-2 focus:ring-[#6366f1] focus:outline-none"
                  min={format(new Date(), "yyyy-MM-dd")}
                />
                <div className="text-sm text-gray-400">
                  {isToday ? (
                    <span className="text-green-400">Today's sessions</span>
                  ) : (
                    <span>
                      Sessions for {format(selectedDate, "MMMM d, yyyy")}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Sessions List */}
            <div className="flex-1 p-4">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-[#6366f1]" />
                <h3 className="text-lg font-semibold">
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
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6366f1]"></div>
                </div>
              ) : selectedDateSlots.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No sessions scheduled for this date</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedDateSlots.map((slot) => (
                    <div
                      key={slot._id}
                      className={`p-4 rounded-lg border-2 ${getStatusColor(slot.status)} ${
                        isSlotStartingSoon(slot.startTime)
                          ? "ring-2 ring-yellow-500 ring-opacity-50"
                          : ""
                      }`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(slot.status)}
                          <span className="font-medium capitalize">
                            {slot.status}
                          </span>
                        </div>
                        {isSlotStartingSoon(slot.startTime) && (
                          <span className="bg-yellow-500 text-black text-xs px-2 py-1 rounded-full font-medium">
                            Starting Soon
                          </span>
                        )}
                      </div>
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-gray-300">
                          <Clock className="w-4 h-4" />
                          <span>{formatTime(slot.startTime)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-300">
                          <span>
                            {slot.type || "Training Session"} • {slot.duration}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-300">
                          <span>{slot.location || "TBD"}</span>
                        </div>
                        {slot.clientId && slot.clientName && (
                          <div className="flex items-center gap-2 text-gray-300">
                            <User className="w-4 h-4" />
                            <span>{slot.clientName}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {slot.status === "booked" &&
                          slot.clientId === user?._id && (
                            <>
                              <Button
                                size="sm"
                                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                                onClick={() =>
                                  window.open(
                                    `/room/${slot.meetingLink}`,
                                    "_blank"
                                  )
                                }
                              >
                                <Video className="w-4 h-4 mr-1" />
                                Join
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="flex-1 border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black"
                                onClick={() => handleCancelBooking(slot._id)}
                              >
                                Cancel
                              </Button>
                            </>
                          )}
                        {slot.status === "free" &&
                          contract?.sessionsRemaining! > 0 && (
                            <Button
                              size="sm"
                              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                              onClick={() => handleBookSlot(slot._id)}
                            >
                              Book
                            </Button>
                          )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentTrainer;
