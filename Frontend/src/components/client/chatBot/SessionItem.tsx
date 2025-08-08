import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Trash2 } from 'lucide-react';
import { ChatSession } from './types';

const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60);
  if (diffInHours < 24) return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  if (diffInHours < 48) return 'Yesterday';
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
};

interface SessionItemProps {
  session: ChatSession;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
}

const SessionItem: React.FC<SessionItemProps> = ({ session, isSelected, onSelect, onDelete }) => {
  return (
    <Card
      className={`cursor-pointer transition-all ${isSelected ? 'bg-violet-600/20 border-violet-500/50' : 'bg-slate-800/50 border-slate-700 hover:bg-slate-800'}`}
      onClick={() => onSelect(session._id)}
    >
      <CardContent className="p-4 flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-medium text-white truncate">{session.title || 'Untitled Chat'}</h3>
            <Badge variant="secondary" className="text-xs bg-slate-700 text-slate-300">
              {session.messageCount}
            </Badge>
          </div>
          <p className="text-sm text-slate-400 truncate mb-2">{session.lastInteraction}</p>
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <Calendar className="w-3 h-3" />
            {formatTime(session.createdAt)}
          </div>
        </div>
        <Button
          onClick={(e) => onDelete(session._id, e)}
          size="sm"
          variant="ghost"
          className="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-1 h-auto"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default SessionItem;