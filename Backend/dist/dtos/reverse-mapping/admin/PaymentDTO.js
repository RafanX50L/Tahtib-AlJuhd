"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminPaymentDTO = void 0;
const validation_util_1 = require("../../../utils/validation.util");
class AdminPaymentDTO {
    /**
     * Validates and transforms get payments by client request parameters
     */
    static validateGetPaymentsByClientRequest(params) {
        const clientId = validation_util_1.ValidationUtil.validateObjectId(params.clientId, 'clientId');
        return {
            clientId,
        };
    }
    /**
     * Validates and transforms get payments by trainer request parameters
     */
    static validateGetPaymentsByTrainerRequest(params) {
        const trainerId = validation_util_1.ValidationUtil.validateObjectId(params.trainerId, 'trainerId');
        return {
            trainerId,
        };
    }
    /**
     * Validates and transforms get payment by ID request parameters
     */
    static validateGetPaymentByIdRequest(params) {
        const paymentId = validation_util_1.ValidationUtil.validateObjectId(params.paymentId, 'paymentId');
        return {
            paymentId,
        };
    }
    /**
     * Validates and transforms get payments by date range request parameters
     */
    static validateGetPaymentsByDateRangeRequest(query) {
        const startDate = validation_util_1.ValidationUtil.validateString(query.startDate, 'startDate');
        const endDate = validation_util_1.ValidationUtil.validateString(query.endDate, 'endDate');
        // Validate date format
        const startDateObj = new Date(startDate);
        const endDateObj = new Date(endDate);
        if (isNaN(startDateObj.getTime())) {
            throw new validation_util_1.ValidationError([{
                    field: 'startDate',
                    message: 'Start date must be a valid date format',
                    value: startDate
                }]);
        }
        if (isNaN(endDateObj.getTime())) {
            throw new validation_util_1.ValidationError([{
                    field: 'endDate',
                    message: 'End date must be a valid date format',
                    value: endDate
                }]);
        }
        if (startDateObj > endDateObj) {
            throw new validation_util_1.ValidationError([{
                    field: 'dateRange',
                    message: 'Start date must be before end date',
                    value: { startDate, endDate }
                }]);
        }
        return {
            startDate,
            endDate,
        };
    }
    /**
     * Validates and transforms get total revenue by trainer request parameters
     */
    static validateGetTotalRevenueByTrainerRequest(params) {
        const trainerId = validation_util_1.ValidationUtil.validateObjectId(params.trainerId, 'trainerId');
        return {
            trainerId,
        };
    }
    /**
     * Validates and transforms update payment status request
     */
    static validateUpdatePaymentStatusRequest(params, body) {
        const paymentId = validation_util_1.ValidationUtil.validateObjectId(params.paymentId, 'paymentId');
        const status = validation_util_1.ValidationUtil.validateEnum(body.status, 'status', ['pending', 'completed', 'failed', 'refunded']);
        return {
            paymentId,
            status,
        };
    }
    /**
     * Validates and transforms get payment by Stripe payment intent ID request parameters
     */
    static validateGetPaymentByStripePaymentIntentIdRequest(params) {
        const paymentIntentId = validation_util_1.ValidationUtil.validateString(params.paymentIntentId, 'paymentIntentId');
        return {
            paymentIntentId,
        };
    }
    /**
     * Validates and transforms get payment by Stripe session ID request parameters
     */
    static validateGetPaymentByStripeSessionIdRequest(params) {
        const sessionId = validation_util_1.ValidationUtil.validateString(params.sessionId, 'sessionId');
        return {
            sessionId,
        };
    }
}
exports.AdminPaymentDTO = AdminPaymentDTO;
//# sourceMappingURL=PaymentDTO.js.map