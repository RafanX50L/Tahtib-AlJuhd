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
  
  // async create(session: ChatSession): Promise<ChatSession> {
  //   const newSession = new this.model(session);
  //   return await newSession.save();
  // }

  async delete(sessionId: string): Promise<void> {
    await this.model.deleteOne({ _id: sessionId }).exec();
  }

  // async update(sessionId: string, updates: Partial<ChatSession>): Promise<ChatSession | null> {
  //   return await this.model.findByIdAndUpdate(
  //     sessionId,
  //     { $set: updates },
  //     { new: true }
  //   ).exec();
  // }
}