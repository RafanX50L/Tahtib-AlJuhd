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
import { ClientService } from '@/services/implementation/clientServices';
import { toast } from 'sonner';
import DeleteSessionModal from './DeleteSessionModal';

const dummySessions: ChatSession[] = [
  {
    _id: 'session1',
    title: 'Weight Loss Journey',
    lastInteraction: 'How do I lose weight quickly?',
    createdAt: new Date().toISOString(),
    messageCount: 6,
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
  ],
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
  const [deletionModal, setDeletionModal] = useState<{ isOpen: boolean; sessionId: string | null }>({ isOpen: false, sessionId: null });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [interactions, isTyping]);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await ClientService.getChatBotSessions();
        setSessions(response);
      } catch (error) {
        console.error("Failed to fetch sessions:", error);
        toast.error("Failed to load chat sessions");
      }
    };
    fetchSessions();
  }, [clientId]); // Only trigger when clientId changes

  useEffect(() => {
    if (selectedSession) {
      const fetchInteractions = async () => {
        try {
          const response = await ClientService.getChatBotInteractions(selectedSession);
          setInteractions(response);
        } catch (error) {
          console.error("Failed to fetch interactions:", error);
          toast.error("Failed to load interactions");
        }
      };
      fetchInteractions();
    } else {
      setInteractions([]);
    }
  }, [selectedSession]);

  const handleNewChat = async () => {
    try {
      const newSession = await ClientService.createChatBotSession(clientId, 'New Chat');
      setSessions((prev) => [newSession, ...prev]);
      setSelectedSession(newSession._id);
      setInteractions([]);
      setIsSidebarOpen(false);
    } catch (error) {
      console.error("Failed to create new chat session:", error);
      toast.error("Failed to create new chat session");
    }
  };

  const handleDeleteSession = (sessionId: string) => {
    setDeletionModal({ isOpen: true, sessionId });
  };

  const confirmDelete = async () => {
    if (!deletionModal.sessionId) return;
    try {
      const response = await ClientService.DeleteBotChat(deletionModal.sessionId);
      if (response) {
        // Update frontend state directly
        setSessions((prev) => prev.filter((s) => s._id !== deletionModal.sessionId));
        if (selectedSession === deletionModal.sessionId) {
          const remainingSessions = sessions.filter((s) => s._id !== deletionModal.sessionId);
          setSelectedSession(remainingSessions[0]?._id || null);
        }
        delete dummyInteractionsMap[deletionModal.sessionId];
        toast.success("Chat session deleted successfully");
      } else {
        toast.error("Failed to delete chat session");
      }
    } catch (error) {
      console.error("Failed to delete session:", error);
      toast.error("Failed to delete chat session");
    } finally {
      setDeletionModal({ isOpen: false, sessionId: null });
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !selectedSession) return;

    const userMessage: Interaction = {
      sessionId: selectedSession,
      content: message,
      isUser: true,
      createdAt: new Date().toISOString(),
    }as Interaction;

    try {
      setInteractions((prev) => [...prev, userMessage]);
      setSessions((prev) =>
        prev.map((session) =>
          session._id === selectedSession
            ? { ...session, lastInteraction: message, messageCount: session.messageCount + 1 }
            : session
        )
      );

      setMessage('');
      setIsTyping(true);

      const response = await ClientService.HandleSendMessageToChatBot(selectedSession, userMessage);
      const botResponse: Interaction = {
        sessionId: selectedSession,
        content: response[1].content,
        isUser: false,
        createdAt: new Date().toISOString(),
      } as Interaction;

      setInteractions((prev) => [...prev, botResponse]);
      setSessions((prev) =>
        prev.map((session) =>
          session._id === selectedSession
            ? { ...session, messageCount: session.messageCount + 1 }
            : session
        )
      );
      setIsTyping(false);
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message");
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const selectedSessionData = sessions.find((s) => s._id === selectedSession);

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
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
          <div className="absolute left-0 top-0 bottom-0 w-3/4 sm:w-2/3 max-w-[85vw] bg-slate-900">
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

      {deletionModal.isOpen && (
        <DeleteSessionModal
          isOpen={deletionModal.isOpen}
          onClose={() => setDeletionModal({ isOpen: false, sessionId: null })}
          onConfirm={confirmDelete}
          x={window.innerWidth / 2}
          y={window.innerHeight / 3}
        />
      )}

      <div className="flex-1 flex flex-col h-screen w-full">
        {selectedSession ? (
          <>
            <ChatHeader session={selectedSessionData} onNewChat={handleNewChat} setIsSidebarOpen={setIsSidebarOpen} />
            <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-full p-4 sm:p-6 bg-slate-950">
                <div className="space-y-4 sm:space-y-6 max-w-3xl mx-auto pb-6">
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