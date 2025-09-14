import api from './api';
import { toast } from 'sonner';

// Local AxiosError type to avoid version/type mismatches
type AxiosError<T = unknown> = { response?: { data: T } };

export const SchedulingAPI = {
  getAvailability: async (trainerId: string, dateISO: string, tz?: string) => {
    const res = await api.get(`/scheduling/trainers/${trainerId}/availability`, { params: { date: dateISO, tz } });
    return res.data.data as { date: string; slots: Array<{ time: string; duration: number; isBooked: boolean }> };
  },
 
  book: async (payload: { trainerId: string; clientId: string; date: string; time: string; duration?: number; tz?: string, contractId:string }) => {
    try {
      const res = await api.post('/scheduling/bookings', payload);
      return res.data.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ error?: string; message?: string }>;
      console.log('Scheduling booking error:', err);
      
      // Handle specific error cases
      if (err.response?.data?.error === "User is Blocked" || 
          err.response?.data?.error === "Invalid token") {
        // Token issues will be handled by interceptor
        throw error;
      }
      
      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Failed to Book Session";
      console.log("Error Booking Session: ", errorMessage);
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  },
  list: async (params: { trainerId?: string; clientId?: string; status?: 'upcoming' | 'past' }) => {
    const res = await api.get('/scheduling/bookings', { params });
    return res.data.data;
  },
  cancel: async (bookingId: string, clientId: string ) => {
    const res = await api.patch(`/scheduling/bookings/${bookingId}/cancel`,{clientId});
    return res.data.data;
  },
  completeBooking: async (bookingId: string) => {
    const res = await api.patch(`/scheduling/bookings/${bookingId}/complete`);
    return res.data.data;
  },
};


