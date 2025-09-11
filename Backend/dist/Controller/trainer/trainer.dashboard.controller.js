"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrainerDashboardController = void 0;
const status_constant_1 = require("../../constants/status.constant");
class TrainerDashboardController {
    _service;
    constructor(_service) {
        this._service = _service;
    }
    async getStats(req, res) {
        const trainerId = req.user?.id;
        const stats = await this._service.getStats(trainerId);
        res.status(status_constant_1.HttpStatus.OK).json({ success: true, data: stats });
    }
}
exports.TrainerDashboardController = TrainerDashboardController;
//# sourceMappingURL=trainer.dashboard.controller.js.map