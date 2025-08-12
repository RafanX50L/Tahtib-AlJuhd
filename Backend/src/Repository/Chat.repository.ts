import { IChat } from '@/core/interface/model/IChat';
import { IChatRepository } from '@/core/interface/repositories/IChat.repository';
import { BaseRepository } from './base.repository';
import { ChatModel } from '@/models/Chat.model';

export class ChatRepository extends BaseRepository<IChat> implements IChatRepository {

  constructor() {
    super(ChatModel);
  }
  // async create(chat: IChat): Promise<IChat> {
  //   const newChat = new ChatModel(chat);
  //   return await newChat.save();
  // }

  // async findById(id: string): Promise<IChat | null> {
  //   return await ChatModel.findById(id);
  // }

  async addMessage(chatId: string, message: IChat['messages'][0]): Promise<void> {
    await this.model.findByIdAndUpdate(chatId, { $push: { messages: message } });
  }
}