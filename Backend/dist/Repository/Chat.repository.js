var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { BaseRepository } from './base.repository';
import { ChatModel } from '../models/Chat.model';
export class ChatRepository extends BaseRepository {
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
    addMessage(chatId, senderId, content) {
        return __awaiter(this, void 0, void 0, function* () {
            const message = {
                senderId,
                content,
                timestamp: new Date(),
            };
            return this.model.findByIdAndUpdate(chatId, { $push: { messages: message } }, { new: true } // This ensures the updated doc is returned
            );
        });
    }
}
//# sourceMappingURL=Chat.repository.js.map