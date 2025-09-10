"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
const date_fns_1 = require("date-fns");
const mongoose_1 = require("mongoose");
class ChatService {
    _chatRepo;
    constructor(_chatRepo) {
        this._chatRepo = _chatRepo;
    }
    async getChatById(id) {
        const result = await this._chatRepo.findById(new mongoose_1.Types.ObjectId(id));
        const messages = result.messages.map((msg) => {
            return {
                sender: msg.senderId,
                text: msg.content,
                date: (0, date_fns_1.formatDate)(msg.timestamp, 'yyyy-MM-dd'),
                time: (0, date_fns_1.formatDate)(msg.timestamp, 'hh:mm a'),
            };
        });
        return messages;
    }
    async addMessage(chatId, senderId, content) {
        // const message = {
        //   senderId: new Types.ObjectId(senderId),
        //   content,
        //   timestamp: new Date(),
        // };
        await this._chatRepo.addMessage(chatId, senderId, content);
    }
}
exports.ChatService = ChatService;
//# sourceMappingURL=Chat.service.js.map