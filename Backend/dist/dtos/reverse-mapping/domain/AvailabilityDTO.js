"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvailabilityDTO = void 0;
const validation_util_1 = require("../../../utils/validation.util");
/**
 * Availability DTO class for input validation
 * Handles validation and transformation of availability-related requests
 */
class AvailabilityDTO {
    /**
     * Validates and transforms get free slots request
     */
    static validateGetFreeSlotsRequest(query) {
        const trainerId = validation_util_1.ValidationUtil.validateString(query.trainerId, 'trainerId', 50);
        const fromDate = validation_util_1.ValidationUtil.validateString(query.fromDate, 'fromDate', 50);
        const toDate = validation_util_1.ValidationUtil.validateString(query.toDate, 'toDate', 50);
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
    static validateGetUnFreeSlotsRequest(query) {
        const trainerId = validation_util_1.ValidationUtil.validateString(query.trainerId, 'trainerId', 50);
        const fromDate = validation_util_1.ValidationUtil.validateString(query.fromDate, 'fromDate', 50);
        const toDate = validation_util_1.ValidationUtil.validateString(query.toDate, 'toDate', 50);
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
    static validateSetWeeklyRulesRequest(body) {
        const trainerId = validation_util_1.ValidationUtil.validateString(body.trainerId, 'trainerId', 50);
        if (!body.rules) {
            throw new Error('Rules are required');
        }
        if (typeof body.rules !== 'object' || body.rules === null) {
            throw new Error('Rules must be an object');
        }
        return {
            trainerId,
            rules: body.rules,
        };
    }
    /**
     * Validates and transforms get weekly rules request
     */
    static validateGetWeeklyRulesRequest(query) {
        const trainerId = validation_util_1.ValidationUtil.validateString(query.trainerId, 'trainerId', 50);
        return {
            trainerId,
        };
    }
}
exports.AvailabilityDTO = AvailabilityDTO;
//# sourceMappingURL=AvailabilityDTO.js.map