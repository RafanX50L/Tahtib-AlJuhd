import { IChatRepository } from '@/core/interface/repositories/IChat.repository';
import { IChatMessage, IChatService } from '@/core/interface/services/shared/IChat.Service';
import { formatDate } from 'date-fns';
import { Types } from 'mongoose';

export class ChatService implements IChatService {

  constructor(
    private readonly _chatRepo: IChatRepository,
  ) {}

  async getChatById(id: string): Promise<IChatMessage[] | null> {
    const result = await this._chatRepo.findById(new Types.ObjectId(id));
    const messages = result.messages.map((msg)=>{
      return {
        sender:msg.senderId,
        text: msg.content,
        date: formatDate(msg.timestamp, 'yyyy-MM-dd'),
        time: formatDate(msg.timestamp, 'hh:mm a'),
      };
    });
    return messages;
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