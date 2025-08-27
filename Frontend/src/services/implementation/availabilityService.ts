import { WeeklyRulesPayload } from '@/components/trainer/SetAvailability/SetAvailabilityPage';
import api from './api';

export type DayWindow = { startTime: string; endTime: string };
export type WeeklyRulesPayloads = {
  trainerId: string;
  rules: WeeklyRulesPayload
};

export const AvailabilityAPI = {
  setWeeklyRules: async (payload: WeeklyRulesPayloads) => {
    const res = await api.post('/trainer/availability/rules', payload);
    return res.data as { message: string };
  },
};


