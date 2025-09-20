import { ValidationUtil } from "@/utils/validation.util";

/**
 * Request DTOs for Chat Controller
 * Input validation and transformation for chat endpoints
 */

// Get Chat Request DTO
export interface GetChatRequestDTO {
  chatId: string;
}

/**
 * Chat DTO class for input validation
 * Handles validation and transformation of chat-related requests
 */
export class ChatDTO {
  /**
   * Validates and transforms get chat request
   */
  static validateGetChatRequest(params: Record<string, unknown>): GetChatRequestDTO {
    const chatId = ValidationUtil.validateString(params.chatId, 'chatId', 50);

    return {
      chatId,
    };
  }
}
