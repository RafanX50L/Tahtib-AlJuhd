import { IChat } from '@/core/interface/model/IChat';
import { IChatRepository } from '@/core/interface/repositories/IChat.repository';
import { IChatService } from '@/core/interface/services/shared/IChat.Service';
import { Types } from 'mongoose';

export class ChatService implements IChatService {

  constructor(
    private readonly _chatRepo: IChatRepository,
  ) {}

  async getChatById(id: string): Promise<IChat | null> {
    return await this._chatRepo.findById(new Types.ObjectId(id));
  }

  async addMessage(chatId: string, senderId: string, content: string): Promise<void> {
    // const message = {
    //   senderId: new Types.ObjectId(senderId),
    //   content,
    //   timestamp: new Date(),
    // };
    await this._chatRepo.addMessage(chatId, senderId, content);
  }
}