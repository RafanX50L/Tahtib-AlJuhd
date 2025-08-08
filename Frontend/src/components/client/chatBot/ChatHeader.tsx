import React from 'react';
import { Button } from '@/components/ui/button';
import { Bot, Plus, Settings, MessageSquare } from 'lucide-react';
import { ChatSession } from './types';

interface ChatHeaderProps {
  session: ChatSession | undefined;
  onNewChat: () => void;
  setIsSidebarOpen: (open: boolean) => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ session, onNewChat, setIsSidebarOpen }) => (
  <header className="bg-slate-900 border-b border-slate-800 p-6 flex items-center justify-between flex-shrink-0">
    <div className="flex items-center gap-4">
      <Button
        variant="ghost"
        className="md:hidden text-slate-400 hover:text-white"
        onClick={() => setIsSidebarOpen(true)}
      >
        <MessageSquare className="w-5 h-5" />
      </Button>
      <div className="w-12 h-12 bg-violet-600 rounded-full flex items-center justify-center text-white">
        <Bot className="w-6 h-6" />
      </div>
      <div>
        <h2 className="text-xl font-semibold">{session?.title || 'FitBot Assistant'}</h2>
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          Online
        </div>
      </div>
    </div>
    <div className="flex gap-2">
      <Button onClick={onNewChat} variant="outline" className="bg-violet-600 text-white border-0 hover:bg-violet-700">
        <Plus className="w-4 h-4 mr-2" />
        New Chat
      </Button>
      <Button variant="outline" className="border-slate-700 text-slate-400 hover:bg-slate-800">
        <Settings className="w-4 h-4" />
      </Button>
    </div>
  </header>
);

export default ChatHeader;