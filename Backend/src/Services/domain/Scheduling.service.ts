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
    const from = startOfDay(target);
    const to = endOfDay(target);

    const busySessions = await this._sessionRepo.findUnFreeSlotsByTrainer(
      trainerId,
      from,
      to
    );

    // Fetch trainer personalization
    const trainerPers = await this._personalizationRepo.findByUserId(trainerId);
    const data = trainerPers?.data as ITrainerPersonalization | undefined;

    const rules = data?.availability?.weeklyRules;
    const dayStr = format(target, "yyyy-MM-dd");
    const weekday = format(target, "EEEE");

    let windows: Array<{ start: Date; end: Date }> = [];

    if (rules && rules[weekday] && Array.isArray(rules[weekday])) {
      windows = rules[weekday].map((r) => ({
        start: new Date(`${dayStr}T${r.startTime}:00`),
        end: new Date(`${dayStr}T${r.endTime}:00`),
      }));
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
          freeTimes.push({
            time: format(cursor, "HH:mm"),
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
    const start = new Date(`${input.date}T${input.time}:00`);
    const end = addMinutes(start, input.duration || 30);

    // Prevent double booking by checking ANY session in the range
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
    return result;
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
