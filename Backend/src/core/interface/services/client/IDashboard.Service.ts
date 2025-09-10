export interface IClientDashboardStats {
  workoutsCompleted: number;
  activeMinutes: number;
  caloriesBurned: number;
  currentStreak: number;
  weightProgress: {
    current: number;
    target: number;
    lost: number;
  };
  weeklyProgress: {
    completed: number;
    total: number;
  };
  upcomingSessions: number;
  planStatus: 'Active' | 'Inactive';
}

export interface IDashboardService {
  getClientDashboardStats(clientId: string): Promise<IClientDashboardStats>;
}
