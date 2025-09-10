"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatController = void 0;
const status_constant_1 = require("../../constants/status.constant");
class ChatController {
    _chatService;
    constructor(_chatService) {
        this._chatService = _chatService;
    }
    async getChat(req, res, next) {
        try {
            const { chatId } = req.params;
            const chat = await this._chatService.getChatById(chatId);
            if (!chat)
                throw new Error('Chat not found');
            res.status(status_constant_1.HttpStatus.OK).json(chat);
        }
        catch (err) {
            next(err);
        }
    }
    ;
}
exports.ChatController = ChatController;
//# sourceMappingURL=Chat.controller.js.map