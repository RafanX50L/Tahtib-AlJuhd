"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrainerDashboardController = void 0;
const TrainerDashboardDTO_1 = require("../../dtos/reverse-mapping/trainer/TrainerDashboardDTO");
const controller_error_handler_util_1 = require("../../utils/controller-error-handler.util");
class TrainerDashboardController {
    _service;
    constructor(_service) {
        this._service = _service;
    }
    async getStats(req, res, next) {
        try {
            const trainerId = req.user?.id;
            const stats = await this._service.getStats(trainerId);
            controller_error_handler_util_1.ControllerErrorHandler.handleSuccess(res, stats, "Dashboard stats retrieved successfully");
        }
        catch (error) {
            controller_error_handler_util_1.ControllerErrorHandler.handleError(error, res, next);
        }
    }
    async getTrends(req, res, next) {
        try {
            const trainerId = req.user?.id;
            const trends = await this._service.getTrends(trainerId);
            controller_error_handler_util_1.ControllerErrorHandler.handleSuccess(res, trends, "Trends retrieved successfully");
        }
        catch (error) {
            controller_error_handler_util_1.ControllerErrorHandler.handleError(error, res, next);
        }
    }
    async getPayments(req, res, next) {
        try {
            const trainerId = req.user?.id;
            // Validate and transform request parameters using DTO
            const validatedParams = TrainerDashboardDTO_1.TrainerDashboardDTO.validateGetPaymentsRequest(req.query);
            const result = await this._service.getPayments(trainerId, {
                page: validatedParams.page,
                limit: validatedParams.limit,
                status: validatedParams.status || 'all',
                search: validatedParams.search,
            });
            controller_error_handler_util_1.ControllerErrorHandler.handleSuccess(res, result, "Payments retrieved successfully");
        }
        catch (error) {
            controller_error_handler_util_1.ControllerErrorHandler.handleError(error, res, next);
        }
    }
}
exports.TrainerDashboardController = TrainerDashboardController;
//# sourceMappingURL=trainer.dashboard.controller.js.map