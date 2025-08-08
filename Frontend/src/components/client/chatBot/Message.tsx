import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Bot, User } from 'lucide-react';
import { Interaction } from './types';

const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60);
  if (diffInHours < 24) return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  if (diffInHours < 48) return 'Yesterday';
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
};

interface MessageProps {
  interaction: Interaction;
}

const Message: React.FC<MessageProps> = ({ interaction }) => {
  const content = interaction.isUser ? interaction.question : interaction.response;

  return (
    <div className={`flex items-start gap-4 ${interaction.isUser ? 'flex-row-reverse' : ''}`}>
      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white shadow-lg ${
        interaction.isUser ? 'bg-emerald-600' : 'bg-violet-600'
      }`}>
        {interaction.isUser ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
      </div>
      <div className="flex-1 max-w-[90%] md:max-w-[70%]">
        <Card className={interaction.isUser ? 'bg-emerald-600 text-white border-0' : 'bg-slate-800 border-slate-700 text-white'}>
          <CardContent className="p-4">{content}</CardContent>
        </Card>
        <div className={`text-xs text-slate-500 mt-1 ${interaction.isUser ? 'text-right' : ''}`}>
          {formatTime(interaction.createdAt)}
        </div>
      </div>
    </div>
  );
};

export default Message;