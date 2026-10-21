"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminDashboardController = void 0;
const DashboardDTO_1 = require("../../dtos/reverse-mapping/admin/DashboardDTO");
const controller_error_handler_util_1 = require("../../utils/controller-error-handler.util");
class AdminDashboardController {
    _service;
    constructor(_service) {
        this._service = _service;
    }
    async getStats(req, res, next) {
        try {
            const stats = await this._service.getStats();
            controller_error_handler_util_1.ControllerErrorHandler.handleSuccess(res, stats, "Dashboard stats retrieved successfully");
        }
        catch (error) {
            controller_error_handler_util_1.ControllerErrorHandler.handleError(error, res, next);
        }
    }
    async getRevenueTrends(req, res, next) {
        try {
            // Validate and transform request parameters using DTO
            const validatedParams = DashboardDTO_1.AdminDashboardDTO.validateGetRevenueTrendsRequest(req.query);
            // Call service with validated parameters - service already returns DTOs
            const result = await this._service.getRevenueTrends(validatedParams.monthsBack);
            controller_error_handler_util_1.ControllerErrorHandler.handleSuccess(res, result, "Revenue trends retrieved successfully");
        }
        catch (error) {
            controller_error_handler_util_1.ControllerErrorHandler.handleError(error, res, next);
        }
    }
    async getTopTrainers(req, res, next) {
        try {
            // Validate and transform request parameters using DTO
            const validatedParams = DashboardDTO_1.AdminDashboardDTO.validateGetTopTrainersRequest(req.query);
            // Call service with validated parameters - service already returns DTOs
            const result = await this._service.getTopTrainers(validatedParams.limit);
            controller_error_handler_util_1.ControllerErrorHandler.handleSuccess(res, result, "Top trainers retrieved successfully");
        }
        catch (error) {
            controller_error_handler_util_1.ControllerErrorHandler.handleError(error, res, next);
        }
    }
    async getRecentPayments(req, res, next) {
        try {
            // Validate and transform request parameters using DTO
            const validatedParams = DashboardDTO_1.AdminDashboardDTO.validateGetRecentPaymentsRequest(req.query);
            // Call service with validated parameters - service already returns DTOs
            const result = await this._service.getRecentPayments(validatedParams.page || 1, validatedParams.pageSize || 10, validatedParams.searchTerm || "");
            controller_error_handler_util_1.ControllerErrorHandler.handleSuccess(res, result, "Recent payments retrieved successfully");
        }
        catch (error) {
            controller_error_handler_util_1.ControllerErrorHandler.handleError(error, res, next);
        }
    }
}
exports.AdminDashboardController = AdminDashboardController;
//# sourceMappingURL=admin.dashboard.controller.js.map