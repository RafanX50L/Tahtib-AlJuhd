"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchedulingDTO = void 0;
const validation_util_1 = require("../../../utils/validation.util");
/**
 * Scheduling DTO class for input validation
 * Handles validation and transformation of scheduling-related requests
 */
class SchedulingDTO {
    /**
     * Validates and transforms get availability for date request
     */
    static validateGetAvailabilityForDateRequest(params, query) {
        const trainerId = validation_util_1.ValidationUtil.validateString(params.trainerId, 'trainerId', 50);
        const date = query.date ? validation_util_1.ValidationUtil.validateString(query.date, 'date', 50) : undefined;
        const tz = query.tz ? validation_util_1.ValidationUtil.validateString(query.tz, 'tz', 50) : undefined;
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
    static validateBookSlotRequest(body) {
        const trainerId = validation_util_1.ValidationUtil.validateString(body.trainerId, 'trainerId', 50);
        const clientId = validation_util_1.ValidationUtil.validateString(body.clientId, 'clientId', 50);
        const date = validation_util_1.ValidationUtil.validateString(body.date, 'date', 50);
        const time = validation_util_1.ValidationUtil.validateString(body.time, 'time', 50);
        const contractId = validation_util_1.ValidationUtil.validateString(body.contractId, 'contractId', 50);
        // Validate optional fields
        const duration = body.duration
            ? validation_util_1.ValidationUtil.validatePositiveInteger(body.duration, 'duration')
            : 60; // Default duration
        const tz = body.tz ? validation_util_1.ValidationUtil.validateString(body.tz, 'tz', 50) : undefined;
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
    static validateCancelBookingRequest(params, body) {
        const bookingId = validation_util_1.ValidationUtil.validateString(params.bookingId, 'bookingId', 50);
        const clientId = validation_util_1.ValidationUtil.validateString(body.clientId, 'clientId', 50);
        return {
            bookingId,
            clientId,
        };
    }
    /**
     * Validates and transforms complete booking request
     */
    static validateCompleteBookingRequest(params) {
        const bookingId = validation_util_1.ValidationUtil.validateString(params.bookingId, 'bookingId', 50);
        return {
            bookingId,
        };
    }
    /**
     * Validates and transforms list bookings request
     */
    static validateListBookingsRequest(query) {
        const trainerId = query.trainerId ? validation_util_1.ValidationUtil.validateString(query.trainerId, 'trainerId', 50) : undefined;
        const clientId = query.clientId ? validation_util_1.ValidationUtil.validateString(query.clientId, 'clientId', 50) : undefined;
        const status = query.status ? validation_util_1.ValidationUtil.validateEnum(query.status, 'status', ['upcoming', 'past']) : undefined;
        return {
            trainerId,
            clientId,
            status,
        };
    }
}
exports.SchedulingDTO = SchedulingDTO;
//# sourceMappingURL=SchedulingDTO.js.map