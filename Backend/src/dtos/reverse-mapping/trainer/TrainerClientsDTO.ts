import { ValidationUtil, ValidationError } from "@/utils/validation.util";

/**
 * Request DTOs for Trainer Clients Controller
 * Input validation and transformation for trainer client management endpoints
 */

// Get Clients Request DTO
export interface GetClientsRequestDTO {
  trainerId: string;
}

// Get Chat Messages Request DTO
export interface GetChatMessagesRequestDTO {
  chatId: string;
}

/**
 * Trainer Clients DTO class for input validation
 * Handles validation and transformation of trainer client-related requests
 */
export class TrainerClientsDTO {
  /**
   * Validates and transforms get clients request
   */
  static validateGetClientsRequest(query: Record<string, unknown>): GetClientsRequestDTO {
    const trainerId = ValidationUtil.validateString(query.trainerId, 'trainerId', 50);

    return {
      trainerId,
    };
  }

  /**
   * Validates and transforms get chat messages request
   */
  static validateGetChatMessagesRequest(params: Record<string, unknown>): GetChatMessagesRequestDTO {
    const chatId = ValidationUtil.validateString(params.chatId, 'chatId', 50);

    return {
      chatId,
    };
  }
}
