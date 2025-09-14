import { ValidationUtil } from "@/utils/validation.util";

/**
 * Request DTOs for Scheduling Controller
 * Input validation and transformation for scheduling endpoints
 */

// Get Availability For Date Request DTO
export interface GetAvailabilityForDateRequestDTO {
  trainerId: string;
  date?: string;
  tz?: string;
}

// Book Slot Request DTO
export interface BookSlotRequestDTO {
  trainerId: string;
  clientId: string;
  date: string;
  time: string;
  duration?: number;
  tz?: string;
  contractId: string;
}

// Cancel Booking Request DTO
export interface CancelBookingRequestDTO {
  bookingId: string;
  clientId: string;
}

// Complete Booking Request DTO
export interface CompleteBookingRequestDTO {
  bookingId: string;
}

// List Bookings Request DTO
export interface ListBookingsRequestDTO {
  trainerId?: string;
  clientId?: string;
  status?: 'upcoming' | 'past';
}

/**
 * Scheduling DTO class for input validation
 * Handles validation and transformation of scheduling-related requests
 */
export class SchedulingDTO {
  /**
   * Validates and transforms get availability for date request
   */
  static validateGetAvailabilityForDateRequest(params: Record<string, unknown>, query: Record<string, unknown>): GetAvailabilityForDateRequestDTO {
    const trainerId = ValidationUtil.validateString(params.trainerId, 'trainerId', 50);
    
    const date = query.date ? ValidationUtil.validateString(query.date, 'date', 50) : undefined;
    const tz = query.tz ? ValidationUtil.validateString(query.tz, 'tz', 50) : undefined;

    // Validate date format if provided
    if (date) {
      const dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) {
        throw new Error('Invalid date format');
      }
    }

    return {
      trainerId,
      date,
      tz,
    };
  }

  /**
   * Validates and transforms book slot request
   */
  static validateBookSlotRequest(body: Record<string, unknown>): BookSlotRequestDTO {
    const trainerId = ValidationUtil.validateString(body.trainerId, 'trainerId', 50);
    const clientId = ValidationUtil.validateString(body.clientId, 'clientId', 50);
    const date = ValidationUtil.validateString(body.date, 'date', 50);
    const time = ValidationUtil.validateString(body.time, 'time', 50);
    const contractId = ValidationUtil.validateString(body.contractId, 'contractId', 50);

    // Validate optional fields
    const duration = body.duration 
      ? ValidationUtil.validatePositiveInteger(body.duration, 'duration')
      : 60; // Default duration
    
    const tz = body.tz ? ValidationUtil.validateString(body.tz, 'tz', 50) : undefined;

    // Validate date format
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      throw new Error('Invalid date format');
    }

    // Validate time format (basic validation)
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(time)) {
      throw new Error('Invalid time format. Use HH:MM format');
    }

    // Validate duration range
    if (duration < 15 || duration > 480) {
      throw new Error('Duration must be between 15 and 480 minutes');
    }

    return {
      trainerId,
      clientId,
      date,
      time,
      duration,
      tz,
      contractId,
    };
  }

  /**
   * Validates and transforms cancel booking request
   */
  static validateCancelBookingRequest(params: Record<string, unknown>, body: Record<string, unknown>): CancelBookingRequestDTO {
    const bookingId = ValidationUtil.validateString(params.bookingId, 'bookingId', 50);
    const clientId = ValidationUtil.validateString(body.clientId, 'clientId', 50);

    return {
      bookingId,
      clientId,
    };
  }

  /**
   * Validates and transforms complete booking request
   */
  static validateCompleteBookingRequest(params: Record<string, unknown>): CompleteBookingRequestDTO {
    const bookingId = ValidationUtil.validateString(params.bookingId, 'bookingId', 50);

    return {
      bookingId,
    };
  }

  /**
   * Validates and transforms list bookings request
   */
  static validateListBookingsRequest(query: Record<string, unknown>): ListBookingsRequestDTO {
    const trainerId = query.trainerId ? ValidationUtil.validateString(query.trainerId, 'trainerId', 50) : undefined;
    const clientId = query.clientId ? ValidationUtil.validateString(query.clientId, 'clientId', 50) : undefined;
    const status = query.status ? ValidationUtil.validateEnum(query.status, 'status', ['upcoming', 'past']) : undefined;

    return {
      trainerId,
      clientId,
      status,
    };
  }
}
