import { ISession } from "../../model/ISession";

export type AvailabilityResponse = {
  date: string;
  slots: Array<{ time: string; duration: number; isBooked: boolean }>;
};

export type BookSlotInput = {
  trainerId: string;
  clientId: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  duration?: number; // minutes
  tz?: string; // IANA zone
  contractId: string;
};

export interface ISchedulingService {
    placeholder?: never;
    getAvailabilityForDate(trainerId: string, date?: string, tz?: string): Promise<AvailabilityResponse>;
    bookSlot(input: BookSlotInput): Promise<ISession>;
    listBookings(params: { trainerId?: string; clientId?: string; status?: string }): Promise<Array<ISession>>;
    cancelBooking(bookingId: string, clientId: string): Promise<ISession>;
    completeBooking(bookingId: string): Promise<ISession>;
}