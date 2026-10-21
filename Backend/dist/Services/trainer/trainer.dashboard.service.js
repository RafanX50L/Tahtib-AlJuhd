"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrainerDashboardService = void 0;
const mongoose_1 = require("mongoose");
class TrainerDashboardService {
    _contractRepo;
    _sessionRepo;
    _planRepo;
    _paymentRepo;
    constructor(_contractRepo, _sessionRepo, _planRepo, _paymentRepo) {
        this._contractRepo = _contractRepo;
        this._sessionRepo = _sessionRepo;
        this._planRepo = _planRepo;
        this._paymentRepo = _paymentRepo;
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
            const plan = await this._planRepo.findById(new mongoose_1.Types.ObjectId(contract.planId?.toString()));
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
    async getTrends(trainerId) {
        const now = new Date();
        const monthsBack = 4;
        const labels = [];
        const sessions = [];
        const activeClients = [];
        const newClients = [];
        for (let i = monthsBack - 1; i >= 0; i--) {
            const first = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const last = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59, 999);
            labels.push(first.toLocaleString('en-US', { month: 'short' }));
            const sessionsCount = (await this._sessionRepo.findAll({
                trainerId: new mongoose_1.Types.ObjectId(trainerId),
                status: { $nin: ['free', 'cancelled'] },
                startTime: { $gte: first, $lte: last },
            })).length;
            sessions.push(sessionsCount);
            const contractsInMonth = await this._contractRepo.findAll({
                trainerId: new mongoose_1.Types.ObjectId(trainerId),
                endDate: { $gte: first },
                startDate: { $lte: last },
            });
            const distinctActive = new Set(contractsInMonth.map((c) => c.clientId?.toString())).size;
            activeClients.push(distinctActive);
            const newContracts = await this._contractRepo.findAll({
                trainerId: new mongoose_1.Types.ObjectId(trainerId),
                createdAt: { $gte: first, $lte: last },
            });
            const distinctNew = new Set(newContracts.map((c) => c.clientId?.toString())).size;
            newClients.push(distinctNew);
        }
        return { labels, sessions, activeClients, newClients };
    }
    async getPayments(trainerId, options) {
        if (!this._paymentRepo) {
            return { payments: [], total: 0, page: options.page || 1, limit: options.limit || 10 };
        }
        const page = options.page || 1;
        const limit = options.limit || 10;
        const filter = { trainerId: new mongoose_1.Types.ObjectId(trainerId) };
        if (options.status && options.status !== 'all') {
            filter.paymentStatus = options.status;
        }
        const all = await this._paymentRepo.findAll(filter);
        const filtered = options.search ? all.filter((p) => p.clientId?.toString().includes(options.search)) : all;
        const total = filtered.length;
        const start = (page - 1) * limit;
        const slice = filtered.slice(start, start + limit);
        return {
            payments: slice.map((p) => ({ id: p._id.toString(), clientId: p.clientId?.toString(), amount: p.amount, currency: p.currency, paymentStatus: p.paymentStatus, createdAt: new Date(p.createdAt).toISOString() })),
            total,
            page,
            limit,
        };
    }
}
exports.TrainerDashboardService = TrainerDashboardService;
//# sourceMappingURL=trainer.dashboard.service.js.map