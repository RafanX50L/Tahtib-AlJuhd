var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { formatDate } from 'date-fns';
import { Types } from 'mongoose';
export class ChatService {
    constructor(_chatRepo) {
        this._chatRepo = _chatRepo;
    }
    getChatById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this._chatRepo.findById(new Types.ObjectId(id));
            const messages = result.messages.map((msg) => {
                return {
                    sender: msg.senderId,
                    text: msg.content,
                    date: formatDate(msg.timestamp, 'yyyy-MM-dd'),
                    time: formatDate(msg.timestamp, 'hh:mm a'),
                };
            });
            return messages;
        });
    }
    addMessage(chatId, senderId, content) {
        return __awaiter(this, void 0, void 0, function* () {
            // const message = {
            //   senderId: new Types.ObjectId(senderId),
            //   content,
            //   timestamp: new Date(),
            // };
            yield this._chatRepo.addMessage(chatId, senderId, content);
        });
    }
}
//# sourceMappingURL=Chat.service.js.map