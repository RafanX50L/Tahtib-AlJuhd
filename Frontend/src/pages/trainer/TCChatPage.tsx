// TCChatPage.tsx - Updated main chat page
import Sidebar from "../../components/trainer/Sidebar";
import Header from "../../components/trainer/Header";
// import ChatInterface from "@/components/trainer/Clients/ChatInterface";

const TCChatPage = () => {
  return (
    <div className="min-h-screen flex font-sans bg-[#121212] text-[#ffffff]">
      <Sidebar />
      <main className="flex-1 ml-0 lg:ml-[280px] p-4 lg:p-8">
        <Header text="Chat" />
        <ChatInterface />
      </main>
    </div>
  );
};

export default TCChatPage;

import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { TrainerService } from "@/services/implementation/trainerServices";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { format, parse } from "date-fns";
import { useSocket } from "@/hooks/socketio";
import { RootState } from "@/store/store";
import { chatEnum } from "@/lib/chat-enum";
import { Search, Send } from "lucide-react";

interface Message {
  _id?: string;
  text: string;
  type: "sent" | "received";
  time: string;
  sender?: string;
}

interface Client {
  _id: string;
  name: string;
  photo: string;
  planName: string;
  startDate: string;
  endDate: string;
  sessionsRemaining: number;
  chatId: string;
  lastMessage?: string;
  lastMessageTime?: string;
}

interface ChatData {
  [chatId: string]: Message[];
}

// Helper function to parse "Today, HH:mm" or ISO string to Date object
const parseLastMessageTime = (timeString?: string): Date | null => {
  if (!timeString) return null;
  try {
    if (timeString.startsWith("Today,")) {
      const timePart = timeString.replace("Today,", "").trim();
      return parse(timePart, "p", new Date());
    }
    return new Date(timeString);
  } catch {
    return null;
  }
};

// Helper function to update client’s last message and time
const updateClientLastMessage = (
  clients: Client[],
  chatId: string,
  message: Message
): Client[] => {
  return clients.map(c =>
    c.chatId === chatId
      ? { ...c, lastMessage: message.text, lastMessageTime: message.time }
      : c
  );
};

const ChatInterface: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const socket = useSocket();

  // State management
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [message, setMessage] = useState("");
  const [chatData, setChatData] = useState<ChatData>({});
  const [loadingChats, setLoadingChats] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoadingClients, setIsLoadingClients] = useState(true);

  const chatMessagesRef = useRef<HTMLDivElement>(null);

  // Fetch clients on component mount
  useEffect(() => {
    fetchClients();
  }, [user]);

  // Socket setup
  useEffect(() => {
    if (socket && user?._id) {
      socket.on("connect", () => {
        console.log("Socket connected");
        clients.forEach(client => {
          socket.emit("joinChat", client.chatId);
        });
      });

      socket.on(chatEnum.receive, (msg: Message) => {
        console.log("Received message:", msg);

        // Skip processing if the message is from the current user (avoid echo)
        if (msg.sender === user._id) return;

        // Find client associated with the message
        const client = clients.find(c => c._id === msg.sender);

        if (client) {
          setChatData(prev => ({
            ...prev,
            [client.chatId]: [...(prev[client.chatId] || []), { ...msg, type: "received" }],
          }));

          // Update last message and time
          setClients(prev => updateClientLastMessage(prev, client.chatId, msg));
        }
      });

      return () => {
        socket?.off("connect");
        socket?.off(chatEnum.receive);
      };
    }
  }, [socket, user, clients]);

  // Auto scroll to bottom when messages change
  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [chatData, selectedClient]);

  const fetchClients = async () => {
    setIsLoadingClients(true);
    try {
      const response = await TrainerService.getClients(user?._id!);
      setClients(response.data || []);
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch clients");
    } finally {
      setIsLoadingClients(false);
    }
  };

  const fetchChatMessages = async (client: Client) => {
    if (chatData[client.chatId] && chatData[client.chatId].length > 0) {
      return;
    }

    setLoadingChats(prev => new Set(prev).add(client.chatId));

    try {
      const response = await TrainerService.getChatMessages(client.chatId);
      const messages = response.data.map((msg: Message) => ({
        ...msg,
        type: msg.sender === user?._id ? "sent" : "received",
      }));

      setChatData(prev => ({
        ...prev,
        [client.chatId]: messages,
      }));

      // Update lastMessage and lastMessageTime only if newer than current
      if (messages.length > 0) {
        const latestMessage = messages[messages.length - 1];
        const currentLastMessageTime = parseLastMessageTime(
          clients.find(c => c.chatId === client.chatId)?.lastMessageTime
        );
        const newMessageTime = parseLastMessageTime(latestMessage.time);

        if (
          !currentLastMessageTime ||
          (newMessageTime && newMessageTime > currentLastMessageTime)
        ) {
          setClients(prev => updateClientLastMessage(prev, client.chatId, latestMessage));
        }
      }
    } catch (error: any) {
      toast.error("Failed to fetch chat messages");
    } finally {
      setLoadingChats(prev => {
        const newSet = new Set(prev);
        newSet.delete(client.chatId);
        return newSet;
      });
    }
  };

  const handleClientSelect = (client: Client) => {
    setSelectedClient(client);
    fetchChatMessages(client);
  };

  const sendChatMessage = () => {
    if (message.trim() && selectedClient && user?._id && socket) {
      const time = format(new Date(), "p");
      const newMessage = {
        text: message,
        type: "sent" as const,
        time: `Today, ${time}`,
        sender: user._id,
        chatId: selectedClient.chatId,
      };

      setChatData(prev => ({
        ...prev,
        [selectedClient.chatId]: [...(prev[selectedClient.chatId] || []), newMessage],
      }));

      setClients(prev => updateClientLastMessage(prev, selectedClient.chatId, newMessage));

      socket.emit(chatEnum.sendMessage, {
        chatId: selectedClient.chatId,
        sender: user._id,
        text: message,
      });
     
      socket.emit(chatEnum.sendNotification, {
        sender: user._id,
        receiver: selectedClient._id,
        role: "client",
        text: `New message from ${user.name}`,
        category: "new_message",
      });
      setMessage("");
    }
  };

  // Filter and sort clients by most recent message
  const filteredClients = clients
    .filter(client => client.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      const timeA = parseLastMessageTime(a.lastMessageTime);
      const timeB = parseLastMessageTime(b.lastMessageTime);

      if (!timeA && !timeB) return 0; // Both have no messages
      if (!timeA) return 1; // No message for A, push to bottom
      if (!timeB) return -1; // No message for B, push to bottom
      return timeB.getTime() - timeA.getTime(); // Sort by most recent
    });

  const currentMessages = selectedClient ? chatData[selectedClient.chatId] || [] : [];

  return (
    <div className="flex h-[80vh] bg-[#1e1e1e] rounded-lg border border-gray-700 overflow-hidden">
      {/* Left Sidebar - Client List */}
      <div className="w-1/3 border-r border-gray-700 flex flex-col">
        {/* Search Header */}
        <div className="p-4 border-b border-gray-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              className="pl-10 bg-gray-800 border-gray-600 text-white placeholder-gray-400"
              placeholder="Search clients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Client List */}
        <div className="flex-1 overflow-y-auto">
          {isLoadingClients ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#6366f1]"></div>
            </div>
          ) : filteredClients.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <p>No clients found</p>
            </div>
          ) : (
            filteredClients.map((client) => (
              <div
                key={client._id}
                className={cn(
                  "p-4 border-b border-gray-700 cursor-pointer hover:bg-gray-800 transition-colors",
                  selectedClient?._id === client._id && "bg-gray-800"
                )}
                onClick={() => handleClientSelect(client)}
              >
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12 border-2 border-[#6366f1]">
                    <AvatarImage src={client.photo} alt={client.name} />
                    <AvatarFallback>{client.name[0] || "U"}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-white truncate">
                        {client.name}
                      </h3>
                      {client.lastMessageTime && (
                        <span className="text-xs text-gray-400">
                          {client.lastMessageTime}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-400 truncate">
                      {client.lastMessage || "No messages yet"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {client.planName} • {client.sessionsRemaining} sessions
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right Side - Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedClient ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-700 flex items-center gap-4 bg-gray-800">
              <Avatar className="w-10 h-10 border-2 border-[#6366f1]">
                <AvatarImage src={selectedClient.photo} alt={selectedClient.name} />
                <AvatarFallback>{selectedClient.name[0] || "U"}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-white">{selectedClient.name}</h3>
                <p className="text-sm text-gray-400">
                  {selectedClient.planName} • {selectedClient.sessionsRemaining} sessions remaining
                </p>
              </div>
            </div>

            {/* Messages Area */}
            <div
              ref={chatMessagesRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-900"
            >
              {loadingChats.has(selectedClient.chatId) ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#6366f1]"></div>
                </div>
              ) : currentMessages.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <p>No messages yet. Start a conversation!</p>
                </div>
              ) : (
                currentMessages.map((msg, index) => (
                  <div
                    key={index}
                    className={cn(
                      "flex",
                      msg.type === "sent" ? "justify-end" : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "p-3 rounded-lg max-w-[70%] break-words",
                        msg.type === "sent"
                          ? "bg-[#6366f1] text-white rounded-br-sm"
                          : "bg-gray-700 text-white rounded-bl-sm"
                      )}
                    >
                      <p className="mb-1">{msg.text}</p>
                      <p className="text-xs opacity-70">{msg.time}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-700 bg-gray-800">
              <div className="flex gap-2">
                <Input
                  className="flex-1 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  placeholder="Type your message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && sendChatMessage()}
                />
                <Button
                  className="bg-[#6366f1] hover:bg-[#818cf8] px-4"
                  onClick={sendChatMessage}
                  disabled={!message.trim()}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-900">
            <div className="text-center text-gray-400">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-700 flex items-center justify-center">
                <Search className="w-12 h-12" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Select a client to chat</h3>
              <p>Choose a client from the list to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// export default ChatInterface;