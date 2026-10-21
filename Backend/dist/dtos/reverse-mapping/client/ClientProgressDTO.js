"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientProgressDTO = void 0;
const validation_util_1 = require("../../../utils/validation.util");
/**
 * Client Progress DTO class for input validation
 * Handles validation and transformation of client progress-related requests
 */
class ClientProgressDTO {
    /**
     * Validates and transforms add entry request
     */
    static validateAddEntryRequest(body) {
        const date = validation_util_1.ValidationUtil.validateString(body.date, 'date', 50);
        const weight = validation_util_1.ValidationUtil.validatePositiveInteger(body.weight, 'weight');
        const height = validation_util_1.ValidationUtil.validatePositiveInteger(body.height, 'height');
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
    static validateGetGraphDataRequest(query) {
        const start = validation_util_1.ValidationUtil.validateString(query.start, 'start', 50);
        const end = validation_util_1.ValidationUtil.validateString(query.end, 'end', 50);
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
    static validatePreviewEntryRequest(body) {
        const date = validation_util_1.ValidationUtil.validateString(body.date, 'date', 50);
        const weight = validation_util_1.ValidationUtil.validatePositiveInteger(body.weight, 'weight');
        const height = validation_util_1.ValidationUtil.validatePositiveInteger(body.height, 'height');
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
exports.ClientProgressDTO = ClientProgressDTO;
//# sourceMappingURL=ClientProgressDTO.js.map