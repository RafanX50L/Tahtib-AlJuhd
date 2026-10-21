"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientChatBotDTO = void 0;
const validation_util_1 = require("../../../utils/validation.util");
/**
 * Client ChatBot DTO class for input validation
 * Handles validation and transformation of client chatbot-related requests
 */
class ClientChatBotDTO {
    /**
     * Validates and transforms create session request
     */
    static validateCreateSessionRequest(body) {
        const title = validation_util_1.ValidationUtil.validateString(body.title, 'title', 100);
        return {
            title,
        };
    }
    /**
     * Validates and transforms delete session request
     */
    static validateDeleteSessionRequest(params) {
        const sessionId = validation_util_1.ValidationUtil.validateString(params.sessionId, 'sessionId', 50);
        return {
            sessionId,
        };
    }
    /**
     * Validates and transforms get interactions request
     */
    static validateGetInteractionsRequest(params) {
        const sessionId = validation_util_1.ValidationUtil.validateString(params.sessionId, 'sessionId', 50);
        return {
            sessionId,
        };
    }
    /**
     * Validates and transforms send message request
     */
    static validateSendMessageRequest(body) {
        const message = validation_util_1.ValidationUtil.validateString(body.message, 'message', 1000);
        if (message.trim().length === 0) {
            throw new Error('Message cannot be empty');
        }
        return {
            message,
        };
    }
}
exports.ClientChatBotDTO = ClientChatBotDTO;
//# sourceMappingURL=ClientChatBotDTO.js.map