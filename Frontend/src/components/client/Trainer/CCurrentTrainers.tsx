import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface Session {
  time: string;
  type: string;
  location: string;
  duration: string;
}

const CurrentTrainer: React.FC = () => {
  const [hasSessions, setHasSessions] = useState(true);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<
    { text: string; type: 'sent' | 'received'; time: string }[]
  >([
    {
      text: "Hey there! Ready for our session tomorrow? I've prepared a special workout focusing on your strength goals.",
      type: 'received',
      time: 'Today, 10:30 AM',
    },
    // ... other initial messages
  ]);
  const [isRecording, setIsRecording] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const chatMessagesRef = useRef<HTMLDivElement>(null);

  const sampleSessions: Session[] = [
    {
      time: 'Tomorrow, 2:00 PM',
      type: 'Strength Training',
      location: 'Gym Floor A',
      duration: '60 min',
    },
    // ... other sessions
  ];

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 1024);
      if (window.innerWidth > 1024) {
        setShowSidebar(true);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [messages]);

  const toggleMobileView = () => {
    if (isMobileView) {
      setShowSidebar(!showSidebar);
    }
  };

  const sendChatMessage = () => {
    if (message.trim()) {
      const time = format(new Date(), 'p');
      setMessages([...messages, { text: message, type: 'sent', time: `Today, ${time}` }]);
      setMessage('');
      setTimeout(() => {
        const responses = [
          "Thanks for letting me know! I'll adjust our plan accordingly.",
          // ... other responses
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        setMessages((prev) => [
          ...prev,
          { text: randomResponse, type: 'received', time: `Today, ${format(new Date(), 'p')}` },
        ]);
      }, 1000 + Math.random() * 2000);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        const icon = file.type.startsWith('image/') ? 'fa-image' : file.type.startsWith('video/') ? 'fa-video' : 'fa-file';
        setMessages((prev) => [
          ...prev,
          {
            text: `<i class="fas ${icon} mr-2 text-indigo-500"></i>${file.name}`,
            type: 'sent',
            time: `Today, ${format(new Date(), 'p')}`,
          },
        ]);
      });
    }
  };

  const toggleVoiceRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      setTimeout(() => {
        setIsRecording(false);
        setMessages((prev) => [
          ...prev,
          {
            text: '<i class="fas fa-microphone mr-2 text-indigo-500"></i>Voice message (0:03)',
            type: 'sent',
            time: `Today, ${format(new Date(), 'p')}`,
          },
        ]);
      }, 3000);
    }
  };

  const handleSessionRequest = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement session request logic
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white overflow-x-hidden">
      <Button
        className={cn(
          'fixed top-4 left-4 z-50 bg-gray-900 border border-gray-700 rounded-lg p-3 text-indigo-500',
          'lg:hidden'
        )}
        onClick={toggleMobileView}
      >
        <i className="fas fa-bars"></i>
      </Button>

      <Button
        className={cn(
          'fixed bottom-5 right-5 z-50 bg-indigo-500 text-white rounded-full w-12 h-12',
          'lg:hidden flex items-center justify-center'
        )}
        onClick={toggleMobileView}
      >
        <i className={showSidebar ? 'fas fa-comments' : 'fas fa-user'}></i>
      </Button>

      <div className="flex min-h-screen flex-col lg:flex-row">
        <div
          className={cn(
            'flex-1 bg-gray-900 flex flex-col border-r border-gray-700',
            isMobileView && !showSidebar ? 'h-screen' : 'h-[60vh] lg:h-screen'
          )}
        >
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 border-b border-gray-700 flex items-center gap-4">
            <img
              src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
              alt="Alex Johnson"
              className="w-12 h-12 rounded-full object-cover border-2 border-indigo-500"
            />
            <div>
              <h3 className="text-lg font-semibold">Alex Johnson</h3>
              <div className="flex items-center gap-2 text-emerald-500 text-sm">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span>Online now</span>
              </div>
            </div>
            <div className="ml-auto flex gap-2">
              <Button variant="outline" size="icon" className="bg-gray-800 border-gray-700 text-gray-400">
                <i className="fas fa-phone"></i>
              </Button>
              <Button variant="outline" size="icon" className="bg-gray-800 border-gray-700 text-gray-400">
                <i className="fas fa-video"></i>
              </Button>
              <Button variant="outline" size="icon" className="bg-gray-800 border-gray-700 text-gray-400">
                <i className="fas fa-ellipsis-h"></i>
              </Button>
            </div>
          </div>

          <div
            ref={chatMessagesRef}
            className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-gray-900 to-gray-900/80 relative"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(99,102,241,0.05)_0%,transparent_50%),radial-gradient(circle_at_80%_20%,rgba(236,72,153,0.05)_0%,transparent_50%)] pointer-events-none"></div>
            {messages.map((msg, index) => (
              <div
                key={index}
                className={cn(
                  'mb-6 z-10',
                  msg.type === 'sent' ? 'flex justify-end' : 'flex justify-start'
                )}
              >
                <div
                  className={cn(
                    'max-w-[70%] p-4 rounded-3xl shadow-md backdrop-blur',
                    msg.type === 'sent'
                      ? 'bg-gradient-to-br from-indigo-500 to-indigo-400 text-white rounded-br-lg'
                      : 'bg-gray-800 border border-gray-700 text-white rounded-bl-lg'
                  )}
                >
                  <div dangerouslySetInnerHTML={{ __html: msg.text }} />
                  <div className={cn('text-xs opacity-70 mt-2', msg.type === 'received' ? 'text-left' : 'text-right')}>
                    {msg.time}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gray-900 p-6 border-t border-gray-700 flex gap-4 items-center flex-wrap">
            <Button variant="outline" size="icon" className="bg-gray-800 border-gray-700 text-gray-400">
              <input type="file" accept="image/*,video/*,.pdf,.doc,.docx" multiple className="hidden" onChange={handleFileUpload} />
              <i className="fas fa-paperclip"></i>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className={cn('bg-gray-800 border-gray-700 text-gray-400', isRecording && 'bg-pink-500 text-white')}
              onClick={toggleVoiceRecording}
            >
              <i className={isRecording ? 'fas fa-stop' : 'fas fa-microphone'}></i>
            </Button>
            <Input
              className="flex-1 bg-gray-800 border-gray-700 rounded-full text-white placeholder-gray-400"
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
            />
            <Button
              className="bg-gradient-to-r from-indigo-500 to-indigo-400 text-white rounded-full"
              size="icon"
              onClick={sendChatMessage}
            >
              <i className="fas fa-paper-plane"></i>
            </Button>
          </div>
        </div>

        <div
          className={cn(
            'w-full lg:w-[350px] bg-gray-950 border-t lg:border-t-0 lg:border-l border-gray-700 flex flex-col',
            isMobileView && !showSidebar && 'hidden'
          )}
        >
          <div className="bg-gradient-to-br from-gray-800 to-gray-800/80 p-4 border-b border-gray-700">
            <div className="flex items-center gap-4 mb-4">
              <img
                src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
                alt="Alex Johnson"
                className="w-16 h-16 rounded-full object-cover border-2 border-indigo-500"
              />
              <div>
                <h2 className="text-lg font-semibold">Alex Johnson</h2>
                <p className="text-sm text-gray-400">Strength & Conditioning</p>
                <div className="flex items-center gap-2 text-sm">
                  <div className="text-amber-500">
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star-half-alt"></i>
                  </div>
                  <span>4.8 (124 reviews)</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { number: '5+', label: 'Years Exp' },
                { number: '200+', label: 'Clients' },
                { number: '95%', label: 'Success' },
                { number: '24/7', label: 'Support' },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="text-center p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-lg"
                >
                  <span className="block text-lg font-semibold text-indigo-500">{stat.number}</span>
                  <span className="text-xs text-gray-400">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 p-4 bg-gray-950">
            <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
              <i className="fas fa-calendar-check"></i>
              Upcoming Sessions
            </h3>
            {hasSessions ? (
              <div className="space-y-4">
                {sampleSessions.map((session, index) => (
                  <div
                    key={index}
                    className="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:border-indigo-500 hover:-translate-y-0.5 transition-all"
                  >
                    <div className="font-semibold text-indigo-500">{session.time}</div>
                    <div className="text-sm text-gray-400">{`${session.type} • ${session.duration}`}</div>
                    <div className="text-sm text-gray-400 flex items-center gap-2">
                      <i className="fas fa-map-marker-alt"></i>
                      {session.location}
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button className="flex-1 bg-gradient-to-r from-indigo-500 to-indigo-400 text-white">
                        Join
                      </Button>
                      <Button variant="outline" className="flex-1 border-gray-700 text-gray-400">
                        Reschedule
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-8 text-gray-400">
                <i className="fas fa-calendar-plus text-4xl text-indigo-500 mb-4"></i>
                <h4 className="text-lg">No Upcoming Sessions</h4>
                <p>Schedule a session to get started!</p>
              </div>
            )}
          </div>

          {!hasSessions && (
            <div className="p-4 bg-gray-800 border-t border-gray-700">
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                <i className="fas fa-plus-circle"></i>
                Request Session
              </h3>
              <form onSubmit={handleSessionRequest} className="bg-black/30 p-4 rounded-lg">
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Session Type</label>
                  <Select>
                    <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="personal">Personal Training (60min)</SelectItem>
                      <SelectItem value="strength">Strength Training (45min)</SelectItem>
                      <SelectItem value="nutrition">Nutrition Coaching (30min)</SelectItem>
                      <SelectItem value="recovery">Recovery Session (45min)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Preferred Time</label>
                  <Select>
                    <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="morning">Morning (6AM-12PM)</SelectItem>
                      <SelectItem value="afternoon">Afternoon (12PM-6PM)</SelectItem>
                      <SelectItem value="evening">Evening (6PM-10PM)</SelectItem>
                      <SelectItem value="flexible">Flexible</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Notes (Optional)</label>
                  <Textarea
                    className="bg-gray-900 border-gray-700 text-white resize-y"
                    placeholder="Any specific preferences or requirements..."
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-400 text-white"
                >
                  <i className="fas fa-paper-plane mr-2"></i>
                  Send Request
                </Button>
              </form>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
        @keyframes typingDots {
          0%, 80%, 100% { transform: scale(0); opacity: 0.5; }
          40% { transform: scale(1); opacity: 1; }
        }
        .typing-dots {
          display: flex;
          gap: 4px;
          padding: 8px 0;
        }
        .typing-dots span {
          width: 8px;
          height: 8px;
          background: #9CA3AF;
          border-radius: 50%;
          animation: typingDots 1.4s infinite ease-in-out;
        }
        .typing-dots span:nth-child(1) { animation-delay: -0.32s; }
        .typing-dots span:nth-child(2) { animation-delay: -0.16s; }
      `}</style>
    </div>
  );
};

export default CurrentTrainer;