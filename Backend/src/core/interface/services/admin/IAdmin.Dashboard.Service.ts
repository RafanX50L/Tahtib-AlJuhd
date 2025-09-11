export interface IAdminDashboardStats {
  totalTrainers: number;
  totalClients: number;
  activeClients: number;
  monthlyRevenue: number;
  pendingTrainerApprovals: number;
}

export interface IRevenueTrendsResult {
  labels: string[];
  revenue: number[];
}

export interface ITopTrainerItem {
  trainerId: string;
  name?: string;
  revenue: number;
  clients: number;
}

export interface IAdminDashboardService {
  getStats(): Promise<IAdminDashboardStats>;
  getRevenueTrends(monthsBack?: number): Promise<IRevenueTrendsResult>;
  getTopTrainers(limit?: number): Promise<ITopTrainerItem[]>;
  getRecentPayments(limit?: number): Promise<Array<{ id: string; trainerId: string; trainerName: string; clientId: string; clientName: string; amount: number; currency: string; createdAt: string; planTitle?: string }>>;
}


