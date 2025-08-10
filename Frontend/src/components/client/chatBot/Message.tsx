import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Bot, User } from 'lucide-react';
import { Interaction } from './types';
import ReactMarkdown from 'react-markdown';

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
  const content = interaction.isUser ? interaction.content : interaction.content;

  return (
    <div className={`flex items-start gap-3 sm:gap-4 ${interaction.isUser ? 'flex-row-reverse' : ''}`}>
      <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white shadow-lg ${
        interaction.isUser ? 'bg-emerald-600' : 'bg-violet-600'
      }`}>
        {interaction.isUser ? <User className="w-4 h-4 sm:w-5 sm:h-5" /> : <Bot className="w-4 h-4 sm:w-5 sm:h-5" />}
      </div>
      <div className="flex-1 max-w-[85%] sm:max-w-[80%] md:max-w-[65%]">
        <Card className={interaction.isUser ? 'bg-emerald-600 text-white border-0' : 'bg-slate-800 border-slate-700 text-white'}>
      <CardContent className="p-3 sm:p-4">
        {/*
          Use ReactMarkdown to render the content.
          It will convert the Markdown into proper HTML elements (h1, h2, ul, etc.).
        */}
        <ReactMarkdown>{content}</ReactMarkdown>
      </CardContent>
    </Card>
        <div className={`text-xs text-slate-500 mt-1 ${interaction.isUser ? 'text-right' : ''}`}>
          {formatTime(interaction.createdAt)}
        </div>
      </div>
    </div>
  );
};

export default Message;