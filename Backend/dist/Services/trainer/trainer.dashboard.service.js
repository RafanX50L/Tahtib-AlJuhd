"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrainerDashboardService = void 0;
const mongoose_1 = require("mongoose");
class TrainerDashboardService {
    _contractRepo;
    _sessionRepo;
    _planRepo;
    constructor(_contractRepo, _sessionRepo, _planRepo) {
        this._contractRepo = _contractRepo;
        this._sessionRepo = _sessionRepo;
        this._planRepo = _planRepo;
    }
    async getStats(trainerId) {
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
        // Active clients: distinct active contracts for this trainer
        const activeContracts = await this._contractRepo.findAll({
            trainerId: new mongoose_1.Types.ObjectId(trainerId),
            startDate: { $lte: now },
            endDate: { $gte: now },
        });
        const activeClientIds = new Set(activeContracts.map((c) => c.clientId?.toString()));
        // Sessions today: booked or completed today for this trainer
        const sessionsToday = (await this._sessionRepo.findAll({
            trainerId: new mongoose_1.Types.ObjectId(trainerId),
            status: { $nin: ['free', 'cancelled'] },
            startTime: { $gte: startOfDay, $lte: endOfDay },
        })).length;
        // Total revenue this month for trainer
        // Revenue model: plan price per week minus company commission (fixed 99 rupees per week), multiplied by number of weeks purchased across active contracts that overlap this month.
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
        let totalRevenueThisMonth = 0;
        for (const contract of activeContracts) {
            const plan = await this._planRepo.findById(contract.planId?.toString());
            if (!plan)
                continue;
            const weeklyPayout = Math.max(0, (plan.price || 0) - 99);
            // count the number of overlapping weeks between contract period and this month
            const overlapStart = new Date(Math.max(startOfMonth.getTime(), new Date(contract.startDate).getTime()));
            const overlapEnd = new Date(Math.min(endOfMonth.getTime(), new Date(contract.endDate).getTime()));
            if (overlapEnd >= overlapStart) {
                const weeks = Math.ceil((overlapEnd.getTime() - overlapStart.getTime() + 1) / (7 * 24 * 60 * 60 * 1000));
                totalRevenueThisMonth += weeks * weeklyPayout;
            }
        }
        // Contracts expiring soon (next 7 days)
        const soon = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        const expiringSoon = await this._contractRepo.findAll({
            trainerId: new mongoose_1.Types.ObjectId(trainerId),
            endDate: { $gt: now, $lte: soon },
        });
        return {
            activeClients: activeClientIds.size,
            sessionsToday,
            totalRevenueThisMonth,
            contractsExpiringSoon: expiringSoon.length,
        };
    }
}
exports.TrainerDashboardService = TrainerDashboardService;
//# sourceMappingURL=trainer.dashboard.service.js.map