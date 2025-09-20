import { ValidationUtil } from "@/utils/validation.util";

/**
 * Request DTOs for Client Trainer Controller
 * Input validation and transformation for client trainer endpoints
 */

// Get Available Trainers Request DTO
export interface GetAvailableTrainersRequestDTO {
  page: number;
  limit: number;
  search: string;
  specialty: string;
}

// Get Trainer By ID Request DTO
export interface GetTrainerByIdRequestDTO {
  id: string;
}

// Book Slot Request DTO
export interface BookSlotRequestDTO {
  sessionId: string;
}

// Cancel Session Request DTO
export interface CancelSessionRequestDTO {
  sessionId: string;
}

/**
 * Client Trainer DTO class for input validation
 * Handles validation and transformation of client trainer-related requests
 */
export class ClientTrainerDTO {
  /**
   * Validates and transforms get available trainers request
   */
  static validateGetAvailableTrainersRequest(query: Record<string, unknown>): GetAvailableTrainersRequestDTO {
    const page = query.page 
      ? ValidationUtil.validateRange(query.page, 'page', 1, 1000)
      : 1;
      
    const limit = query.limit 
      ? ValidationUtil.validateRange(query.limit, 'limit', 1, 100)
      : 10;
      
    const search = ValidationUtil.validateString(query.search, 'search', 100);
    const specialty = ValidationUtil.validateString(query.specialty, 'specialty', 100);

    return {
      page,
      limit,
      search,
      specialty,
    };
  }

  /**
   * Validates and transforms get trainer by ID request
   */
  static validateGetTrainerByIdRequest(params: Record<string, unknown>): GetTrainerByIdRequestDTO {
    const id = ValidationUtil.validateString(params.id, 'id', 50);

    return {
      id,
    };
  }

  /**
   * Validates and transforms book slot request
   */
  static validateBookSlotRequest(body: Record<string, unknown>): BookSlotRequestDTO {
    const sessionId = ValidationUtil.validateString(body.sessionId, 'sessionId', 50);

    return {
      sessionId,
    };
  }

  /**
   * Validates and transforms cancel session request
   */
  static validateCancelSessionRequest(params: Record<string, unknown>): CancelSessionRequestDTO {
    const sessionId = ValidationUtil.validateString(params.sessionId, 'sessionId', 50);

    return {
      sessionId,
    };
  }
}
