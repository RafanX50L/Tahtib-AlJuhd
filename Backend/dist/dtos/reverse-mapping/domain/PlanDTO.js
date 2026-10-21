"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlanDTO = void 0;
const validation_util_1 = require("../../../utils/validation.util");
/**
 * Plan DTO class for input validation
 * Handles validation and transformation of plan-related requests
 */
class PlanDTO {
    /**
     * Validates and transforms create plan request
     */
    static validateCreatePlanRequest(body) {
        const trainerId = validation_util_1.ValidationUtil.validateString(body.trainerId, 'trainerId', 50);
        const title = validation_util_1.ValidationUtil.validateString(body.title, 'title', 100);
        const description = validation_util_1.ValidationUtil.validateString(body.description, 'description', 500);
        const sessionsPerWeek = validation_util_1.ValidationUtil.validatePositiveInteger(body.sessionsPerWeek, 'sessionsPerWeek');
        if (sessionsPerWeek < 1 || sessionsPerWeek > 7) {
            throw new Error('Sessions per week must be between 1 and 7');
        }
        const durationWeeks = validation_util_1.ValidationUtil.validatePositiveInteger(body.durationWeeks, 'durationWeeks');
        if (durationWeeks < 1 || durationWeeks > 52) {
            throw new Error('Duration weeks must be between 1 and 52');
        }
        const isActive = body.isActive !== undefined ? Boolean(body.isActive) : true;
        const isBooked = body.isBooked !== undefined ? Boolean(body.isBooked) : false;
        return {
            trainerId,
            title,
            description,
            price: body.price,
            sessionsPerWeek,
            durationWeeks,
            isActive,
            isBooked,
        };
    }
    /**
     * Validates and transforms get plans by trainer request
     */
    static validateGetPlansByTrainerRequest(query) {
        const trainerId = validation_util_1.ValidationUtil.validateString(query.trainerId, 'trainerId', 50);
        return {
            trainerId,
        };
    }
    /**
     * Validates and transforms update plan request
     */
    static validateUpdatePlanRequest(body) {
        const editingPlanId = validation_util_1.ValidationUtil.validateString(body.editingPlanId, 'editingPlanId', 50);
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
    static validateDeactivatePlanRequest(body) {
        const editingPlanId = validation_util_1.ValidationUtil.validateString(body.editingPlanId, 'editingPlanId', 50);
        return {
            editingPlanId,
        };
    }
}
exports.PlanDTO = PlanDTO;
//# sourceMappingURL=PlanDTO.js.map