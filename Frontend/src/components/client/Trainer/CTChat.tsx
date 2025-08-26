import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import io from "socket.io-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { toast } from "sonner";
import { ClientService } from "@/services/implementation/clientServices";
import { useSocket } from "@/hooks/socketio";
import { chatEnum } from "@/lib/chat-enum";
import { cn } from "@/lib/utils";

interface Message {
  text: string;
  type: "sent" | "received";
  time: string;
  date: string;
  sender?: string;
}

interface Contract {
  chatId: string;
  trainerId: string;
  trainerName?: string;
}

interface ChatSectionProps {
  trainerName: string;
  trainerPhoto: string;
  contract: Contract | null;
}

const CTChatSection: React.FC<ChatSectionProps> = ({ trainerName, trainerPhoto, contract }) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const chatMessagesRef = useRef<HTMLDivElement>(null);
  const socket = useSocket();

  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (contract?.chatId && user?._id) {
      fetchMessages(contract.chatId);
      joinChatRoom(contract.chatId);
    }
    return () => {
      socket?.off("message");
    };
  }, [contract, user]);

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
        sender: user._id,
        receiver: contract.trainerId,
        role: 'trainer',
        text: `New message from ${user.name}`,
        category: "new_message",
      });
      setMessage("");
    }
  };

  return (
    <div className={cn(
      "w-full md:w-1/2 bg-gray-900 flex flex-col border-r md:border-r-0 border-gray-700 overflow-hidden",
      "h-[calc(100vh-12rem)] sm:h-[calc(100vh-8rem)] md:h-[calc(100vh-6rem)]"
    )}>
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-4 sm:p-6 border-b border-gray-700 flex items-center gap-4">
        <img
          src={trainerPhoto}
          alt={trainerName}
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-indigo-500"
        />
        <div>
          <h3 className="text-base sm:text-lg font-semibold">{trainerName || "Loading..."}</h3>
          <div className="flex items-center gap-2 text-emerald-500 text-xs sm:text-sm">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>

      <div
        ref={chatMessagesRef}
        className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-gray-900 to-gray-900/80 relative no-scrollbar"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(99,102,241,0.05)_0%,transparent_50%),radial-gradient(circle_at_80%_20%,rgba(236,72,153,0.05)_0%,transparent_50%)] pointer-events-none"></div>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={cn(
              "mb-4 sm:mb-6 z-10",
              msg.type === "sent" ? "flex justify-end" : "flex justify-start"
            )}
          >
            <div
              className={cn(
                "max-w-[80%] sm:max-w-[70%] p-3 sm:p-4 rounded-3xl shadow-md backdrop-blur",
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

      <div className="bg-gray-900 p-4 sm:p-6 border-t border-gray-700 flex gap-4 items-center flex-wrap">
        <Input
          className="flex-1 bg-gray-800 border-gray-700 rounded-full text-white placeholder-gray-400 text-sm sm:text-base"
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
  );
};

export default CTChatSection;