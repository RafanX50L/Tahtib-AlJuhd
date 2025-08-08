export interface Interaction {
  _id: string;
  question: string;
  response: string;
  createdAt: string;
  isUser: boolean;
  isTyping?: boolean;
}

export interface ChatSession {
  _id: string;
  lastInteraction: string;
  createdAt: string;
  title?: string;
  messageCount: number;
}