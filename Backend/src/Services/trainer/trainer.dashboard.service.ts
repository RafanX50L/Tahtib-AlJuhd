import { ITrainerDashboardService, ITrainerDashboardStats } from "@/core/interface/services/trainer/ITrainer.Dashboard.Service";
import { ITrainerClientContractRepository } from "@/core/interface/repositories/ITrainerClientContract.repository";
import { ISessionRepository } from "@/core/interface/repositories/ISession.repository";
import { Types } from "mongoose";
import { IPlanRepository } from "@/core/interface/repositories/IPlanRepository";
import { IPaymentRepository } from "@/core/interface/repositories/IPaymentRepository";
import { ITrainerClientContract } from "@/core/interface/model/ITrainerClientContract";

export class TrainerDashboardService implements ITrainerDashboardService {
  constructor(
    private readonly _contractRepo: ITrainerClientContractRepository,
    private readonly _sessionRepo: ISessionRepository,
    private readonly _planRepo: IPlanRepository,
    private readonly _paymentRepo?: IPaymentRepository,
  ) {}

  async getStats(trainerId: string): Promise<ITrainerDashboardStats> {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    // Active clients: distinct active contracts for this trainer
    const activeContracts = await this._contractRepo.findAll({
      trainerId: new Types.ObjectId(trainerId),
      startDate: { $lte: now },
      endDate: { $gte: now },
    });

    const activeClientIds = new Set(activeContracts.map((c) => c.clientId?.toString()));

    // Sessions today: booked or completed today for this trainer
    const sessionsToday = (await this._sessionRepo.findAll({
      trainerId: new Types.ObjectId(trainerId),
      status: { $nin: ['free', 'cancelled'] },
      startTime: { $gte: startOfDay, $lte: endOfDay },
    })).length;

    // Total revenue this month for trainer
    // Revenue model: plan price per week minus company commission (fixed 99 rupees per week), multiplied by number of weeks purchased across active contracts that overlap this month.
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    let totalRevenueThisMonth = 0;
    for (const contract of activeContracts) {
      const plan = await this._planRepo.findById(new Types.ObjectId((contract as ITrainerClientContract).planId?.toString()));
      if (!plan) continue;
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
      trainerId: new Types.ObjectId(trainerId),
      endDate: { $gt: now, $lte: soon },
    });

    return {
      activeClients: activeClientIds.size,
      sessionsToday,
      totalRevenueThisMonth,
      contractsExpiringSoon: expiringSoon.length,
    };
  }

  async getTrends(trainerId: string): Promise<{ labels: string[]; sessions: number[]; activeClients: number[]; newClients: number[]; }> {
    const now = new Date();
    const monthsBack = 4;
    const labels: string[] = [];
    const sessions: number[] = [];
    const activeClients: number[] = [];
    const newClients: number[] = [];

    for (let i = monthsBack - 1; i >= 0; i--) {
      const first = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const last = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59, 999);
      labels.push(first.toLocaleString('en-US', { month: 'short' }));

      const sessionsCount = (await this._sessionRepo.findAll({
        trainerId: new Types.ObjectId(trainerId),
        status: { $nin: ['free', 'cancelled'] },
        startTime: { $gte: first, $lte: last },
      })).length;
      sessions.push(sessionsCount);

      const contractsInMonth = await this._contractRepo.findAll({
        trainerId: new Types.ObjectId(trainerId),
        endDate: { $gte: first },
        startDate: { $lte: last },
      });
      const distinctActive = new Set(contractsInMonth.map((c) => c.clientId?.toString())).size;
      activeClients.push(distinctActive);

      const newContracts = await this._contractRepo.findAll({
        trainerId: new Types.ObjectId(trainerId),
        createdAt: { $gte: first, $lte: last },
      });
      const distinctNew = new Set(newContracts.map((c) => c.clientId?.toString())).size;
      newClients.push(distinctNew);
    }

    return { labels, sessions, activeClients, newClients };
  }

  async getPayments(trainerId: string, options: { page?: number; limit?: number; status?: 'pending' | 'completed' | 'failed' | 'refunded' | 'all'; search?: string; }): Promise<{ payments: Array<{ id: string; clientId: string; amount: number; currency: string; paymentStatus: string; createdAt: string }>; total: number; page: number; limit: number; }> {
    if (!this._paymentRepo) {
      return { payments: [], total: 0, page: options.page || 1, limit: options.limit || 10 };
    }
    const page = options.page || 1;
    const limit = options.limit || 10;
    const filter: { trainerId: Types.ObjectId; paymentStatus?: string } = { trainerId: new Types.ObjectId(trainerId) };
    if (options.status && options.status !== 'all') {
      filter.paymentStatus = options.status;
    }
    const all = await this._paymentRepo.findAll(filter);
    const filtered = options.search ? all.filter((p) => p.clientId?.toString().includes(options.search as string)) : all;
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


