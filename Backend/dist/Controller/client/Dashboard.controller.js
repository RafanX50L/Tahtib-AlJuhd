"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardController = void 0;
const utils_1 = require("../../utils");
const status_constant_1 = require("../../constants/status.constant");
class DashboardController {
    _dashboardService;
    constructor(_dashboardService) {
        this._dashboardService = _dashboardService;
    }
    async getClientDashboardStats(req, res) {
        try {
            const clientId = req.params.clientId || req.user?.id;
            if (!clientId) {
                throw (0, utils_1.createHttpError)(status_constant_1.HttpStatus.BAD_REQUEST, "Client ID is required");
            }
            const stats = await this._dashboardService.getClientDashboardStats(clientId);
            res.status(status_constant_1.HttpStatus.OK).json({
                success: true,
                message: "Dashboard statistics retrieved successfully",
                data: stats,
            });
        }
        catch (error) {
            throw (0, utils_1.createHttpError)(status_constant_1.HttpStatus.INTERNAL_SERVER_ERROR, "Failed to retrieve dashboard statistics");
        }
    }
}
exports.DashboardController = DashboardController;
//# sourceMappingURL=Dashboard.controller.js.map