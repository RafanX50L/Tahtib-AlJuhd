import { BaseRepository } from "./base.repository";
import { ChatBotSessionModel } from "@/models/chatBotSession.model";
import { IChatBotSession } from "@/core/interface/model/IChatBotSession.model";
import { IChatBotSessionRepository } from "@/core/interface/repositories/IChatBotSession.repository";

export class ChatBotSessionRepository extends BaseRepository<IChatBotSession> implements IChatBotSessionRepository {
  constructor(){
    super(ChatBotSessionModel);
  }
  async findByClientId(clientId: string): Promise<IChatBotSession[]> {
    return await this.model.find({ clientId })
      .sort({ createdAt: -1 })
      .exec();
  }
  

  async delete(sessionId: string): Promise<void> {
    await this.model.deleteOne({ _id: sessionId }).exec();
  }
}