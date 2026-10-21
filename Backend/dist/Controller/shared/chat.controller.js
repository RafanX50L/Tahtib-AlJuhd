"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatController = void 0;
const ChatDTO_1 = require("../../dtos/reverse-mapping/shared/ChatDTO");
const controller_error_handler_util_1 = require("../../utils/controller-error-handler.util");
class ChatController {
    _chatService;
    constructor(_chatService) {
        this._chatService = _chatService;
    }
    async getChat(req, res, next) {
        try {
            // Validate and transform request parameters using DTO
            const validatedParams = ChatDTO_1.ChatDTO.validateGetChatRequest(req.params);
            const chat = await this._chatService.getChatById(validatedParams.chatId);
            if (!chat) {
                controller_error_handler_util_1.ControllerErrorHandler.handleNotFound(res, "Chat not found");
                return;
            }
            controller_error_handler_util_1.ControllerErrorHandler.handleSuccess(res, chat, "Chat retrieved successfully");
        }
        catch (err) {
            controller_error_handler_util_1.ControllerErrorHandler.handleError(err, res, next);
        }
    }
    ;
}
exports.ChatController = ChatController;
//# sourceMappingURL=Chat.controller.js.map