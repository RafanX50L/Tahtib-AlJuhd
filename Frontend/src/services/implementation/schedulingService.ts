import { SCHEDULING_ROUTES } from '@/utils/constant';
import api from './api';
import { toast } from 'sonner';

// Local AxiosError type to avoid version/type mismatches
type AxiosError<T = unknown> = { response?: { data: T } };

export const SchedulingAPI = {
  getAvailability: async (trainerId: string, dateISO: string, tz?: string) => {
    const res = await api.get(SCHEDULING_ROUTES.TRAINER_AVAILABILITY(trainerId), { params: { date: dateISO, tz } });
    return res.data.data as { date: string; slots: Array<{ time: string; duration: number; isBooked: boolean }> };
  },
 
  book: async (payload: { trainerId: string; clientId: string; date: string; time: string; duration?: number; tz?: string, contractId:string }) => {
    try {
      const res = await api.post(SCHEDULING_ROUTES.BOOKINGS, payload);
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
    const res = await api.get(SCHEDULING_ROUTES.BOOKINGS, { params });
    return res.data.data;
  },
  cancel: async (bookingId: string, clientId: string ) => {
    const res = await api.patch(SCHEDULING_ROUTES.CANCEL_BOOKING(bookingId),{clientId});
    return res.data.data;
  },
  completeBooking: async (bookingId: string) => {
    const res = await api.patch(SCHEDULING_ROUTES.COMPLETE_BOOKING(bookingId));
    return res.data.data;
  },
};


