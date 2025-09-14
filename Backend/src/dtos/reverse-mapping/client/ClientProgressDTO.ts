import { ValidationUtil } from "@/utils/validation.util";

/**
 * Request DTOs for Client Progress Controller
 * Input validation and transformation for client progress endpoints
 */

// Add Entry Request DTO
export interface AddEntryRequestDTO {
  date: string;
  weight: number;
  height: number;
}

// Get Graph Data Request DTO
export interface GetGraphDataRequestDTO {
  start: string;
  end: string;
}

// Preview Entry Request DTO
export interface PreviewEntryRequestDTO {
  date: string;
  weight: number;
  height: number;
}

/**
 * Client Progress DTO class for input validation
 * Handles validation and transformation of client progress-related requests
 */
export class ClientProgressDTO {
  /**
   * Validates and transforms add entry request
   */
  static validateAddEntryRequest(body: Record<string, unknown>): AddEntryRequestDTO {
    const date = ValidationUtil.validateString(body.date, 'date', 50);
    const weight = ValidationUtil.validatePositiveNumber(body.weight, 'weight');
    const height = ValidationUtil.validatePositiveNumber(body.height, 'height');

    // Validate date format
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      throw new Error('Invalid date format');
    }

    // Validate weight range (reasonable fitness tracking range)
    if (weight < 20 || weight > 500) {
      throw new Error('Weight must be between 20 and 500 kg');
    }

    // Validate height range (reasonable human height range)
    if (height < 50 || height > 300) {
      throw new Error('Height must be between 50 and 300 cm');
    }

    return {
      date,
      weight,
      height,
    };
  }

  /**
   * Validates and transforms get graph data request
   */
  static validateGetGraphDataRequest(query: Record<string, unknown>): GetGraphDataRequestDTO {
    const start = ValidationUtil.validateString(query.start, 'start', 50);
    const end = ValidationUtil.validateString(query.end, 'end', 50);

    // Validate date formats
    const startDate = new Date(start);
    const endDate = new Date(end);
    
    if (isNaN(startDate.getTime())) {
      throw new Error('Invalid start date format');
    }
    
    if (isNaN(endDate.getTime())) {
      throw new Error('Invalid end date format');
    }

    if (startDate >= endDate) {
      throw new Error('Start date must be before end date');
    }

    return {
      start,
      end,
    };
  }

  /**
   * Validates and transforms preview entry request
   */
  static validatePreviewEntryRequest(body: Record<string, unknown>): PreviewEntryRequestDTO {
    const date = ValidationUtil.validateString(body.date, 'date', 50);
    const weight = ValidationUtil.validatePositiveNumber(body.weight, 'weight');
    const height = ValidationUtil.validatePositiveNumber(body.height, 'height');

    // Validate date format
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      throw new Error('Invalid date format');
    }

    // Validate weight range (reasonable fitness tracking range)
    if (weight < 20 || weight > 500) {
      throw new Error('Weight must be between 20 and 500 kg');
    }

    // Validate height range (reasonable human height range)
    if (height < 50 || height > 300) {
      throw new Error('Height must be between 50 and 300 cm');
    }

    return {
      date,
      weight,
      height,
    };
  }
}
