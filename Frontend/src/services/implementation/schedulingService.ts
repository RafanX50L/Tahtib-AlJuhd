import api from './api';
import { AxiosError } from 'axios';
import { toast } from 'sonner';

export const SchedulingAPI = {
  getAvailability: async (trainerId: string, dateISO: string, tz?: string) => {
    const res = await api.get(`scheduling/trainers/${trainerId}/availability`, { params: { date: dateISO, tz } });
    return res.data as { date: string; slots: Array<{ time: string; duration: number; isBooked: boolean }> };
  },
 
  book: async (payload: { trainerId: string; clientId: string; date: string; time: string; duration?: number; tz?: string, contractId:string }) => {
    try {
      const res = await api.post('scheduling/bookings', payload);
      return res.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ error?: string; message?: string }>;
      console.log('error',err);
      const errorMessage =
        err.response?.data.error ||
        err.response?.data.message ||
        "Failed to Book Session";
      console.log("Error Booking Session: ", errorMessage);
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
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


