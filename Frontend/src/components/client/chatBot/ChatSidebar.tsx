import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Search, Plus, MessageSquare } from 'lucide-react';
import SessionItem from './SessionItem';
import { ChatSession } from './types';

interface ChatSidebarProps {
  sessions: ChatSession[];
  selectedSession: string | null;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onNewChat: () => void;
  onSelectSession: (id: string) => void;
  onDeleteSession: (id: string, e: React.MouseEvent) => void;
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
  const filteredSessions = sessions.filter(session =>
    (session.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    session.lastInteraction.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="w-80 bg-slate-900 border-r border-slate-800 flex flex-col h-screen">
      <div className="p-6 border-b border-slate-800 flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-violet-500" />
            FitBot Chats
          </h2>
          <Button
            onClick={onNewChat}
            size="sm"
            className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 bg-slate-800 border-slate-700 text-white"
          />
        </div>
      </div>
      <ScrollArea className="flex-1 p-2">
        <div className="space-y-2">
          {filteredSessions.map((session) => (
            <SessionItem
              key={session._id}
              session={session}
              isSelected={selectedSession === session._id}
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