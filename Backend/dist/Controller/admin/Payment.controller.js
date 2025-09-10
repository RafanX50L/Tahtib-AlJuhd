"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentController = void 0;
const utils_1 = require("../../utils");
const status_constant_1 = require("../../constants/status.constant");
class PaymentController {
    _paymentService;
    constructor(_paymentService) {
        this._paymentService = _paymentService;
    }
    async getAllPayments(req, res) {
        try {
            const payments = await this._paymentService.getAllPayments();
            res.status(status_constant_1.HttpStatus.OK).json({
                success: true,
                message: "Payments retrieved successfully",
                data: payments,
            });
        }
        catch (error) {
            throw (0, utils_1.createHttpError)(status_constant_1.HttpStatus.INTERNAL_SERVER_ERROR, "Failed to retrieve payments");
        }
    }
    async getPaymentsByClient(req, res) {
        try {
            const { clientId } = req.params;
            if (!clientId) {
                throw (0, utils_1.createHttpError)(status_constant_1.HttpStatus.BAD_REQUEST, "Client ID is required");
            }
            const payments = await this._paymentService.getPaymentsByClient(clientId);
            res.status(status_constant_1.HttpStatus.OK).json({
                success: true,
                message: "Client payments retrieved successfully",
                data: payments,
            });
        }
        catch (error) {
            throw (0, utils_1.createHttpError)(status_constant_1.HttpStatus.INTERNAL_SERVER_ERROR, "Failed to retrieve client payments");
        }
    }
    async getPaymentsByTrainer(req, res) {
        try {
            const { trainerId } = req.params;
            if (!trainerId) {
                throw (0, utils_1.createHttpError)(status_constant_1.HttpStatus.BAD_REQUEST, "Trainer ID is required");
            }
            const payments = await this._paymentService.getPaymentsByTrainer(trainerId);
            res.status(status_constant_1.HttpStatus.OK).json({
                success: true,
                message: "Trainer payments retrieved successfully",
                data: payments,
            });
        }
        catch (error) {
            throw (0, utils_1.createHttpError)(status_constant_1.HttpStatus.INTERNAL_SERVER_ERROR, "Failed to retrieve trainer payments");
        }
    }
    async getPaymentById(req, res) {
        try {
            const { paymentId } = req.params;
            if (!paymentId) {
                throw (0, utils_1.createHttpError)(status_constant_1.HttpStatus.BAD_REQUEST, "Payment ID is required");
            }
            const payment = await this._paymentService.getPaymentById(paymentId);
            if (!payment) {
                throw (0, utils_1.createHttpError)(status_constant_1.HttpStatus.NOT_FOUND, "Payment not found");
            }
            res.status(status_constant_1.HttpStatus.OK).json({
                success: true,
                message: "Payment retrieved successfully",
                data: payment,
            });
        }
        catch (error) {
            throw (0, utils_1.createHttpError)(status_constant_1.HttpStatus.INTERNAL_SERVER_ERROR, "Failed to retrieve payment");
        }
    }
    async getPaymentsByDateRange(req, res) {
        try {
            const { startDate, endDate } = req.query;
            if (!startDate || !endDate) {
                throw (0, utils_1.createHttpError)(status_constant_1.HttpStatus.BAD_REQUEST, "Start date and end date are required");
            }
            const start = new Date(startDate);
            const end = new Date(endDate);
            if (isNaN(start.getTime()) || isNaN(end.getTime())) {
                throw (0, utils_1.createHttpError)(status_constant_1.HttpStatus.BAD_REQUEST, "Invalid date format");
            }
            const payments = await this._paymentService.getPaymentsByDateRange(start, end);
            res.status(status_constant_1.HttpStatus.OK).json({
                success: true,
                message: "Payments retrieved successfully",
                data: payments,
            });
        }
        catch (error) {
            throw (0, utils_1.createHttpError)(status_constant_1.HttpStatus.INTERNAL_SERVER_ERROR, "Failed to retrieve payments by date range");
        }
    }
    async getTotalRevenue(req, res) {
        try {
            const totalRevenue = await this._paymentService.getTotalRevenue();
            res.status(status_constant_1.HttpStatus.OK).json({
                success: true,
                message: "Total revenue retrieved successfully",
                data: { totalRevenue },
            });
        }
        catch (error) {
            throw (0, utils_1.createHttpError)(status_constant_1.HttpStatus.INTERNAL_SERVER_ERROR, "Failed to retrieve total revenue");
        }
    }
    async getTotalRevenueByTrainer(req, res) {
        try {
            const { trainerId } = req.params;
            if (!trainerId) {
                throw (0, utils_1.createHttpError)(status_constant_1.HttpStatus.BAD_REQUEST, "Trainer ID is required");
            }
            const totalRevenue = await this._paymentService.getTotalRevenueByTrainer(trainerId);
            res.status(status_constant_1.HttpStatus.OK).json({
                success: true,
                message: "Trainer revenue retrieved successfully",
                data: { totalRevenue },
            });
        }
        catch (error) {
            throw (0, utils_1.createHttpError)(status_constant_1.HttpStatus.INTERNAL_SERVER_ERROR, "Failed to retrieve trainer revenue");
        }
    }
    async updatePaymentStatus(req, res) {
        try {
            const { paymentId } = req.params;
            const { status } = req.body;
            if (!paymentId) {
                throw (0, utils_1.createHttpError)(status_constant_1.HttpStatus.BAD_REQUEST, "Payment ID is required");
            }
            if (!status || !['pending', 'completed', 'failed', 'refunded'].includes(status)) {
                throw (0, utils_1.createHttpError)(status_constant_1.HttpStatus.BAD_REQUEST, "Valid status is required");
            }
            const updatedPayment = await this._paymentService.updatePaymentStatus(paymentId, status);
            if (!updatedPayment) {
                throw (0, utils_1.createHttpError)(status_constant_1.HttpStatus.NOT_FOUND, "Payment not found");
            }
            res.status(status_constant_1.HttpStatus.OK).json({
                success: true,
                message: "Payment status updated successfully",
                data: updatedPayment,
            });
        }
        catch (error) {
            throw (0, utils_1.createHttpError)(status_constant_1.HttpStatus.INTERNAL_SERVER_ERROR, "Failed to update payment status");
        }
    }
    async getPaymentByStripePaymentIntentId(req, res) {
        try {
            const { paymentIntentId } = req.params;
            if (!paymentIntentId) {
                throw (0, utils_1.createHttpError)(status_constant_1.HttpStatus.BAD_REQUEST, "Payment Intent ID is required");
            }
            const payment = await this._paymentService.getPaymentByStripePaymentIntentId(paymentIntentId);
            if (!payment) {
                throw (0, utils_1.createHttpError)(status_constant_1.HttpStatus.NOT_FOUND, "Payment not found");
            }
            res.status(status_constant_1.HttpStatus.OK).json({
                success: true,
                message: "Payment retrieved successfully",
                data: payment,
            });
        }
        catch (error) {
            throw (0, utils_1.createHttpError)(status_constant_1.HttpStatus.INTERNAL_SERVER_ERROR, "Failed to retrieve payment");
        }
    }
    async getPaymentByStripeSessionId(req, res) {
        try {
            const { sessionId } = req.params;
            if (!sessionId) {
                throw (0, utils_1.createHttpError)(status_constant_1.HttpStatus.BAD_REQUEST, "Session ID is required");
            }
            const payment = await this._paymentService.getPaymentByStripeSessionId(sessionId);
            if (!payment) {
                throw (0, utils_1.createHttpError)(status_constant_1.HttpStatus.NOT_FOUND, "Payment not found");
            }
            res.status(status_constant_1.HttpStatus.OK).json({
                success: true,
                message: "Payment retrieved successfully",
                data: payment,
            });
        }
        catch (error) {
            throw (0, utils_1.createHttpError)(status_constant_1.HttpStatus.INTERNAL_SERVER_ERROR, "Failed to retrieve payment");
        }
    }
}
exports.PaymentController = PaymentController;
//# sourceMappingURL=Payment.controller.js.map