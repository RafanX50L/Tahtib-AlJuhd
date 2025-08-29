import { IChatBotnteraction } from "@/core/interface/model/IChatBotInteraction.model";
import { IChatBotSession } from "@/core/interface/model/IChatBotSession.model";
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

export class ChatBotDTO {
  /**
   * Map an array of IChatBotSession to an array of IChatBotSessionView
   */
  static async mapToChatSessionData(raw: IChatBotSession[]): Promise<IChatBotSessionView[]> {
    return raw.map((session) => ({
      id: session._id.toString(),
      lastInteraction: session.lastInteraction,
      createdAt: session.createdAt.toISOString(),
      title: session.title || undefined,
      messageCount: session.messageCount,
    }));
  }

  /**
   * Map an array of IChatBotnteraction to an array of IChatBotInteractionView
   */
  static async mapToChatBotInteractionData(raw: IChatBotnteraction[]): Promise<IChatBotInteractionView[]> {
    return raw.map((interaction) => ({
      id: interaction._id.toString(),
      content: interaction.content,
      createdAt: interaction.createdAt.toISOString(),
      isUser: interaction.isUser,
    }));
  }
}
