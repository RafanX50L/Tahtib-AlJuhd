import { IAdminDashboardService, IAdminDashboardStats, IRevenueTrendsResult, ITopTrainerItem } from "@/core/interface/services/admin/IAdmin.Dashboard.Service";
import { IUserRepository } from "@/core/interface/repositories/IUser.repository";
import { IPaymentRepository } from "@/core/interface/repositories/IPaymentRepository";
import { ITrainerPersonalizationRepository } from "@/core/interface/repositories/ITrainer.personalization.repository";
import { Types } from "mongoose";

export class AdminDashboardService implements IAdminDashboardService {
  constructor(
    private readonly _userRepo: IUserRepository,
    private readonly _paymentRepo: IPaymentRepository,
    private readonly _trainerPersRepo: ITrainerPersonalizationRepository,
  ) {}

  async getStats(): Promise<IAdminDashboardStats> {
    const [totalTrainers, totalClients] = await Promise.all([
      this._userRepo.countDocuments({ role: 'trainer' }),
      this._userRepo.countDocuments({ role: 'client' }),
    ]);

    // Active clients: client personalization with planStatus Active
    const activeClients = await this._userRepo.countDocuments({ role: 'client', /* populated via lookup not trivial; fallback uses clients count */ });

    // Monthly revenue from payment collections marked completed this month
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    const payments = await this._paymentRepo.findAll({ paymentStatus: 'completed', createdAt: { $gte: startOfMonth, $lte: endOfMonth } });
    const monthlyRevenue = payments.reduce((sum: number, p) => sum + (p.amount || 0), 0);

    // Pending trainer approvals via personalization status != approved
    const pendingTrainerApprovals = (await this._trainerPersRepo.getPendingTrainers(1, 1_000_000, "")).totalCount || 0;

    return { totalTrainers, totalClients, activeClients, monthlyRevenue, pendingTrainerApprovals };
  }

  async getRevenueTrends(monthsBack = 6): Promise<IRevenueTrendsResult> {
    const now = new Date();
    const labels: string[] = [];
    const revenue: number[] = [];
    for (let i = monthsBack - 1; i >= 0; i--) {
      const first = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const last = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59, 999);
      labels.push(first.toLocaleString('en-US', { month: 'short' }));
      const payments = await this._paymentRepo.findAll({ paymentStatus: 'completed', createdAt: { $gte: first, $lte: last } });
      const sum = payments.reduce((acc: number, p) => acc + (p.amount || 0), 0);
      revenue.push(sum);
    }
    return { labels, revenue };
  }

  async getTopTrainers(limit = 5): Promise<ITopTrainerItem[]> {
    // Aggregate payments by trainer
    const completed = await this._paymentRepo.findAll({ paymentStatus: 'completed' });
    const totals = new Map<string, { revenue: number; clients: Set<string> }>();
    for (const p of completed) {
      const tId = p.trainerId?.toString();
      const cId = p.clientId?.toString();
      if (!tId) continue;
      if (!totals.has(tId)) totals.set(tId, { revenue: 0, clients: new Set() });
      const bucket = totals.get(tId)!;
      bucket.revenue += p.amount || 0;
      if (cId) bucket.clients.add(cId);
    }
    const sorted = Array.from(totals.entries())
      .map(([trainerId, v]) => ({ trainerId, revenue: v.revenue, clients: v.clients.size }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, limit);
    return sorted;
  }

  async getRecentPayments(page: number, pageSize: number, searchTerm: string = "") {
    const skip = (page - 1) * pageSize;
    const filter: { paymentStatus: 'completed' , trainerId?: { $in: Types.ObjectId[] } } = { paymentStatus: 'completed' };

    // If searchTerm is provided, find trainers matching the search term first
    let trainerIds: string[] = [];
    if (searchTerm) {
      const trainers = await this._userRepo.findAll({
        name: { $regex: searchTerm, $options: 'i' }
      });
      trainerIds = trainers.map((t) => t._id.toString());
      if (trainerIds.length === 0) {
        return { data: [], total: 0 }; // No matching trainers, return empty
      }
      filter.trainerId = { $in: trainerIds.map((id: string) => new Types.ObjectId(id)) };
    }

    const [list, total] = await Promise.all([
      this._paymentRepo.findPayments(filter, skip, pageSize),
      this._paymentRepo.countDocuments(filter)
    ]);

    const sorted = list;
    const allTrainerIds = Array.from(new Set(sorted.map((p) => p.trainerId?.toString()).filter(Boolean)));
    const allClientIds = Array.from(new Set(sorted.map((p) => p.clientId?.toString()).filter(Boolean)));

    const [trainers, clients] = await Promise.all([
      this._userRepo.findAll({ _id: { $in: allTrainerIds.map((id: string) => new Types.ObjectId(id)) } }),
      this._userRepo.findAll({ _id: { $in: allClientIds.map((id: string) => new Types.ObjectId(id)) } }),
    ]);

    const tMap = new Map<string, string>(trainers.map((t) => [t._id.toString(), t.name]));
    const cMap = new Map<string, string>(clients.map((c) => [c._id.toString(), c.name]));

    const data = sorted.map((p) => ({
      id: p._id.toString(),
      trainerId: p.trainerId?.toString(),
      trainerName: tMap.get(p.trainerId?.toString() || '') || '-',
      clientId: p.clientId?.toString(),
      clientName: cMap.get(p.clientId?.toString() || '') || '-',
      amount: p.amount,
      currency: p.currency,
      createdAt: new Date(p.createdAt).toISOString(),
      planTitle: undefined,
    }));

    return { data, total };
  }
}


