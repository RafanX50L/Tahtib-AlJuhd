export interface IChatBotInteractionView {
  id?: string;
  content?: string;
  createdAt: string;
  isUser: boolean;
  isTyping?: boolean;
}

export interface IChatBotSessionView {
  id: string;
  lastInteraction: string;
  createdAt: string;
  title?: string;
  messageCount: number;
}