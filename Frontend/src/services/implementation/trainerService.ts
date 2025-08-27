import api from './api';

export const TrainerAPI = {
  getById: async (trainerId: string) => {
    // Assuming server has /api/trainer/profile/:id or similar; fallback to /api/trainer?trainerId=
    try {
      const res = await api.get(`/trainer/profile/${trainerId}`);
      return res.data;
    } catch {
      const res = await api.get(`/trainer`, { params: { trainerId } });
      return res.data;
    }
  },
};


