"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrainerDashboardController = void 0;
class TrainerDashboardController {
    trainerDashboardService;
    constructor(trainerDashboardService) {
        this.trainerDashboardService = trainerDashboardService;
    }
    async getTrainerDashboardStats(req, res) {
        try {
            const trainerId = req.params.trainerId || req.user?.id;
            if (!trainerId) {
                res.status(400).json({
                    success: false,
                    message: 'Trainer ID is required'
                });
                return;
            }
            const stats = await this.trainerDashboardService.getTrainerDashboardStats(trainerId);
            res.status(200).json({
                success: true,
                message: 'Trainer dashboard stats retrieved successfully',
                data: stats
            });
        }
        catch (error) {
            console.error('Error in getTrainerDashboardStats controller:', error);
            res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : 'Internal server error'
            });
        }
    }
    async getTrainerPerformanceTrends(req, res) {
        try {
            const trainerId = req.params.trainerId || req.user?.id;
            const period = req.query.period || 'month';
            if (!trainerId) {
                res.status(400).json({
                    success: false,
                    message: 'Trainer ID is required'
                });
                return;
            }
            const trends = await this.trainerDashboardService.getTrainerPerformanceTrends(trainerId, period);
            res.status(200).json({
                success: true,
                message: 'Trainer performance trends retrieved successfully',
                data: trends
            });
        }
        catch (error) {
            console.error('Error in getTrainerPerformanceTrends controller:', error);
            res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : 'Internal server error'
            });
        }
    }
}
exports.TrainerDashboardController = TrainerDashboardController;
//# sourceMappingURL=TrainerDashboard.controller.js.map