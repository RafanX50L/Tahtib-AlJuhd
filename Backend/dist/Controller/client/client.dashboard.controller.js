"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardController = void 0;
const utils_1 = require("../../utils");
const status_constant_1 = require("../../constants/status.constant");
const ClientDashboardDTO_1 = require("../../dtos/reverse-mapping/client/ClientDashboardDTO");
const controller_error_handler_util_1 = require("../../utils/controller-error-handler.util");
class DashboardController {
    _dashboardService;
    constructor(_dashboardService) {
        this._dashboardService = _dashboardService;
    }
    async getClientDashboardStats(req, res, next) {
        try {
            // Validate and transform request parameters using DTO
            const validatedParams = ClientDashboardDTO_1.ClientDashboardDTO.validateGetClientDashboardStatsRequest(req.params);
            const clientId = validatedParams.clientId || req.user?.id;
            if (!clientId) {
                throw (0, utils_1.createHttpError)(status_constant_1.HttpStatus.BAD_REQUEST, "Client ID is required");
            }
            const stats = await this._dashboardService.getClientDashboardStats(clientId);
            controller_error_handler_util_1.ControllerErrorHandler.handleSuccess(res, stats, "Dashboard statistics retrieved successfully");
        }
        catch (error) {
            controller_error_handler_util_1.ControllerErrorHandler.handleError(error, res, next);
        }
    }
}
exports.DashboardController = DashboardController;
//# sourceMappingURL=client.dashboard.controller.js.map