import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { User, Clock, DollarSign, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { RootState } from "@/store/store";
import { TrainerService } from "@/services/implementation/trainerServices";
import { formatDate } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"


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

const sampleClients: Client[] = [
  {
    _id: "cl1",
    name: "Ali Mansour",
    planName: "Premium Plan",
    startDate: "2025-08-01T00:00:00Z",
    endDate: "2025-11-01T00:00:00Z",
    sessionsRemaining: 8,
    chatId: "chat001",
    lastMessage: "Looking forward to the next session!",
    lastMessageTime: "2025-08-13T14:30:00Z",
  },
  {
    _id: "cl2",
    name: "Sara Youssef",
    planName: "Standard Plan",
    startDate: "2025-07-15T00:00:00Z",
    endDate: "2025-10-15T00:00:00Z",
    sessionsRemaining: 4,
    chatId: "chat002",
    lastMessage: "Thanks for the feedback!",
    lastMessageTime: "2025-08-13T10:05:00Z",
  },
  {
    _id: "cl3",
    name: "Omar El-Deeb",
    planName: "Trial Plan",
    startDate: "2025-08-10T00:00:00Z",
    endDate: "2025-08-25T00:00:00Z",
    sessionsRemaining: 1,
    chatId: "chat003",
    lastMessage: "Can we reschedule?",
    lastMessageTime: "2025-08-12T18:20:00Z",
  },
  {
    _id: "cl4",
    name: "Nour Hassan",
    planName: "Premium Plan",
    startDate: "2025-06-01T00:00:00Z",
    endDate: "2025-09-01T00:00:00Z",
    sessionsRemaining: 0,
    chatId: "chat004",
    lastMessage: "Thanks for all your help!",
    lastMessageTime: "2025-08-11T08:45:00Z",
  },
  {
    _id: "cl5",
    name: "Karim Said",
    planName: "Standard Plan",
    startDate: "2025-07-01T00:00:00Z",
    endDate: "2025-10-01T00:00:00Z",
    sessionsRemaining: 6,
    chatId: "chat005",
    lastMessage: "See you tomorrow!",
    lastMessageTime: "2025-08-13T21:10:00Z",
  },
];

const TrainerClients: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user?._id || user.role !== "trainer") {
      toast.error("Unauthorized access");
      navigate("/login");
      return;
    }
    fetchClients();
  }, [user, navigate]);

  const fetchClients = async () => {
    setIsLoading(true);
    try {
      const response = await TrainerService.getClients(user?._id!);  
      setClients(response.data || []);
      // setClients(sampleClients);
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch clients");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChatWithClient = (client: Client) => {
    navigate(`/trainer/chat/${client._id}`, {
      state: { chatId: client.chatId, clientName: client.name, photo:client.photo },
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">My Clients</h1>
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6366f1]"></div>
        </div>
      ) : clients.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <User className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No clients yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {clients.map((client) => (
            <Card
              key={client._id}
              className="bg-[#1e1e1e] border-[#2c2c2c] cursor-pointer hover:bg-[#252525] transition-colors"
              onClick={() => handleChatWithClient(client)}
            >
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-white">
                  <Avatar className="w-10 h-10 border-2 border-[#6366f1]">
                    <AvatarImage src={client.photo} alt={user?.name} />
                    <AvatarFallback>
                      {client.name[0] || "U"}
                    </AvatarFallback>
                  </Avatar>

                  {client.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2 text-gray-300">
                  <DollarSign className="w-4 h-4" />
                  <span>Plan: {client.planName}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Calendar className="w-4 h-4" />
                  <span>
                    Period:{" "}
                    {formatDate(new Date(client.startDate), "MMM d, yyyy")} -{" "}
                    {formatDate(new Date(client.endDate), "MMM d, yyyy")}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Clock className="w-4 h-4" />
                  <span>Sessions Remaining: {client.sessionsRemaining}</span>
                </div>
                {client.lastMessage && (
                  <p className="text-sm text-gray-400 truncate">
                    {client.lastMessage}
                  </p>
                )}
                {client.lastMessageTime && (
                  <p className="text-xs text-gray-500">
                    {client.lastMessageTime}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default TrainerClients;
