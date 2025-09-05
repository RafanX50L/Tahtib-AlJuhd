var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { HttpStatus } from '../../constants/status.constant';
export class ChatController {
    constructor(_chatService) {
        this._chatService = _chatService;
    }
    getChat(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { chatId } = req.params;
                const chat = yield this._chatService.getChatById(chatId);
                if (!chat)
                    throw new Error('Chat not found');
                res.status(HttpStatus.OK).json(chat);
            }
            catch (err) {
                next(err);
            }
        });
    }
    ;
}
//# sourceMappingURL=Chat.controller.js.map