
import { IChatBotSessionRepository } from '@/core/interface/repositories/IChatBotSession.repository';
import { IChatBotInteractionRepository } from '@/core/interface/repositories/IChatBotInteraction.repository';
import { IChatBotSession } from '@/core/interface/model/IChatBotSession.model';
import { IChatBotnteraction } from '@/core/interface/model/IChatBotInteraction.model';
import { IChatBotService } from '@/core/interface/services/client/Iclient.ChatBot.service';
import generateChatBotResponse from '@/utils/ChatBot.gemini';
// If you have a separate plain interface, import it here,import { IChatBotnteraction } from '@/core/interface/model/IChatBotInteraction.model';

export class ChatBotService implements IChatBotService {

  constructor(
    private readonly _chatBotSessionRepo: IChatBotSessionRepository,
    private readonly _chatBotInteractionRepo: IChatBotInteractionRepository,
  ) {}

  async getSessions(clientId: string): Promise<IChatBotSession[]> {
    return this._chatBotSessionRepo.findByClientId(clientId);
  }

  async createSession(clientId: string, title?: string): Promise<IChatBotSession> {
    // const sessionId = uuidv4();
    const createdAt = new Date();
    const session: IChatBotSession = {
      // _id: sessionId,
      clientId,
      title,
      lastInteraction: 'Start a new conversation...',
      createdAt,
      messageCount: 0,
    } as IChatBotSession;
    return this._chatBotSessionRepo.create(session);
  }


  async deleteSession(sessionId: string): Promise<void> {
    await this._chatBotSessionRepo.delete(sessionId);
  }

  async getInteractions(sessionId: string): Promise<IChatBotnteraction[]> {
    return this._chatBotInteractionRepo.findBySessionId(sessionId);
  }

  async sendMessage(sessionId: string, message: string): Promise<IChatBotnteraction[]> {
    const now = new Date();

    const userInteraction: IChatBotnteraction = {
      sessionId,
      content: message,
      isUser: true,
      createdAt: now,
    } as IChatBotnteraction;
    const history = await this._chatBotInteractionRepo.findBySessionId(sessionId);
    const botResponse = await generateChatBotResponse(history,message);
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

    return [userInteraction, botInteraction];
  }

  private async getMessageCount(sessionId: string): Promise<number> {
    const interactions = await this._chatBotInteractionRepo.findBySessionId(sessionId);
    return interactions.length;
  }
}