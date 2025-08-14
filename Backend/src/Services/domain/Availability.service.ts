import { HttpResponse } from '@/constants/response-message.constant';
import { HttpStatus } from '@/constants/status.constant';
import { ITrainerPersonalization } from '@/core/interface/model/IPersonalization.model';
import { ISession } from '@/core/interface/model/ISession';
import { IPersonalizationRepository } from '@/core/interface/repositories/IPersonalization.repository';
import { ISessionRepository } from '@/core/interface/repositories/ISession.repository';
import { IAvailabilityService } from '@/core/interface/services/domain/IAvailability.Service';
import { createHttpError } from '@/utils';
import logger from '@/utils/logger.utils';
import { set, startOfDay, endOfDay } from 'date-fns';
import { Types } from 'mongoose';

interface Slot {
  date: string; // ISO date string, e.g., "2025-08-12"
  startTime: string; // e.g., "09:00"
  endTime: string; // e.g., "10:00"
}

export class AvailabilityService implements IAvailabilityService {
  constructor(
    private readonly _personalizationRepo: IPersonalizationRepository,
    private readonly _sessionRepo: ISessionRepository
  ) {}

  async setAvailability(trainerId: string, slots: ITrainerPersonalization['availability']['weeklySlots']): Promise<void> {
    // Validate inputs
    if (!trainerId) {
      logger.error('Trainer ID is missing');
      throw new Error('Trainer ID is required');
    }
    if (!Array.isArray(slots)) {
      logger.error(`Invalid slots input for trainer ${trainerId}: ${JSON.stringify(slots)}`);
      throw new Error('Slots must be an array');
    }
    const validSlots = slots.filter(slot => slot.date && slot.startTime && slot.endTime);
    if (validSlots.length === 0 && slots.length > 0) {
      logger.warn(`No valid slots provided for trainer ${trainerId}`);
      throw new Error('All slots must have date, startTime, and endTime');
    }

    const trainerPers = await this._personalizationRepo.findByUserId(trainerId);
    if (!trainerPers) {
      throw new Error('Trainer personalization not found');
    }

    const trainerData = trainerPers.data as ITrainerPersonalization;
    const currentWeeklySlots = trainerData.availability?.weeklySlots || [];

    // Check new slots against existing sessions for the specific date
    const newSlots = [];
    for (const slot of validSlots) {
      const slotDate = new Date(slot.date);
      const [startHours, startMinutes] = slot.startTime.split(':').map(Number);
      const [endHours, endMinutes] = slot.endTime.split(':').map(Number);
      const startTime = set(slotDate, { hours: startHours, minutes: startMinutes });
      const endTime = set(slotDate, { hours: endHours, minutes: endMinutes });

      // Check for conflicts with existing sessions on the same date
      const existingSessions = await this._sessionRepo.findFreeSlotsByTrainer(
        trainerId,
        startOfDay(slotDate),
        endOfDay(slotDate)
      );
      const hasConflict = existingSessions.some(session => {
        const sessionStart = session.startTime.getTime();
        const sessionEnd = session.endTime.getTime();
        const newStart = startTime.getTime();
        const newEnd = endTime.getTime();
        return newStart <= sessionEnd && newEnd >= sessionStart;
      });

      if (!hasConflict) {
        newSlots.push(slot);
      }
    }

    if (newSlots.length === 0 && validSlots.length > 0) {
      logger.warn(`All provided slots conflict with existing sessions for trainer ${trainerId}`);
      throw createHttpError(HttpStatus.CONFLICT, HttpResponse.SLOTS_CONFLICT);
    }

    // Append non-conflicting slots to weeklySlots
    const updatedWeeklySlots = [...currentWeeklySlots, ...newSlots];

    
    await this._personalizationRepo.updateTrainerData(trainerId, {
      ...trainerData,
      availability: { ...trainerData.availability, weeklySlots: updatedWeeklySlots },
    });

    await this.generateSlots(trainerId, newSlots);
  }

  async generateSlots(trainerId: string, slots: Slot[]): Promise<void> {
    const trainerPers = await this._personalizationRepo.findByUserId(trainerId);
    logger.debug(`Generating slots for trainer: ${trainerPers}`, trainerPers);
    if (!trainerPers || !slots.length) {
      logger.warn(`No trainer or slots found for trainer: ${trainerId}`);
      return;
    }

    for (const slot of slots) {
      const slotDate = new Date(slot.date);
      const [startHours, startMinutes] = slot.startTime.split(':').map(Number);
      const [endHours, endMinutes] = slot.endTime.split(':').map(Number);
      const startTime = set(slotDate, { hours: startHours, minutes: startMinutes });
      const endTime = set(slotDate, { hours: endHours, minutes: endMinutes });

      const existing = await this._sessionRepo.findFreeSlotsByTrainer(trainerId, startTime, endTime);
      if (!existing.some(s => s.startTime.getTime() === startTime.getTime())) {
        const data = await this._sessionRepo.create({
          trainerId: new Types.ObjectId(trainerId),
          startTime,
          endTime,
          status: 'free',
          meetingLink: "room_" + Math.random().toString(36).substring(2, 10),
        });
        logger.debug('Created new session:', data);
      }
    }
  }

  async getFreeSlots(trainerId: string, fromDate: Date, toDate: Date): Promise<ISession[]> {
    return await this._sessionRepo.findFreeSlotsByTrainer(trainerId, fromDate, toDate);
  }
}
