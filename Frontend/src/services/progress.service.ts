import api from './implementation/api';

export const ProgressService = {
  // Client: workout day upsert
  upsertWorkoutDay: (payload: {
    workoutPlanId: string;
    weekKey: string;
    dayKey: string;
    exercises: Array<{ exerciseId: string; completedReps?: number; completedSets?: number; durationSec?: number; status: 'pending'|'completed'; completedAt?: string }>;
  }) => api.post('/user/progress/workout', payload).then((r: any) => r.data),

  // Client: health metrics
  recordHealth: (payload: { metricType: 'bmi'|'weight'|'body_fat'|'heart_rate'; value: number; recordedAt?: string }) =>
    api.post('/user/progress/health', payload).then((r: any) => r.data),
  listHealth: (params?: { metricType?: 'bmi'|'weight'|'body_fat'|'heart_rate'; limit?: number }) =>
    api.get('/user/progress/health', { params }).then((r: any) => r.data),

  // Client: streaks and summary
  getStreaks: () => api.get('/user/progress/streaks').then((r: any) => r.data),
  getSummary: () => api.get('/user/progress/summary').then((r: any) => r.data),

  // Client: workout day get
  getWorkoutDay: (params: { workoutPlanId: string; weekKey: string; dayKey: string }) =>
    api.get('/user/progress/workout/day', { params }).then((r: any) => r.data),
  listRecentWorkoutDays: (params?: { limit?: number }) =>
    api.get('/user/progress/workout/recent', { params }).then((r: any) => r.data),

  // Client: video progress
  upsertVideo: (payload: { videoId: string; watchPercent: number; avgPlaybackRate?: number }) =>
    api.post('/user/progress/video', payload).then((r: any) => r.data),

  // Trainer
  trainerApproveDay: (payload: { userId: string; workoutPlanId: string; weekKey: string; dayKey: string }) =>
    api.post('/trainer/progress/approve', payload).then((r: any) => r.data),
  trainerResetDay: (payload: { userId: string; workoutPlanId: string; weekKey: string; dayKey: string }) =>
    api.post('/trainer/progress/reset', payload).then((r: any) => r.data),

  // Admin
  adminCohortAnalytics: (params: { start: string; end: string }) =>
    api.get('/admin/progress/analytics/cohort', { params }).then((r: any) => r.data),
  adminExportHealthCsv: (params: { metricType: string; start?: string; end?: string }) =>
    api.get('/admin/progress/export/health.csv', { params, responseType: 'blob' }).then((r: any) => r.data),
};


