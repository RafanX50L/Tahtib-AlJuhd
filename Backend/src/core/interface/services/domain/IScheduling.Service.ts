export type AvailabilityResponse = {
  date: string;
  slots: Array<{ time: string; duration: number; isBooked: boolean }>;
};

export type BookSlotInput = {
  trainerId: string;
  clientId: string;
  date: string;
  time: string; 
  duration?: number; 
  tz?: string;
  contractId: string;
};

export interface ISchedulingService {
    placeholder?: never;
    getAvailabilityForDate(trainerId: string, date?: string, tz?: string): Promise<AvailabilityResponse>;
    bookSlot(input: BookSlotInput): Promise<void>;
    cancelBooking(bookingId: string, clientId: string): Promise<void>;
    completeBooking(bookingId: string): Promise<void>;
}