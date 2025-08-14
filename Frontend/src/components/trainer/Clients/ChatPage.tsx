import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { TrainerService } from '@/services/implementation/trainerServices';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useSocket } from '@/hooks/socketio';
import { RootState } from '@/store/store';

interface Message {
  text: string;
  type: 'sent' | 'received';
  time: string;
  senderId?: string;
}

const ChatPage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const location = useLocation();
  const { chatId, clientName, photo } = location.state as {
    chatId: string;
    clientName: string;
    photo: string;
  };
  const socket = useSocket();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const chatMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatId && socket && user?._id) {
      socket.emit('joinChat', chatId);
      fetchMessages();
      socket.on('message', (msg: Message) => {
        setMessages((prev) => [
          ...prev,
          { ...msg, type: msg.senderId === user._id ? 'sent' : 'received' },
        ]);
      });
    }
    return () => {
      socket?.off('message');
    };
  }, [chatId, socket, user]);

  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const response = await TrainerService.getChatMessages(chatId);
      setMessages(
        response.data.map((msg: Message) => ({
          ...msg,
          type: msg.senderId === user?._id ? 'sent' : 'received',
        }))
      );
    } catch (error: any) {
      toast.error('Failed to fetch chat messages');
    }
  };

  const sendChatMessage = () => {
    if (message.trim() && chatId && user?._id && socket) {
      const time = format(new Date(), 'p');
      const newMessage = {
        text: message,
        type: 'sent' as const,
        time: `Today, ${time}`,
        senderId: user._id,
      };
      setMessages([...messages, newMessage]);
      socket.emit('sendMessage', {
        chatId,
        senderId: user._id,
        text: message,
      });
      setMessage('');
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-white">Chat with {clientName}</h1>
      <div className="bg-gray-900 flex flex-col border border-gray-700 rounded-lg h-[60vh]">
        <div className="p-4 border-b border-gray-700 flex items-center gap-4">
          <Avatar className="w-10 h-10 border-2 border-[#6366f1]">
            <AvatarImage src={photo} alt={clientName} />
            <AvatarFallback>{clientName[0] || 'U'}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">{clientName}</h3>
            <p className="text-sm text-gray-400">Online</p>
          </div>
        </div>
        <div ref={chatMessagesRef} className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={cn('flex', msg.type === 'sent' ? 'justify-end' : 'justify-start')}
            >
              <div
                className={cn(
                  'p-3 rounded-lg max-w-[80%]',
                  msg.type === 'sent' ? 'bg-[#6366f1] text-white' : 'bg-gray-800 text-white'
                )}
              >
                {msg.text}
                <p className="text-xs opacity-70 mt-1">{msg.time}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 border-t border-gray-700 flex gap-2">
          <Input
            className="flex-1 bg-gray-800 border-gray-700 text-white"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
          />
          <Button
            className="bg-[#6366f1] hover:bg-[#818cf8]"
            onClick={sendChatMessage}
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;