import { ValidationUtil } from "@/utils/validation.util";

/**
 * Request DTOs for Plan Controller
 * Input validation and transformation for plan endpoints
 */

// Create Plan Request DTO
export interface CreatePlanRequestDTO {
  trainerId: string;
  title: string;
  description: string;
  price: number;
  sessionsPerWeek: number;
  durationWeeks: number;
  isActive?: boolean;
  isBooked?: boolean;
}

// Get Plans By Trainer Request DTO
export interface GetPlansByTrainerRequestDTO {
  trainerId: string;
}

// Update Plan Request DTO
export interface UpdatePlanRequestDTO {
  editingPlanId: string;
  formData: unknown;
}

// Deactivate Plan Request DTO
export interface DeactivatePlanRequestDTO {
  editingPlanId: string;
}

/**
 * Plan DTO class for input validation
 * Handles validation and transformation of plan-related requests
 */
export class PlanDTO {
  /**
   * Validates and transforms create plan request
   */
  static validateCreatePlanRequest(body: Record<string, unknown>): CreatePlanRequestDTO {
    const trainerId = ValidationUtil.validateString(body.trainerId, 'trainerId', 50);
    const title = ValidationUtil.validateString(body.title, 'title', 100);
    const description = ValidationUtil.validateString(body.description, 'description', 500);
    
    const sessionsPerWeek = ValidationUtil.validatePositiveInteger(body.sessionsPerWeek, 'sessionsPerWeek');
    if (sessionsPerWeek < 1 || sessionsPerWeek > 7) {
      throw new Error('Sessions per week must be between 1 and 7');
    }
    
    const durationWeeks = ValidationUtil.validatePositiveInteger(body.durationWeeks, 'durationWeeks');
    if (durationWeeks < 1 || durationWeeks > 52) {
      throw new Error('Duration weeks must be between 1 and 52');
    }
    
    const isActive = body.isActive !== undefined ? Boolean(body.isActive) : true;
    const isBooked = body.isBooked !== undefined ? Boolean(body.isBooked) : false;

    return {
      trainerId,
      title,
      description,
      price:body.price as number,
      sessionsPerWeek,
      durationWeeks,
      isActive,
      isBooked,
    };
  }

  /**
   * Validates and transforms get plans by trainer request
   */
  static validateGetPlansByTrainerRequest(query: Record<string, unknown>): GetPlansByTrainerRequestDTO {
    const trainerId = ValidationUtil.validateString(query.trainerId, 'trainerId', 50);

    return {
      trainerId,
    };
  }

  /**
   * Validates and transforms update plan request
   */
  static validateUpdatePlanRequest(body: Record<string, unknown>): UpdatePlanRequestDTO {
    const editingPlanId = ValidationUtil.validateString(body.editingPlanId, 'editingPlanId', 50);
    
    if (!body.formData) {
      throw new Error('formData is required');
    }

    return {
      editingPlanId,
      formData: body.formData,
    };
  }

  /**
   * Validates and transforms deactivate plan request
   */
  static validateDeactivatePlanRequest(body: Record<string, unknown>): DeactivatePlanRequestDTO {
    const editingPlanId = ValidationUtil.validateString(body.editingPlanId, 'editingPlanId', 50);

    return {
      editingPlanId,
    };
  }
}
