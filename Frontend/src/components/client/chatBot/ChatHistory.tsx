import React, { useState, useEffect, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import ChatSidebar from './ChatSidebar';
import ChatHeader from './ChatHeader';
import Message from './Message';
import TypingIndicator from './TypingIndicator';
import MessageInput from './MessageInput';
import SuggestedQuestions from './SuggestedQuestions';
import WelcomeScreen from './WelcomeScreen';
import { ChatSession, Interaction } from './types';

const dummySessions: ChatSession[] = [
  {
    _id: 'session1',
    title: 'Weight Loss Journey',
    lastInteraction: 'How do I lose weight quickly?',
    createdAt: new Date().toISOString(),
    messageCount: 6,
  },
  // ... (other dummy sessions remain the same)
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
    // ... (other dummy interactions remain the same)
  ],
  // ... (other session interactions remain the same)
};

const ChatHistory: React.FC<{ clientId: string }> = ({ clientId }) => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [interactions, isTyping]);

  useEffect(() => {
    // TODO: Fetch sessions from backend
    // const fetchSessions = async () => {
    //   const response = await axios.get(`/api/clients/${clientId}/sessions`);
    //   setSessions(response.data);
    // };
    // fetchSessions();

    setSessions(dummySessions);
    handleNewChat(); // Start with a new chat on page load
  }, [clientId]);

  useEffect(() => {
    if (selectedSession) {
      // TODO: Fetch interactions for the session
      // const fetchInteractions = async () => {
      //   const response = await axios.get(`/api/sessions/${selectedSession}/interactions`);
      //   setInteractions(response.data);
      // };
      // fetchInteractions();

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
    setIsSidebarOpen(false);
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

    // TODO: Post message to backend
    // await axios.post(`/api/sessions/${selectedSession}/interactions`, userMessage);

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
        response: "This is a dummy response.", // Replace with getBotResponse in real app
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
    }, 1500);
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
      <div className="hidden md:block">
        <ChatSidebar
          sessions={sessions}
          selectedSession={selectedSession}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onNewChat={handleNewChat}
          onSelectSession={(id) => setSelectedSession(id)}
          onDeleteSession={handleDeleteSession}
        />
      </div>

      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsSidebarOpen(false)}></div>
          <div className="absolute left-0 top-0 bottom-0 w-80 bg-slate-900">
            <ChatSidebar
              sessions={sessions}
              selectedSession={selectedSession}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              onNewChat={handleNewChat}
              onSelectSession={(id) => {
                setSelectedSession(id);
                setIsSidebarOpen(false);
              }}
              onDeleteSession={handleDeleteSession}
            />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col h-screen">
        {selectedSession ? (
          <>
            <ChatHeader session={selectedSessionData} onNewChat={handleNewChat} setIsSidebarOpen={setIsSidebarOpen} />
            <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-full p-6 bg-slate-950">
                {/* TODO: Implement infinite scroll */}
                {/* onScroll={(e) => if (e.target.scrollTop < 100) loadMoreMessages()} */}
                <div className="space-y-6 max-w-4xl mx-auto pb-6">
                  {interactions.map((interaction) => (
                    <Message key={interaction._id} interaction={interaction} />
                  ))}
                  {isTyping && <TypingIndicator />}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
            </div>
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