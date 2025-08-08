import React from 'react';
import { Button } from '@/components/ui/button';
import { Bot, Plus } from 'lucide-react';

interface WelcomeScreenProps {
  onNewChat: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onNewChat }) => (
  <div className="flex-1 flex items-center justify-center bg-slate-950">
    <div className="text-center">
      <div className="w-20 h-20 bg-violet-600 rounded-full flex items-center justify-center text-white mx-auto mb-6">
        <Bot className="w-10 h-10" />
      </div>
      <h2 className="text-2xl font-semibold text-white mb-2">Welcome to FitBot</h2>
      <p className="text-slate-400 mb-6 max-w-md mx-auto">
        Your AI-powered fitness assistant is ready to help you.
      </p>
      <Button onClick={onNewChat} className="bg-violet-600 hover:bg-violet-700">
        <Plus className="w-4 h-4 mr-2" />
        Start New Chat
      </Button>
    </div>
  </div>
);

export default WelcomeScreen;