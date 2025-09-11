export interface ITrainerDashboardStats {
  activeClients: number;
  sessionsToday: number;
  totalRevenueThisMonth: number;
  contractsExpiringSoon: number;
}

export interface ITrainerDashboardService {
  getStats(trainerId: string): Promise<ITrainerDashboardStats>;
  getTrends(trainerId: string): Promise<{
    labels: string[];
    sessions: number[];
    activeClients: number[];
    newClients: number[];
  }>;
  getPayments(trainerId: string, options: { page?: number; limit?: number; status?: 'pending' | 'completed' | 'failed' | 'refunded' | 'all'; search?: string; }): Promise<{
    payments: Array<{ id: string; clientId: string; amount: number; currency: string; paymentStatus: string; createdAt: string }>;
    total: number;
    page: number;
    limit: number;
  }>;
}


