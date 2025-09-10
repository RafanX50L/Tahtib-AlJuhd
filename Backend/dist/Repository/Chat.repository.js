"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatRepository = void 0;
const base_repository_1 = require("./base.repository");
const Chat_model_1 = require("../models/Chat.model");
class ChatRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(Chat_model_1.ChatModel);
    }
    // async create(chat: IChat): Promise<IChat> {
    //   const newChat = new ChatModel(chat);
    //   return await newChat.save();
    // }
    // async findById(id: string): Promise<IChat | null> {
    //   return await ChatModel.findById(id);
    // }
    async addMessage(chatId, senderId, content) {
        const message = {
            senderId,
            content,
            timestamp: new Date(),
        };
        return this.model.findByIdAndUpdate(chatId, { $push: { messages: message } }, { new: true } // This ensures the updated doc is returned
        );
    }
}
exports.ChatRepository = ChatRepository;
//# sourceMappingURL=Chat.repository.js.map