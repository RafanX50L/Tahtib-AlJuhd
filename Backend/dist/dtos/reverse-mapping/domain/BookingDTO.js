"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingDTO = void 0;
const validation_util_1 = require("../../../utils/validation.util");
/**
 * Booking DTO class for input validation
 * Handles validation and transformation of booking-related requests
 */
class BookingDTO {
    /**
     * Validates and transforms checkout session request
     */
    static validateCheckoutSessionRequest(body) {
        const userId = validation_util_1.ValidationUtil.validateString(body.userId, 'userId', 50);
        const trainerId = validation_util_1.ValidationUtil.validateString(body.trainerId, 'trainerId', 50);
        const planId = validation_util_1.ValidationUtil.validateString(body.planId, 'planId', 50);
        return {
            userId,
            trainerId,
            planId,
        };
    }
}
exports.BookingDTO = BookingDTO;
//# sourceMappingURL=BookingDTO.js.map