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

  async addMessage(chatId: string, senderId: string, content: string): Promise<IChat | null> {
    const message = {
      senderId,
      content,
      timestamp: new Date(),
    };
    return this.model.findByIdAndUpdate(
      chatId,
      { $push: { messages: message } },
      { new: true } // This ensures the updated doc is returned
    );
  }

}