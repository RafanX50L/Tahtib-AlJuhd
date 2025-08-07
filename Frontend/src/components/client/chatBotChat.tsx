import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';

const ChatBotChat = () => {
  const messages = [
    {
      text: "Hi there! I'm FitBot, your AI workout assistant. How can I help you with your fitness journey today?",
      isUser: false,
      time: '10:02 AM',
    },
    { text: "I'm having trouble with my squat form. Any tips?", isUser: true, time: '10:03 AM' },
    {
      text: "Great question! For proper squat form:<br /><br />1. Keep feet shoulder-width apart<br />2. Maintain a straight back<br />3. Lower until thighs are parallel to floor<br />4. Push through heels to stand<br /><br />Would you like a video demonstration?",
      isUser: false,
      time: '10:03 AM',
    },
  ];

  return (
    <div className="bg-[#12151e] text-white min-h-screen flex flex-col">
      {/* Chat Header */}
      <header className="bg-gradient-to-r from-[#1e2235] to-[rgba(30,34,53,0.9)] border-b border-[#2a3042] p-6 flex items-center justify-between shadow-[0_2px_10px_rgba(0,0,0,0.1)]">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-[#5d5fef] to-[#7577f5] rounded-full flex items-center justify-center text-white text-lg shadow-[0_4px_12px_rgba(93,95,239,0.3)]">
            <i className="fas fa-robot"></i>
          </div>
          <div>
            <h2 className="text-xl font-semibold">FitBot</h2>
            <div className="flex items-center gap-2 text-sm text-[#a0a7b8]">
              <div className="w-2 h-2 bg-[#00d68f] rounded-full animate-pulse"></div>
              Online • Answers in seconds
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            className="bg-transparent border border-[#2a3042] text-[#a0a7b8] hover:bg-[#1e2235] hover:text-white hover:border-[#5d5fef] transition-all"
            title="Clear Chat"
          >
            <i className="fas fa-trash"></i>
          </Button>
          <Button
            className="bg-transparent border border-[#2a3042] text-[#a0a7b8] hover:bg-[#1e2235] hover:text-white hover:border-[#5d5fef] transition-all"
            title="Export Chat"
          >
            <i className="fas fa-download"></i>
          </Button>
          <Button
            className="bg-transparent border border-[#2a3042] text-[#a0a7b8] hover:bg-[#1e2235] hover:text-white hover:border-[#5d5fef] transition-all"
            title="Settings"
          >
            <i className="fas fa-cog"></i>
          </Button>
        </div>
      </header>

      {/* Chat Container */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Chat Messages */}
        <ScrollArea className="flex-1 p-4 flex flex-col gap-6">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex items-start gap-4 ${msg.isUser ? 'flex-row-reverse' : ''} animate-[fadeInUp_0.4s_ease-out]`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-white shadow-[0_2px_8px_rgba(0,0,0,0.15)] ${
                  msg.isUser
                    ? 'bg-gradient-to-br from-[#ff4757] to-[#ff6b77]'
                    : 'bg-gradient-to-br from-[#5d5fef] to-[#7577f5]'
                }`}
              >
                <i className={`fas fa-${msg.isUser ? 'user' : 'robot'}`}></i>
              </div>
              <div className="flex-1 max-w-[70%]">
                <div
                  className={`${
                    msg.isUser
                      ? 'bg-gradient-to-br from-[#5d5fef] to-[#7577f5] text-white border-[#5d5fef]'
                      : 'bg-[#1e2235] border-[#2a3042] text-white'
                  } border rounded-lg p-4 shadow-[0_2px_8 Dos-0.15s] transition-all duration-300 ease-in-out`}
                  // className="leading-relaxed mb-2"
                  dangerouslySetInnerHTML={{ __html: msg.text }}
                >
                </div>
                <div
                  className={`text-xs ${msg.isUser}` ? 'text-white/80 text-right' : 'text-[#a0a7b8]/80'}>
                  Today, {msg.time}
                </div>
              </div>
            </div>
          ))}
        </ScrollArea>

        {/* Suggested Questions */}
        <div className="p-4 border-t border-[#2a3042] bg-[#1e2235]">
          <div className="text-sm uppercase text-[#a0a7b8] mb-4">
            Suggested Questions
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              'How many rest days should I take?',
              'Best exercises for core strength',
              'How to improve my running endurance',
              'What should I eat before a workout?',
            ].map((suggestion, index) => (
              <Button
                key={index}
                className="bg-transparent border border-[#2a3042] text-white hover:bg-[#2a3042] hover:border-[#5d5fef] hover:transform hover:-translate-y-0.5 transition-all text-left text-sm"
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </div>

        {/* Chat Input */}
        <div className="p-4 border-t border-[#2a3042] bg-[#12151e]">
          <div className="flex items-center gap-4 bg-[#1e2235] border border-[#2a3042] rounded-lg p-3 focus-within:border-[#5d5fef] focus-within:shadow-[0_0_0_3px_rgba(93,95,239,0.1)] transition-all">
            <Textarea
              placeholder="Ask me anything about workouts, nutrition, or fitness..."
              className="flex-1 bg-transparent text-white text-base outline-none max-h-32 min-h-[20px] placeholder-[#a0a7b8]"
              rows={1}
            />
            <div className="flex gap-2">
              <Button
                className="bg-transparent text-[#a0a7b8] hover:text-[#5d5fef] hover:bg-[#5d5fef]/10 transition-all"
                title="Attach File"
              >
                <i className="fas fa-paperclip"></i>
              </Button>
              <Button
                className="bg-transparent text-[#a0a7b8] hover:text-[#5d5fef] hover:bg-[#5d5fef]/10 transition-all"
                title="Voice Message"
              >
                <i className="fas fa-microphone"></i>
              </Button>
              <Button
                className="bg-gradient-to-br from-[#5d5fef] to-[#7577f5] text-white rounded-lg p-2 hover:transform hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(93,95,239,0.4)] transition-all shadow-[0_2px_8px_rgba(93,95,239,0.3)]"
              >
                <i className="fas fa-paper-plane"></i>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBotChat;