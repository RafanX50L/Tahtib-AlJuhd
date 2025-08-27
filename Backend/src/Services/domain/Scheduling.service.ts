import { Types } from 'mongoose';
import { startOfDay, endOfDay, set, addMinutes, isBefore, isAfter, formatISO, format } from 'date-fns';
import { SessionRepository } from '@/Repository/Session.repository';
import { AvailabilityService } from './Availability.service';
import { PersonalizationRepository } from '@/Repository/personalization.repository';
import { stat } from 'fs';

type AvailabilityResponse = {
  date: string;
  slots: Array<{ time: string; duration: number; isBooked: boolean }>;
};

type BookSlotInput = {
  trainerId: string;
  clientId: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  duration?: number; // minutes
  tz?: string; // IANA zone
};

export class SchedulingService {
  private readonly sessionRepo = new SessionRepository();
  private readonly personalizationRepo = new PersonalizationRepository();
  private readonly availabilityService = new AvailabilityService(this.personalizationRepo, this.sessionRepo);

  async getAvailabilityForDate(trainerId: string, date?: string, tz?: string): Promise<AvailabilityResponse> {
    // tz currently unused; server assumed to handle in UTC/local consistently
    const target = date ? new Date(date) : new Date();
    const from = startOfDay(target);
    const to = endOfDay(target);

    // Consider all sessions (free or booked) to avoid showing taken times
    const freeSessions = await this.sessionRepo.findFreeSlotsByTrainer(trainerId, from, to);
    const busySessions = await (this.sessionRepo as any).findUnFreeSlotsByTrainer(trainerId, from, to);
    const sessions = [...freeSessions, ...busySessions];

    // Prefer weekly day-level rules; fallback to per-date slots; default 09:00-18:00
    const trainerPers = await this.personalizationRepo.findByUserId(trainerId);
    const data = trainerPers?.data as { availability?: { weeklyRules?: any; weeklySlots?: Array<{ date: string; startTime: string; endTime: string }> } } | undefined;
    const rules = data?.availability?.weeklyRules as Record<string, Array<{ startTime: string; endTime: string }>> | undefined;
    const weekly = data?.availability?.weeklySlots || [];
    const dayStr = format(target, 'yyyy-MM-dd');
    const weekday = format(target, 'EEEE');

    let windows: Array<{ start: Date; end: Date }> = [];
    if (rules && rules[weekday] && Array.isArray(rules[weekday])) {
      windows = rules[weekday].map(r => ({
        start: new Date(`${dayStr}T${r.startTime}:00`),
        end: new Date(`${dayStr}T${r.endTime}:00`),
      }));
    } else {
      const daySlots = weekly.filter((s) => s.date?.startsWith(dayStr));
      if (daySlots.length) {
        windows = daySlots.map((s) => ({
          start: new Date(`${s.date}T${s.startTime}:00`),
          end: new Date(`${s.date}T${s.endTime}:00`),
        }));
      } else {
        const baseStart = set(from, { hours: 9, minutes: 0, seconds: 0, milliseconds: 0 });
        const baseEnd = set(from, { hours: 18, minutes: 0, seconds: 0, milliseconds: 0 });
        windows = [{ start: baseStart, end: baseEnd }];
      }
    }

    // Dynamic population: return only immediate next N open slots (e.g., 12) for performance
    const minutesIncrement = (rules as any)?.slotLength || 30;
    const maxSlots = 24;
    const freeTimes: Array<{ time: string; duration: number; isBooked: boolean }> = [];

    for (const w of windows) {
      let cursor = w.start;
      while (isBefore(cursor, w.end) && freeTimes.length < maxSlots) {
        const next = addMinutes(cursor, minutesIncrement);
        const overlap = sessions.find(s => !isAfter(cursor, s.endTime) && !isBefore(next, s.startTime));
        if (!overlap) {
          const t = format(cursor, 'HH:mm');
          freeTimes.push({ time: t, duration: minutesIncrement, isBooked: false });
        }
        cursor = next;
      }
    }

    return { date: format(target, 'yyyy-MM-dd'), slots: freeTimes };
  }

  async bookSlot(input: BookSlotInput) {
    const start = new Date(`${input.date}T${input.time}:00`);
    const end = addMinutes(start, input.duration || 30);
    console.log('start and end',start, end);

    // Prevent double booking by checking ANY session in the range
    const dayFrom = startOfDay(start);
    const dayTo = endOfDay(start);
    const free = await this.sessionRepo.findFreeSlotsByTrainer(input.trainerId, dayFrom, dayTo);
    const nonFree = await (this.sessionRepo as any).findUnFreeSlotsByTrainer(input.trainerId, dayFrom, dayTo);
    const conflicts = [...free, ...nonFree];
    const taken = conflicts.find(s => !(end <= s.startTime || start >= s.endTime));
    if (taken) throw new Error('Slot not available');

    // Create a session marked as booked
    const created = await this.sessionRepo.create({
      trainerId: new Types.ObjectId(input.trainerId),
      clientId: new Types.ObjectId(input.clientId),
      startTime: start,
      endTime: end,
      status: 'booked',
      meetingLink: `room_${Math.random().toString(36).slice(2, 10)}`,
    } as any);
    console.log('created',created);

    return created;
  }

  async listBookings({ trainerId, clientId, status }: { trainerId?: string; clientId?: string; status?: string }) {
    const query: any = {};
    if (trainerId) query.trainerId = new Types.ObjectId(trainerId);
    if (clientId) query.clientId = new Types.ObjectId(clientId);
    if (status === 'upcoming') query.startTime = { $gte: new Date() };
    if (status === 'past') query.endTime = { $lt: new Date() };

    return await this.sessionRepo.findAll(query as any);
  }

  async cancelBooking(bookingId: string) {
    const session = await this.sessionRepo.findById(new Types.ObjectId(bookingId));
    if (!session) throw new Error('Booking not found');
    session.status = 'canceled';
    session.clientId = null as any;
    return await this.sessionRepo.update(session.id, session);
  }
}


