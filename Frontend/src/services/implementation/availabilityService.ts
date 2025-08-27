import api from './api';

export type DayWindow = { startTime: string; endTime: string };
export type WeeklyRulesPayload = {
  trainerId: string;
  rules: Record<string, DayWindow[] | number> & { slotLength?: number; bufferMinutes?: number };
};

export const AvailabilityAPI = {
  setWeeklyRules: async (payload: WeeklyRulesPayload) => {
    const res = await api.post('/trainer/availability/rules', payload);
    return res.data as { message: string };
  },
};


