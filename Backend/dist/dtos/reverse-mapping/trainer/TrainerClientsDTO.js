"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrainerClientsDTO = void 0;
const validation_util_1 = require("../../../utils/validation.util");
/**
 * Trainer Clients DTO class for input validation
 * Handles validation and transformation of trainer client-related requests
 */
class TrainerClientsDTO {
    /**
     * Validates and transforms get clients request
     */
    static validateGetClientsRequest(query) {
        const trainerId = validation_util_1.ValidationUtil.validateString(query.trainerId, 'trainerId', 50);
        return {
            trainerId,
        };
    }
    /**
     * Validates and transforms get chat messages request
     */
    static validateGetChatMessagesRequest(params) {
        const chatId = validation_util_1.ValidationUtil.validateString(params.chatId, 'chatId', 50);
        return {
            chatId,
        };
    }
}
exports.TrainerClientsDTO = TrainerClientsDTO;
//# sourceMappingURL=TrainerClientsDTO.js.map