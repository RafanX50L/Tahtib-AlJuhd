import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Bot } from 'lucide-react';

const TypingIndicator: React.FC = () => (
  <div className="flex items-start gap-3 sm:gap-4">
    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-violet-600 flex items-center justify-center text-white">
      <Bot className="w-4 h-4 sm:w-5 sm:h-5" />
    </div>
    <div className="flex-1 max-w-[85%] sm:max-w-[80%] md:max-w-[65%]">
      <Card className="bg-slate-800 border-slate-700 text-white">
        <CardContent className="p-3 sm:p-4">
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);

export default TypingIndicator;