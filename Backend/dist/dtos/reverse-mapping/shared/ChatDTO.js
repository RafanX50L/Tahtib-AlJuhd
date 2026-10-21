"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatDTO = void 0;
const validation_util_1 = require("../../../utils/validation.util");
/**
 * Chat DTO class for input validation
 * Handles validation and transformation of chat-related requests
 */
class ChatDTO {
    /**
     * Validates and transforms get chat request
     */
    static validateGetChatRequest(params) {
        const chatId = validation_util_1.ValidationUtil.validateString(params.chatId, 'chatId', 50);
        return {
            chatId,
        };
    }
}
exports.ChatDTO = ChatDTO;
//# sourceMappingURL=ChatDTO.js.map