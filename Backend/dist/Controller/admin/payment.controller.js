"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentController = void 0;
const PaymentDTO_1 = require("../../dtos/reverse-mapping/admin/PaymentDTO");
const controller_error_handler_util_1 = require("../../utils/controller-error-handler.util");
class PaymentController {
    _paymentService;
    constructor(_paymentService) {
        this._paymentService = _paymentService;
    }
    async getAllPayments(req, res, next) {
        try {
            const payments = await this._paymentService.getAllPayments();
            controller_error_handler_util_1.ControllerErrorHandler.handleSuccess(res, payments, "Payments retrieved successfully");
        }
        catch (error) {
            controller_error_handler_util_1.ControllerErrorHandler.handleError(error, res, next);
        }
    }
    async getPaymentsByClient(req, res, next) {
        try {
            // Validate and transform request parameters using DTO
            const validatedParams = PaymentDTO_1.AdminPaymentDTO.validateGetPaymentsByClientRequest(req.params);
            // Call service with validated parameters - service already returns DTOs
            const payments = await this._paymentService.getPaymentsByClient(validatedParams.clientId);
            controller_error_handler_util_1.ControllerErrorHandler.handleSuccess(res, payments, "Client payments retrieved successfully");
        }
        catch (error) {
            controller_error_handler_util_1.ControllerErrorHandler.handleError(error, res, next);
        }
    }
    async getPaymentsByTrainer(req, res, next) {
        try {
            // Validate and transform request parameters using DTO
            const validatedParams = PaymentDTO_1.AdminPaymentDTO.validateGetPaymentsByTrainerRequest(req.params);
            // Call service with validated parameters - service already returns DTOs
            const payments = await this._paymentService.getPaymentsByTrainer(validatedParams.trainerId);
            controller_error_handler_util_1.ControllerErrorHandler.handleSuccess(res, payments, "Trainer payments retrieved successfully");
        }
        catch (error) {
            controller_error_handler_util_1.ControllerErrorHandler.handleError(error, res, next);
        }
    }
    async getPaymentById(req, res, next) {
        try {
            // Validate and transform request parameters using DTO
            const validatedParams = PaymentDTO_1.AdminPaymentDTO.validateGetPaymentByIdRequest(req.params);
            // Call service with validated parameters - service already returns DTOs
            const payment = await this._paymentService.getPaymentById(validatedParams.paymentId);
            if (!payment) {
                controller_error_handler_util_1.ControllerErrorHandler.handleNotFound(res, "Payment not found");
                return;
            }
            controller_error_handler_util_1.ControllerErrorHandler.handleSuccess(res, payment, "Payment retrieved successfully");
        }
        catch (error) {
            controller_error_handler_util_1.ControllerErrorHandler.handleError(error, res, next);
        }
    }
    async getPaymentsByDateRange(req, res, next) {
        try {
            // Validate and transform request parameters using DTO
            const validatedParams = PaymentDTO_1.AdminPaymentDTO.validateGetPaymentsByDateRangeRequest(req.query);
            // Call service with validated parameters - service already returns DTOs
            const start = new Date(validatedParams.startDate);
            const end = new Date(validatedParams.endDate);
            const payments = await this._paymentService.getPaymentsByDateRange(start, end);
            controller_error_handler_util_1.ControllerErrorHandler.handleSuccess(res, payments, "Payments retrieved successfully");
        }
        catch (error) {
            controller_error_handler_util_1.ControllerErrorHandler.handleError(error, res, next);
        }
    }
    async getTotalRevenue(req, res, next) {
        try {
            const totalRevenue = await this._paymentService.getTotalRevenue();
            controller_error_handler_util_1.ControllerErrorHandler.handleSuccess(res, { totalRevenue }, "Total revenue retrieved successfully");
        }
        catch (error) {
            controller_error_handler_util_1.ControllerErrorHandler.handleError(error, res, next);
        }
    }
    async getTotalRevenueByTrainer(req, res, next) {
        try {
            // Validate and transform request parameters using DTO
            const validatedParams = PaymentDTO_1.AdminPaymentDTO.validateGetTotalRevenueByTrainerRequest(req.params);
            // Call service with validated parameters - service already returns DTOs
            const totalRevenue = await this._paymentService.getTotalRevenueByTrainer(validatedParams.trainerId);
            controller_error_handler_util_1.ControllerErrorHandler.handleSuccess(res, { totalRevenue }, "Trainer revenue retrieved successfully");
        }
        catch (error) {
            controller_error_handler_util_1.ControllerErrorHandler.handleError(error, res, next);
        }
    }
    async updatePaymentStatus(req, res, next) {
        try {
            // Validate and transform request parameters using DTO
            const validatedParams = PaymentDTO_1.AdminPaymentDTO.validateUpdatePaymentStatusRequest(req.params, req.body);
            // Call service with validated parameters - service already returns DTOs
            const updatedPayment = await this._paymentService.updatePaymentStatus(validatedParams.paymentId, validatedParams.status);
            if (!updatedPayment) {
                controller_error_handler_util_1.ControllerErrorHandler.handleNotFound(res, "Payment not found");
                return;
            }
            controller_error_handler_util_1.ControllerErrorHandler.handleSuccess(res, updatedPayment, "Payment status updated successfully");
        }
        catch (error) {
            controller_error_handler_util_1.ControllerErrorHandler.handleError(error, res, next);
        }
    }
    async getPaymentByStripePaymentIntentId(req, res, next) {
        try {
            // Validate and transform request parameters using DTO
            const validatedParams = PaymentDTO_1.AdminPaymentDTO.validateGetPaymentByStripePaymentIntentIdRequest(req.params);
            // Call service with validated parameters - service already returns DTOs
            const payment = await this._paymentService.getPaymentByStripePaymentIntentId(validatedParams.paymentIntentId);
            if (!payment) {
                controller_error_handler_util_1.ControllerErrorHandler.handleNotFound(res, "Payment not found");
                return;
            }
            controller_error_handler_util_1.ControllerErrorHandler.handleSuccess(res, payment, "Payment retrieved successfully");
        }
        catch (error) {
            controller_error_handler_util_1.ControllerErrorHandler.handleError(error, res, next);
        }
    }
    async getPaymentByStripeSessionId(req, res, next) {
        try {
            // Validate and transform request parameters using DTO
            const validatedParams = PaymentDTO_1.AdminPaymentDTO.validateGetPaymentByStripeSessionIdRequest(req.params);
            // Call service with validated parameters - service already returns DTOs
            const payment = await this._paymentService.getPaymentByStripeSessionId(validatedParams.sessionId);
            if (!payment) {
                controller_error_handler_util_1.ControllerErrorHandler.handleNotFound(res, "Payment not found");
                return;
            }
            controller_error_handler_util_1.ControllerErrorHandler.handleSuccess(res, payment, "Payment retrieved successfully");
        }
        catch (error) {
            controller_error_handler_util_1.ControllerErrorHandler.handleError(error, res, next);
        }
    }
}
exports.PaymentController = PaymentController;
//# sourceMappingURL=Payment.controller.js.map