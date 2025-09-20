import { IChatBotnteraction } from '@/core/interface/model/IChatBotInteraction.model';
import { BaseRepository } from './base.repository';
import { ChatBotInteractionModel } from '@/models/ChatBotInteraction.model';

export class ChatBotInteractionRepository extends BaseRepository<IChatBotnteraction> {
  constructor(){
    super(ChatBotInteractionModel);
  }
  async findBySessionId(sessionId: string): Promise<IChatBotnteraction[]> {
    return await this.model.find({ sessionId })
      .sort({ createdAt: 1 })
      .exec();
  }

  async create(interaction: IChatBotnteraction): Promise<IChatBotnteraction> {
    const newInteraction = new this.model(interaction);
    return await newInteraction.save();
  }
}