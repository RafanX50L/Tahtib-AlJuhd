import { ValidationUtil } from "@/utils/validation.util";

/**
 * Request DTOs for Client ChatBot Controller
 * Input validation and transformation for client chatbot endpoints
 */

// Create Session Request DTO
export interface CreateSessionRequestDTO {
  title: string;
}

// Delete Session Request DTO
export interface DeleteSessionRequestDTO {
  sessionId: string;
}

// Get Interactions Request DTO
export interface GetInteractionsRequestDTO {
  sessionId: string;
}

// Send Message Request DTO
export interface SendMessageRequestDTO {
  message: string;
}

/**
 * Client ChatBot DTO class for input validation
 * Handles validation and transformation of client chatbot-related requests
 */
export class ClientChatBotDTO {
  /**
   * Validates and transforms create session request
   */
  static validateCreateSessionRequest(body: Record<string, unknown>): CreateSessionRequestDTO {
    const title = ValidationUtil.validateString(body.title, 'title', 100);

    return {
      title,
    };
  }

  /**
   * Validates and transforms delete session request
   */
  static validateDeleteSessionRequest(params: Record<string, unknown>): DeleteSessionRequestDTO {
    const sessionId = ValidationUtil.validateString(params.sessionId, 'sessionId', 50);

    return {
      sessionId,
    };
  }

  /**
   * Validates and transforms get interactions request
   */
  static validateGetInteractionsRequest(params: Record<string, unknown>): GetInteractionsRequestDTO {
    const sessionId = ValidationUtil.validateString(params.sessionId, 'sessionId', 50);

    return {
      sessionId,
    };
  }

  /**
   * Validates and transforms send message request
   */
  static validateSendMessageRequest(body: Record<string, unknown>): SendMessageRequestDTO {
    const message = ValidationUtil.validateString(body.message, 'message', 1000);

    if (message.trim().length === 0) {
      throw new Error('Message cannot be empty');
    }

    return {
      message,
    };
  }
}
