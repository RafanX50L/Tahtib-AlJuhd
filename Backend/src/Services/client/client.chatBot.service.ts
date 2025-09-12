
import { IChatBotSessionRepository } from '@/core/interface/repositories/IChatBotSession.repository';
import { IChatBotInteractionRepository } from '@/core/interface/repositories/IChatBotInteraction.repository';
import { IChatBotSession } from '@/core/interface/model/IChatBotSession.model';
import { IChatBotnteraction } from '@/core/interface/model/IChatBotInteraction.model';
import { IChatBotService } from '@/core/interface/services/client/Iclient.ChatBot.service';
import generateChatBotResponse from '@/utils/ChatBot.gemini';
import { ChatBotDTO, IChatBotInteractionView, IChatBotSessionView } from '@/dtos/client/ChatBotDTO';

export class ChatBotService implements IChatBotService {

  constructor(
    private readonly _chatBotSessionRepo: IChatBotSessionRepository,
    private readonly _chatBotInteractionRepo: IChatBotInteractionRepository,
  ) {}

  async getSessions(clientId: string): Promise<IChatBotSessionView[]> {
    const result = await this._chatBotSessionRepo.findByClientId(clientId);
    return await ChatBotDTO.mapToChatSessionData(result);
  }

  async createSession(clientId: string, title?: string): Promise<IChatBotSessionView> {
    const createdAt = new Date();
    const session: IChatBotSession = {
      clientId,
      title,
      lastInteraction: 'Start a new conversation...',
      createdAt,
      messageCount: 0,
    } as IChatBotSession;
    const result = await this._chatBotSessionRepo.create(session);
    return {
      id: result._id.toString(),
      lastInteraction: result.lastInteraction,
      createdAt: result.createdAt.toISOString(),
      title: result.title || undefined,
      messageCount: result.messageCount,
    };
  }

  async deleteSession(sessionId: string): Promise<void> {
    await this._chatBotSessionRepo.delete(sessionId);
    return;
  }

  async getInteractions(sessionId: string): Promise<IChatBotInteractionView[]> {
    const result = await this._chatBotInteractionRepo.findBySessionId(sessionId);
    return await ChatBotDTO.mapToChatBotInteractionData(result);
  }

  async sendMessage(sessionId: string, message: string): Promise<IChatBotInteractionView[]> {
    const now = new Date();

    const userInteraction: IChatBotnteraction = {
      sessionId,
      content: message,
      isUser: true,
      createdAt: now,
    } as IChatBotnteraction;

    const history = await this._chatBotInteractionRepo.findBySessionId(sessionId);
    const botResponse = await generateChatBotResponse(history, message);

    const botInteraction: IChatBotnteraction = {
      sessionId,
      content: botResponse,
      isUser: false,
      createdAt: new Date(now.getTime() + 1000),
    } as IChatBotnteraction;

    await this._chatBotInteractionRepo.create(userInteraction);
    await this._chatBotInteractionRepo.create(botInteraction);

    await this._chatBotSessionRepo.update(sessionId, {
      lastInteraction: message,
      messageCount: await this.getMessageCount(sessionId) + 2,
    });

    return ChatBotDTO.mapToChatBotInteractionData([userInteraction, botInteraction]);
  }

  private async getMessageCount(sessionId: string): Promise<number> {
    const interactions = await this._chatBotInteractionRepo.findBySessionId(sessionId);
    return interactions.length;
  }
}