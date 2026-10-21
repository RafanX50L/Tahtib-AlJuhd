"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminTrainerDTO = void 0;
const validation_util_1 = require("../../../utils/validation.util");
class AdminTrainerDTO {
    /**
     * Validates and transforms get trainers request parameters
     */
    static validateGetTrainersRequest(query) {
        const { page, limit } = validation_util_1.ValidationUtil.validatePagination(query);
        const search = validation_util_1.ValidationUtil.validateString(query.search, 'search', 100);
        return {
            page,
            limit,
            search,
        };
    }
    /**
     * Validates and transforms schedule interview request parameters
     */
    static validateScheduleInterviewRequest(params) {
        const trainerId = validation_util_1.ValidationUtil.validateObjectId(params.trainerId, 'trainerId');
        const date = validation_util_1.ValidationUtil.validateString(params.date, 'date');
        const time = validation_util_1.ValidationUtil.validateString(params.time, 'time');
        // Validate date format
        const dateObj = new Date(date);
        if (isNaN(dateObj.getTime())) {
            throw new validation_util_1.ValidationError([{
                    field: 'date',
                    message: 'Date must be a valid date format',
                    value: date
                }]);
        }
        // Validate time format (basic HH:MM format)
        if (!/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time)) {
            throw new validation_util_1.ValidationError([{
                    field: 'time',
                    message: 'Time must be in HH:MM format',
                    value: time
                }]);
        }
        return {
            trainerId,
            date,
            time,
        };
    }
    /**
     * Validates and transforms submit interview feedback request body
     */
    static validateSubmitInterviewFeedbackRequest(body) {
        const id = validation_util_1.ValidationUtil.validateObjectId(body.id, 'id');
        if (!body.feedback || typeof body.feedback !== 'object') {
            throw new validation_util_1.ValidationError([{
                    field: 'feedback',
                    message: 'Feedback is required and must be an object',
                    value: body.feedback
                }]);
        }
        const feedback = body.feedback;
        return {
            id,
            feedback,
        };
    }
    /**
     * Validates and transforms approve trainer request body
     */
    static validateApproveTrainerRequest(body) {
        const id = validation_util_1.ValidationUtil.validateObjectId(body.id, 'id');
        const salary = validation_util_1.ValidationUtil.validatePositiveInteger(body.salary, 'salary');
        if (salary < 0) {
            throw new validation_util_1.ValidationError([{
                    field: 'salary',
                    message: 'Salary must be a positive number',
                    value: body.salary
                }]);
        }
        return {
            id,
            salary,
        };
    }
    /**
     * Validates and transforms reject trainer request body
     */
    static validateRejectTrainerRequest(body) {
        const id = validation_util_1.ValidationUtil.validateObjectId(body.id, 'id');
        return {
            id,
        };
    }
}
exports.AdminTrainerDTO = AdminTrainerDTO;
//# sourceMappingURL=TrainerDTO.js.map