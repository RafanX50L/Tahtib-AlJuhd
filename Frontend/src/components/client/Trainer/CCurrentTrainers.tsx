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
import BookingCalendar from "@/components/client/Trainer/BookingCalendar";

interface Session {
  _id: string;
  trainerId: string;
  clientId?: string | null;
  startTime: string;
  endTime: string;
  status: "free" | "booked" | "cancelled";
  meetingLink?: string;
  clientName?: string;
  type?: string;
  location?: string;
  duration?: string;
}

interface Contract {
  chatId: string;
  sessionsRemaining: number;
  trainerId: string;
  planName: string;
  trainerName?: string;
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

      fetchContract();
    }

    return () => {
      socket?.off("message");
    };
  }, [user]);

  useEffect(() => {
    if (contract?.chatId) {
      fetchMessages(contract.chatId);
    }
  }, [contract]);

  const joinChatRoom = (chatId: string) => {
    socket?.on("connect", () => {
      socket.emit("joinChat", chatId);
    });
    socket?.on(chatEnum.receive, (msg: Message) => {
      if (msg.sender !== user?._id) {
        setMessages((prev) => [...prev, { ...msg, type: "received" }]);
      }
    });
  };

  const fetchContract = async () => {
    try {
      const response = await ClientService.getCurrentTrainerContract();
      setContract(response);
      if (response?.chatId) joinChatRoom(response.chatId);
    } catch (error) {
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
      toast.error("Failed to fetch chat messages");
    }
  };

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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Your Trainer: {trainerName}</h1>
            <p className="text-gray-400 mt-1">
              Sessions remaining: {contract?.sessionsRemaining || 0}
            </p>
          </div>
        </div>

        {/* Booking Calendar with real trainerId */}
        {contract?.trainerId && (
          <BookingCalendar trainerId={contract.trainerId} />
        )}
      </div>
    </div>
  );
};

export default CurrentTrainer;
