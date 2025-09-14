import { ValidationUtil } from "@/utils/validation.util";

/**
 * Request DTOs for Booking Controller
 * Input validation and transformation for booking endpoints
 */

// Checkout Session Request DTO
export interface CheckoutSessionRequestDTO {
  userId: string;
  trainerId: string;
  planId: string;
}

/**
 * Booking DTO class for input validation
 * Handles validation and transformation of booking-related requests
 */
export class BookingDTO {
  /**
   * Validates and transforms checkout session request
   */
  static validateCheckoutSessionRequest(body: Record<string, unknown>): CheckoutSessionRequestDTO {
    const userId = ValidationUtil.validateString(body.userId, 'userId', 50);
    const trainerId = ValidationUtil.validateString(body.trainerId, 'trainerId', 50);
    const planId = ValidationUtil.validateString(body.planId, 'planId', 50);

    return {
      userId,
      trainerId,
      planId,
    };
  }
}
