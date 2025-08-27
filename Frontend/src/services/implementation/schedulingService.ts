import api from './api';

export const SchedulingAPI = {
  getAvailability: async (trainerId: string, dateISO: string, tz?: string) => {
    const res = await api.get(`scheduling/trainers/${trainerId}/availability`, { params: { date: dateISO, tz } });
    return res.data as { date: string; slots: Array<{ time: string; duration: number; isBooked: boolean }> };
  },
  book: async (payload: { trainerId: string; clientId: string; date: string; time: string; duration?: number; tz?: string, contractId:string }) => {
    const res = await api.post('scheduling/bookings', payload);
    return res.data;
  },
  list: async (params: { trainerId?: string; clientId?: string; status?: 'upcoming' | 'past' }) => {
    const res = await api.get('/bookings', { params });
    return res.data;
  },
  cancel: async (bookingId: string, clientId: string ) => {
    const res = await api.patch(`scheduling/bookings/${bookingId}/cancel`,{clientId});
    return res.data;
  },
  MarkAsComplete: async (bookingId: string) => {
    const res = await api.patch(`scheduling/bookings/${bookingId}/complete`);
    return res.data;
  },
};


