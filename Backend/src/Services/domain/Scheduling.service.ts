import { FilterQuery, Types } from "mongoose";
import {
  startOfDay,
  endOfDay,
  addMinutes,
  isBefore,
  format,
  differenceInMinutes,
  isSameDay,
  isEqual,
} from "date-fns";
import {
  AvailabilityResponse,
  BookSlotInput,
  ISchedulingService,
} from "@/core/interface/services/domain/IScheduling.Service";
import { ISessionRepository } from "@/core/interface/repositories/ISession.repository";
import { IPersonalizationRepository } from "@/core/interface/repositories/IPersonalization.repository";
import { ISession } from "@/core/interface/model/ISession";
import {
  IClientPersonalization,
  ITrainerPersonalization,
} from "@/core/interface/model/IPersonalization.model";
import { ITrainerClientContractRepository } from "@/core/interface/repositories/ITrainerClientContract.repository";
import { createHttpError } from "@/utils";
import { HttpStatus } from "@/constants/status.constant";
import { HttpResponse } from "@/constants/response-message.constant";
import { SessionDto } from "@/dtos/domain/SessionDTO";
import {
  createTimeWindowsFromRules,
  localTimeToUTC,
  utcToLocalTime,
  getDayBoundsInUTC,
} from "@/utils/timezone.utils";

export class SchedulingService implements ISchedulingService {
  constructor(
    private readonly _sessionRepo: ISessionRepository,
    private readonly _personalizationRepo: IPersonalizationRepository,
    private readonly _contractRepo: ITrainerClientContractRepository
  ) {}

  async getAvailabilityForDate(
    trainerId: string,
    date?: string
  ): Promise<AvailabilityResponse> {
    const target = date ? new Date(date) : new Date();
    
    // Fetch trainer personalization to get timezone
    const trainerPers = await this._personalizationRepo.findByUserId(trainerId);
    const data = trainerPers?.data as ITrainerPersonalization | undefined;
    
    // Get timezone from availability data first, fallback to basicInfo
    const trainerTimezone = data?.availability?.timezone || data?.basicInfo?.timeZone;
    
    if (!trainerTimezone) {
      throw createHttpError(HttpStatus.BAD_REQUEST, "Trainer timezone not found");
    }
    
    // Get day bounds in UTC based on trainer's timezone
    const { start: from, end: to } = getDayBoundsInUTC(target, trainerTimezone);

    const busySessions = await this._sessionRepo.findUnFreeSlotsByTrainer(
      trainerId,
      from,
      to
    );

    const rules = data?.availability?.weeklyRules;
    const weekday = format(target, "EEEE");

    let windows: Array<{ start: Date; end: Date }> = [];

    if (rules && rules[weekday] && Array.isArray(rules[weekday])) {
      // Create time windows in UTC using trainer's timezone
      windows = createTimeWindowsFromRules(rules, target, trainerTimezone);
    } else {
      // No rules → no slots
      return { date: format(target, "yyyy-MM-dd"), slots: [] };
    }

    const freeTimes: Array<{
      time: string;
      duration: number;
      isBooked: boolean;
    }> = [];
    const minutesIncrement = data?.availability?.slotLength || 30;
    const bufferMinutes = data?.availability?.bufferMinutes || 0;

    const now = new Date();

    for (const w of windows) {
      let cursor = w.start;

      // skip past-time slots for today
      if (isSameDay(target, now) && isBefore(cursor, now)) {
        const minutesDiff = Math.ceil(
          differenceInMinutes(now, cursor) / (minutesIncrement + bufferMinutes)
        );
        cursor = addMinutes(
          cursor,
          minutesDiff * (minutesIncrement + bufferMinutes)
        );
      }

      while (
        isBefore(addMinutes(cursor, minutesIncrement), w.end) ||
        isEqual(addMinutes(cursor, minutesIncrement), w.end)
      ) {
        const next = addMinutes(cursor, minutesIncrement);

        // skip past slots again just in case
        if (isSameDay(target, now) && isBefore(next, now)) {
          cursor = addMinutes(next, bufferMinutes);
          continue;
        }

        const overlap = busySessions.find(
          (s) => cursor < s.endTime && next > s.startTime
        );

        if (!overlap) {
          // Convert UTC time back to trainer's timezone for display
          const localTime = utcToLocalTime(cursor, trainerTimezone);
          freeTimes.push({
            time: localTime,
            duration: minutesIncrement,
            isBooked: false,
          });
        }

        cursor = addMinutes(next, bufferMinutes);
      }
    }
    return { date: format(target, "yyyy-MM-dd"), slots: freeTimes };
  }

  async bookSlot(input: BookSlotInput) {
    // Get trainer's timezone for proper conversion

    // const weeklyCount = await this._sessionRepo.coutnCancelledDocumentsInAWeek(input.clientId);
    // if(weeklyCount>=3){
    //   throw createHttpError(HttpStatus.BAD_REQUEST, HttpResponse.USER_ALREADY_CANCELLED_MORE_THAN_THREE);
    // }
    const trainerPers = await this._personalizationRepo.findByUserId(input.trainerId);
    const data = trainerPers?.data as ITrainerPersonalization | undefined;
    
    // Get timezone from availability data first, fallback to basicInfo
    const trainerTimezone = data?.availability?.timezone || data?.basicInfo?.timeZone;
    
    if (!trainerTimezone) {
      throw createHttpError(HttpStatus.BAD_REQUEST, "Trainer timezone not found");
    }
    const targetDate = new Date(input.date);
    
    // Convert local time to UTC using trainer's timezone
    const start = localTimeToUTC(input.time, targetDate, trainerTimezone);
    const end = addMinutes(start, input.duration || 30);

    // Prevent double booking by checking ANY session in the range
    // Use UTC day bounds for consistency
    const dayFrom = startOfDay(start);
    const dayTo = endOfDay(start);
    const free = await this._sessionRepo.findFreeSlotsByTrainer(
      input.trainerId,
      dayFrom,
      dayTo
    );
    const nonFree = await this._sessionRepo.findUnFreeSlotsByTrainer(
      input.trainerId,
      dayFrom,
      dayTo
    );
    const conflicts = [...free, ...nonFree];
    const taken = conflicts.find(
      (s) => !(end <= s.startTime || start >= s.endTime)
    );
    if (taken)
      throw createHttpError(HttpStatus.CONFLICT, HttpResponse.SLOTS_CONFLICT);

    // Create a session marked as booked
    await this._sessionRepo.create({
      trainerId: new Types.ObjectId(input.trainerId),
      clientId: new Types.ObjectId(input.clientId),
      startTime: start,
      endTime: end,
      status: "booked",
      meetingLink: `room_${Math.random().toString(36).slice(2, 10)}`,
    });
    await this._contractRepo.decrementSessionsRemaining(input.contractId);

    return;
  }

  async listBookings({
    trainerId,
    clientId,
    status,
  }: {
    trainerId?: string;
    clientId?: string;
    status?: string;
  }) {
    const query: FilterQuery<ISession> = {};
    if (trainerId) query.trainerId = new Types.ObjectId(trainerId);
    if (clientId) query.clientId = new Types.ObjectId(clientId);
    if (status === "upcoming") query.startTime = { $gte: new Date() };
    if (status === "past") query.endTime = { $lt: new Date() };
    const result = await this._sessionRepo.findAll(query);
    
    // Get trainer timezone for time conversion
    let trainerTimezone = 'UTC';
    if (trainerId) {
      const trainerPers = await this._personalizationRepo.findByUserId(trainerId);
      const data = trainerPers?.data as ITrainerPersonalization | undefined;
      trainerTimezone = data?.availability?.timezone || data?.basicInfo?.timeZone || 'UTC';
    }
    
    return SessionDto.mapToISessionData(result, trainerTimezone);
  }

  async cancelBooking(bookingId: string, clientId: string) {
    const session = await this._sessionRepo.findById(
      new Types.ObjectId(bookingId)
    );
    const contractId = (
      (await this._personalizationRepo.findByUserId(clientId))
        .data as IClientPersonalization
    ).contracts;
    if (!session) throw new Error("Booking not found");
    session.status = "cancelled";
    session.clientId = null as null;
    await this._contractRepo.incrementSessionsRemaining(contractId.toString());
    await this._sessionRepo.update(session.id, session);
    return;
  }
  async completeBooking(bookingId: string) {
    const session = await this._sessionRepo.findById(
      new Types.ObjectId(bookingId)
    );
    if (!session) throw new Error("Booking not found");
    session.status = "completed";
    await this._sessionRepo.update(session.id, session);
    return;
  }
}
