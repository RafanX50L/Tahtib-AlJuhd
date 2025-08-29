import React from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Search, Plus, MessageSquare } from "lucide-react";
import SessionItem from "./SessionItem";
import { IChatBotSessionView } from "@/interfaces/client/IChatBot";

interface ChatSidebarProps {
  sessions: IChatBotSessionView[];
  selectedSession: string | null;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onNewChat: () => void;
  onSelectSession: (id: string) => void;
  onDeleteSession: (id: string) => void;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  sessions,
  selectedSession,
  searchTerm,
  onSearchChange,
  onNewChat,
  onSelectSession,
  onDeleteSession,
}) => {
  const filteredSessions = sessions?.filter(
    (session) =>
      session.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.lastInteraction.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-shrink-0 w-full sm:w-56 md:w-64 lg:w-72 bg-slate-900 border-r border-slate-800 flex flex-col h-screen max-w-[90vw] md:max-w-[18rem]">
      <div className="p-2 sm:p-3 border-b border-slate-800 flex-shrink-0">
        {/* Header */}
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <h2 className="text-sm sm:text-base font-semibold flex items-center gap-1 text-white">
            <MessageSquare className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-violet-500" />
            FitBot Chats
          </h2>
          <Button
            onClick={onNewChat}
            size="sm"
            className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 p-1"
          >
            <Plus className="w-3 h-3" />
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-slate-400 w-3 h-3" />
          <Input
            type="text"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-7 bg-slate-800 border-slate-700 text-white text-xs h-7 sm:h-8"
          />
        </div>
      </div>

      {/* Sessions */}
      <ScrollArea className="flex-1 overflow-y-auto">
        <div className="space-y-0.5 px-1 sm:px-2">
          {filteredSessions.map((session) => (
            <SessionItem
              key={session.id}
              session={session}
              isSelected={selectedSession === session.id}
              onSelect={onSelectSession}
              onDelete={onDeleteSession}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ChatSidebar;