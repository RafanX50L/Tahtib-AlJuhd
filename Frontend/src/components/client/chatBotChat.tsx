import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Plus, 
  MessageSquare, 
  Calendar, 
  Trash2, 
  Send,
  Paperclip,
  Mic,
  Bot,
  User,
  Settings
} from 'lucide-react';

interface Interaction {
  _id: string;
  question: string;
  response: string;
  createdAt: string;
  isUser: boolean;
  isTyping?: boolean;
}

interface ChatSession {
  _id: string;
  lastInteraction: string;
  createdAt: string;
  title?: string;
  messageCount: number;
}

// Dummy data with proper user/bot message pairs
const dummySessions: ChatSession[] = [
  {
    _id: 'session1',
    title: 'Weight Loss Journey',
    lastInteraction: 'How do I lose weight quickly?',
    createdAt: new Date().toISOString(),
    messageCount: 6,
  },
  {
    _id: 'session2',
    title: 'Muscle Building Plan',
    lastInteraction: 'Best foods for muscle gain?',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    messageCount: 4,
  },
  {
    _id: 'session3',
    title: 'Cardio Routine',
    lastInteraction: 'How often should I do cardio?',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    messageCount: 3,
  },
];

const dummyInteractionsMap: Record<string, Interaction[]> = {
  session1: [
    {
      _id: 'u1',
      question: 'How do I lose weight quickly?',
      response: '',
      createdAt: new Date(Date.now() - 300000).toISOString(),
      isUser: true,
    },
    {
      _id: 'b1',
      question: '',
      response: 'Losing weight safely requires creating a calorie deficit through a combination of proper nutrition and regular exercise. Aim for 1-2 pounds per week for sustainable results. Focus on whole foods, stay hydrated, and get adequate sleep.',
      createdAt: new Date(Date.now() - 299000).toISOString(),
      isUser: false,
    },
    {
      _id: 'u2',
      question: 'Can I skip dinner?',
      response: '',
      createdAt: new Date(Date.now() - 200000).toISOString(),
      isUser: true,
    },
    {
      _id: 'b2',
      question: '',
      response: 'Skipping meals can actually backfire by slowing your metabolism and leading to overeating later. Instead, try smaller, balanced meals throughout the day. If you want to try intermittent fasting, do it safely with proper guidance.',
      createdAt: new Date(Date.now() - 199000).toISOString(),
      isUser: false,
    },
    {
      _id: 'u3',
      question: 'How much water should I drink daily?',
      response: '',
      createdAt: new Date(Date.now() - 100000).toISOString(),
      isUser: true,
    },
    {
      _id: 'b3',
      question: '',
      response: 'Aim for 8-10 glasses (64-80 oz) of water daily, more if you\'re active. Proper hydration supports metabolism, helps control hunger, and improves workout performance.',
      createdAt: new Date(Date.now() - 99000).toISOString(),
      isUser: false,
    },
  ],
  session2: [
    {
      _id: 'u4',
      question: 'Best foods for muscle gain?',
      response: '',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      isUser: true,
    },
    {
      _id: 'b4',
      question: '',
      response: 'Protein-rich foods are essential for muscle building. Include lean meats, eggs, fish, dairy, legumes, quinoa, and nuts in your diet. Aim for 1.6-2.2g protein per kg of body weight daily.',
      createdAt: new Date(Date.now() - 86399000).toISOString(),
      isUser: false,
    },
    {
      _id: 'u5',
      question: 'Should I take protein powder?',
      response: '',
      createdAt: new Date(Date.now() - 86300000).toISOString(),
      isUser: true,
    },
    {
      _id: 'b5',
      question: '',
      response: 'Protein powder can be helpful if you struggle to meet your protein needs through whole foods. Whey, casein, and plant-based options are all effective. Timing matters less than total daily intake.',
      createdAt: new Date(Date.now() - 86299000).toISOString(),
      isUser: false,
    },
  ],
  session3: [
    {
      _id: 'u6',
      question: 'How often should I do cardio?',
      response: '',
      createdAt: new Date(Date.now() - 172800000).toISOString(),
      isUser: true,
    },
    {
      _id: 'b6',
      question: '',
      response: 'For general health, aim for 150 minutes of moderate cardio or 75 minutes of vigorous cardio weekly. If your goal is fat loss, 3-5 sessions per week work well. Balance it with strength training for best results.',
      createdAt: new Date(Date.now() - 172799000).toISOString(),
      isUser: false,
    },
  ],
};

// Utility function to format time
const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60);
  
  if (diffInHours < 24) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else if (diffInHours < 48) {
    return 'Yesterday';
  } else {
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  }
};

// Bot response generator
const getBotResponse = (message: string): string => {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('weight') || lowerMessage.includes('lose')) {
    return "For healthy weight loss, focus on creating a moderate calorie deficit (300-500 calories/day) through a combination of diet and exercise. Aim to lose 1-2 pounds per week for sustainable results.";
  } else if (lowerMessage.includes('muscle') || lowerMessage.includes('build') || lowerMessage.includes('gain')) {
    return "Building muscle requires progressive resistance training, adequate protein (1.6-2.2g per kg body weight), and proper recovery. Focus on compound movements like squats, deadlifts, and bench press.";
  } else if (lowerMessage.includes('cardio') || lowerMessage.includes('running')) {
    return "For cardiovascular health, aim for 150 minutes of moderate or 75 minutes of vigorous cardio weekly. Start gradually and increase intensity over time. Mix different types like walking, cycling, and swimming.";
  } else if (lowerMessage.includes('diet') || lowerMessage.includes('nutrition') || lowerMessage.includes('eat')) {
    return "A balanced diet should include lean proteins, complex carbohydrates, healthy fats, and plenty of vegetables. Stay hydrated, eat regular meals, and consider your activity level when planning portions.";
  } else if (lowerMessage.includes('workout') || lowerMessage.includes('exercise')) {
    return "A well-rounded workout routine should include strength training 2-3 times per week, cardio 3-5 times per week, and flexibility work. Start with exercises that match your fitness level and progress gradually.";
  } else {
    return "That's a great question! I'm here to help you with all aspects of fitness, nutrition, and wellness. Could you provide a bit more detail about what specific area you'd like guidance on?";
  }
};

// Session Item Component
const SessionItem: React.FC<{
  session: ChatSession;
  isSelected: boolean;
  isHovered: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}> = ({ session, isSelected, isHovered, onSelect, onDelete, onMouseEnter, onMouseLeave }) => {
  return (
    <Card
      className={`cursor-pointer transition-all duration-200 group ${
        isSelected 
          ? 'bg-gradient-to-r from-violet-600/20 to-indigo-600/20 border-violet-500/50 shadow-lg shadow-violet-500/10' 
          : 'bg-slate-800/50 border-slate-700 hover:bg-slate-800 hover:border-slate-600'
      }`}
      onClick={() => onSelect(session._id)}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-medium text-white truncate">
                {session.title || 'Untitled Chat'}
              </h3>
              <Badge variant="secondary" className="text-xs bg-slate-700 text-slate-300">
                {session.messageCount}
              </Badge>
            </div>
            <p className="text-sm text-slate-400 truncate mb-2">
              {session.lastInteraction}
            </p>
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <Calendar className="w-3 h-3" />
              {formatTime(session.createdAt)}
            </div>
          </div>
          
          {isHovered && (
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                onClick={(e) => onDelete(session._id, e)}
                size="sm"
                variant="ghost"
                className="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-1 h-auto"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Sidebar Component
const Sidebar: React.FC<{
  sessions: ChatSession[];
  selectedSession: string | null;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onNewChat: () => void;
  onSelectSession: (id: string) => void;
  onDeleteSession: (id: string, e: React.MouseEvent) => void;
}> = ({ sessions, selectedSession, searchTerm, onSearchChange, onNewChat, onSelectSession, onDeleteSession }) => {
  const [hoveredSession, setHoveredSession] = useState<string | null>(null);

  const filteredSessions = sessions.filter(session =>
    session.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    session.lastInteraction.toLowerCase().includes(searchTerm.toLowerCase())
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
            className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-lg shadow-violet-500/25 transition-all duration-200"
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
            className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-400 focus:border-violet-500 focus:ring-violet-500/20"
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
              isHovered={hoveredSession === session._id}
              onSelect={onSelectSession}
              onDelete={onDeleteSession}
              onMouseEnter={() => setHoveredSession(session._id)}
              onMouseLeave={() => setHoveredSession(null)}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

// Message Component
const Message: React.FC<{ interaction: Interaction }> = ({ interaction }) => {
  const content = interaction.isUser ? interaction.question : interaction.response;
  
  return (
    <div className={`flex items-start gap-4 ${interaction.isUser ? 'flex-row-reverse' : ''}`}>
      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white shadow-lg ${
        interaction.isUser 
          ? 'bg-gradient-to-br from-emerald-600 to-teal-600 shadow-emerald-500/25'
          : 'bg-gradient-to-br from-violet-600 to-indigo-600 shadow-violet-500/25'
      }`}>
        {interaction.isUser ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
      </div>
      <div className="flex-1 max-w-[70%]">
        <Card className={`shadow-lg ${
          interaction.isUser 
            ? 'bg-gradient-to-br from-emerald-600 to-teal-600 border-0 text-white shadow-emerald-500/25'
            : 'bg-slate-800 border-slate-700 text-white'
        }`}>
          <CardContent className="p-4">
            {content}
          </CardContent>
        </Card>
        <div className={`text-xs text-slate-500 mt-1 ${interaction.isUser ? 'text-right' : ''}`}>
          {formatTime(interaction.createdAt)}
        </div>
      </div>
    </div>
  );
};

// Typing Indicator Component
const TypingIndicator: React.FC = () => (
  <div className="flex items-start gap-4">
    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-violet-500/25">
      <Bot className="w-5 h-5" />
    </div>
    <div className="flex-1 max-w-[70%]">
      <Card className="bg-slate-800 border-slate-700 text-white shadow-lg">
        <CardContent className="p-4">
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

// Chat Header Component
const ChatHeader: React.FC<{
  session: ChatSession | undefined;
  onNewChat: () => void;
}> = ({ session, onNewChat }) => (
  <header className="bg-slate-900 border-b border-slate-800 p-6 flex items-center justify-between shadow-sm flex-shrink-0">
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-violet-500/25">
        <Bot className="w-6 h-6" />
      </div>
      <div>
        <h2 className="text-xl font-semibold">
          {session?.title || 'FitBot Assistant'}
        </h2>
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          Online • Ready to help with your fitness journey
        </div>
      </div>
    </div>
    <div className="flex gap-2">
      <Button
        onClick={onNewChat}
        variant="outline"
        className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white border-0 hover:from-violet-700 hover:to-indigo-700 shadow-lg shadow-violet-500/25"
      >
        <Plus className="w-4 h-4 mr-2" />
        New Chat
      </Button>
      <Button
        variant="outline"
        className="border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-white"
      >
        <Settings className="w-4 h-4" />
      </Button>
    </div>
  </header>
);

// Message Input Component
const MessageInput: React.FC<{
  message: string;
  isTyping: boolean;
  onMessageChange: (message: string) => void;
  onSend: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
}> = ({ message, isTyping, onMessageChange, onSend, onKeyPress }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  return (
    <div className="p-6 border-t border-slate-800 bg-slate-900 flex-shrink-0">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-slate-800 border-slate-700 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-end gap-4">
              <div className="flex-1">
                <Textarea
                  ref={textareaRef}
                  value={message}
                  onChange={(e) => onMessageChange(e.target.value)}
                  onKeyPress={onKeyPress}
                  placeholder="Ask me anything about workouts, nutrition, or fitness..."
                  className="min-h-[60px] max-h-32 bg-transparent border-0 text-white text-base placeholder:text-slate-400 resize-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
                  rows={2}
                />
              </div>
              <div className="flex gap-2 pb-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-slate-400 hover:text-violet-400 hover:bg-violet-500/10"
                >
                  <Paperclip className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-slate-400 hover:text-violet-400 hover:bg-violet-500/10"
                >
                  <Mic className="w-4 h-4" />
                </Button>
                <Button
                  onClick={onSend}
                  disabled={!message.trim() || isTyping}
                  className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-lg shadow-violet-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Suggested Questions Component
const SuggestedQuestions: React.FC<{
  onQuestionSelect: (question: string) => void;
}> = ({ onQuestionSelect }) => {
  const suggestions = [
    'How many rest days should I take per week?',
    'Best exercises for building core strength?',
    'How can I improve my running endurance?',
    'What should I eat before a morning workout?',
  ];

  return (
    <div className="p-6 border-t border-slate-800 bg-slate-900 flex-shrink-0">
      <div className="max-w-4xl mx-auto">
        <h3 className="text-sm font-medium text-slate-400 mb-4 uppercase tracking-wide">
          Suggested Questions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {suggestions.map((suggestion, index) => (
            <Button
              key={index}
              variant="outline"
              onClick={() => onQuestionSelect(suggestion)}
              className="bg-slate-800 border-slate-700 text-white hover:bg-slate-700 hover:border-violet-500 transition-all text-left justify-start h-auto p-3 text-sm"
            >
              {suggestion}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

// Welcome Screen Component
const WelcomeScreen: React.FC<{
  onNewChat: () => void;
}> = ({ onNewChat }) => (
  <div className="flex-1 flex items-center justify-center bg-slate-950">
    <div className="text-center">
      <div className="w-20 h-20 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-full flex items-center justify-center text-white shadow-xl shadow-violet-500/25 mx-auto mb-6">
        <Bot className="w-10 h-10" />
      </div>
      <h2 className="text-2xl font-semibold text-white mb-2">Welcome to FitBot</h2>
      <p className="text-slate-400 mb-6 max-w-md mx-auto">
        Your AI-powered fitness assistant is ready to help you with workouts, nutrition advice, and wellness guidance. Start a conversation or select from your chat history.
      </p>
      <Button
        onClick={onNewChat}
        className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-lg shadow-violet-500/25"
      >
        <Plus className="w-4 h-4 mr-2" />
        Start New Chat
      </Button>
    </div>
  </div>
);

// Main Chat Application Component
const ChatHistory: React.FC<{ clientId: string }> = ({ clientId }) => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [interactions, isTyping]);

  useEffect(() => {
    setSessions(dummySessions);
    setSelectedSession(dummySessions[0]._id);
  }, [clientId]);

  useEffect(() => {
    if (selectedSession) {
      setInteractions(dummyInteractionsMap[selectedSession] || []);
    }
  }, [selectedSession]);

  const handleNewChat = () => {
    const newSessionId = `session${Date.now()}`;
    const newSession: ChatSession = {
      _id: newSessionId,
      title: 'New Chat',
      lastInteraction: 'Start a new conversation...',
      createdAt: new Date().toISOString(),
      messageCount: 0,
    };
    setSessions(prev => [newSession, ...prev]);
    setSelectedSession(newSessionId);
    setInteractions([]);
    dummyInteractionsMap[newSessionId] = [];
  };

  const handleDeleteSession = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSessions(prev => prev.filter(s => s._id !== sessionId));
    if (selectedSession === sessionId) {
      const remainingSessions = sessions.filter(s => s._id !== sessionId);
      setSelectedSession(remainingSessions[0]?._id || null);
    }
    delete dummyInteractionsMap[sessionId];
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !selectedSession) return;

    const userMessage: Interaction = {
      _id: `msg${Date.now()}`,
      question: message,
      response: '',
      createdAt: new Date().toISOString(),
      isUser: true,
    };

    setInteractions(prev => [...prev, userMessage]);
    dummyInteractionsMap[selectedSession] = [...(dummyInteractionsMap[selectedSession] || []), userMessage];
    
    setSessions(prev => prev.map(session => 
      session._id === selectedSession 
        ? { ...session, lastInteraction: message, messageCount: session.messageCount + 1 }
        : session
    ));

    const currentMessage = message;
    setMessage('');
    setIsTyping(true);

    setTimeout(() => {
      const botResponse: Interaction = {
        _id: `bot${Date.now()}`,
        question: '',
        response: getBotResponse(currentMessage),
        createdAt: new Date().toISOString(),
        isUser: false,
      };

      setInteractions(prev => [...prev, botResponse]);
      dummyInteractionsMap[selectedSession] = [...(dummyInteractionsMap[selectedSession] || []), botResponse];
      setIsTyping(false);

      setSessions(prev => prev.map(session => 
        session._id === selectedSession 
          ? { ...session, messageCount: session.messageCount + 1 }
          : session
      ));
    }, 1500 + Math.random() * 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const selectedSessionData = sessions.find(s => s._id === selectedSession);

  return (
    <div className="bg-slate-950 text-white h-screen flex overflow-hidden">
      <Sidebar
        sessions={sessions}
        selectedSession={selectedSession}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onNewChat={handleNewChat}
        onSelectSession={setSelectedSession}
        onDeleteSession={handleDeleteSession}
      />

      <div className="flex-1 flex flex-col h-screen">
       {selectedSession ? (
  <>
    <ChatHeader 
      session={selectedSessionData} 
      onNewChat={handleNewChat} 
    />

    <div className="flex-1 overflow-hidden">
      <ScrollArea className="h-full p-6 bg-slate-950">
        <div className="space-y-6 max-w-4xl mx-auto pb-6">
          {interactions.map((interaction) => (
            <Message key={interaction._id} interaction={interaction} />
          ))}
          {isTyping && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
    </div>

    {/* Always show MessageInput for selected session */}
    {interactions.length === 0 && !isTyping && (
      <SuggestedQuestions onQuestionSelect={setMessage} />
    )}
    <MessageInput
      message={message}
      isTyping={isTyping}
      onMessageChange={setMessage}
      onSend={handleSendMessage}
      onKeyPress={handleKeyPress}
    />
  </>
) : (
  <WelcomeScreen onNewChat={handleNewChat} />
)}
      </div>
    </div>
  );
};

export default ChatHistory;