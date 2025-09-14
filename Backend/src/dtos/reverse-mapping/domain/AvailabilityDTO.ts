import { ValidationUtil } from "@/utils/validation.util";

/**
 * Request DTOs for Availability Controller
 * Input validation and transformation for availability endpoints
 */

// Get Free Slots Request DTO
export interface GetFreeSlotsRequestDTO {
  trainerId: string;
  fromDate: string;
  toDate: string;
}

// Get UnFree Slots Request DTO
export interface GetUnFreeSlotsRequestDTO {
  trainerId: string;
  fromDate: string;
  toDate: string;
}

// Set Weekly Rules Request DTO
export interface SetWeeklyRulesRequestDTO {
  trainerId: string;
  rules: Record<string, unknown>;
}

// Get Weekly Rules Request DTO
export interface GetWeeklyRulesRequestDTO {
  trainerId: string;
}

/**
 * Availability DTO class for input validation
 * Handles validation and transformation of availability-related requests
 */
export class AvailabilityDTO {
  /**
   * Validates and transforms get free slots request
   */
  static validateGetFreeSlotsRequest(query: Record<string, unknown>): GetFreeSlotsRequestDTO {
    const trainerId = ValidationUtil.validateString(query.trainerId, 'trainerId', 50);
    const fromDate = ValidationUtil.validateString(query.fromDate, 'fromDate', 50);
    const toDate = ValidationUtil.validateString(query.toDate, 'toDate', 50);

    // Validate date formats
    const fromDateObj = new Date(fromDate);
    const toDateObj = new Date(toDate);
    
    if (isNaN(fromDateObj.getTime())) {
      throw new Error('Invalid fromDate format');
    }
    
    if (isNaN(toDateObj.getTime())) {
      throw new Error('Invalid toDate format');
    }

    if (fromDateObj >= toDateObj) {
      throw new Error('fromDate must be before toDate');
    }

    return {
      trainerId,
      fromDate,
      toDate,
    };
  }

  /**
   * Validates and transforms get unfree slots request
   */
  static validateGetUnFreeSlotsRequest(query: Record<string, unknown>): GetUnFreeSlotsRequestDTO {
    const trainerId = ValidationUtil.validateString(query.trainerId, 'trainerId', 50);
    const fromDate = ValidationUtil.validateString(query.fromDate, 'fromDate', 50);
    const toDate = ValidationUtil.validateString(query.toDate, 'toDate', 50);

    // Validate date formats
    const fromDateObj = new Date(fromDate);
    const toDateObj = new Date(toDate);
    
    if (isNaN(fromDateObj.getTime())) {
      throw new Error('Invalid fromDate format');
    }
    
    if (isNaN(toDateObj.getTime())) {
      throw new Error('Invalid toDate format');
    }

    if (fromDateObj >= toDateObj) {
      throw new Error('fromDate must be before toDate');
    }

    return {
      trainerId,
      fromDate,
      toDate,
    };
  }

  /**
   * Validates and transforms set weekly rules request
   */
  static validateSetWeeklyRulesRequest(body: Record<string, unknown>): SetWeeklyRulesRequestDTO {
    const trainerId = ValidationUtil.validateString(body.trainerId, 'trainerId', 50);
    
    if (!body.rules) {
      throw new Error('Rules are required');
    }

    if (typeof body.rules !== 'object' || body.rules === null) {
      throw new Error('Rules must be an object');
    }

    return {
      trainerId,
      rules: body.rules as Record<string, unknown>,
    };
  }

  /**
   * Validates and transforms get weekly rules request
   */
  static validateGetWeeklyRulesRequest(query: Record<string, unknown>): GetWeeklyRulesRequestDTO {
    const trainerId = ValidationUtil.validateString(query.trainerId, 'trainerId', 50);

    return {
      trainerId,
    };
  }
}
