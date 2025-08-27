import { ITrainerPersonalization } from '@/core/interface/model/IPersonalization.model';
import { ISession } from '@/core/interface/model/ISession';
import { IPersonalizationRepository } from '@/core/interface/repositories/IPersonalization.repository';
import { ISessionRepository } from '@/core/interface/repositories/ISession.repository';
import { IAvailabilityService } from '@/core/interface/services/domain/IAvailability.Service';


export class AvailabilityService implements IAvailabilityService {
  constructor(
    private readonly _personalizationRepo: IPersonalizationRepository,
    private readonly _sessionRepo: ISessionRepository
  ) {}

  // async setAvailability(trainerId: string, slots: ITrainerPersonalization['availability']): Promise<void> {
  //   // Validate inputs
  //   if (!trainerId) {
  //     logger.error('Trainer ID is missing');
  //     throw new Error('Trainer ID is required');
  //   }
  //   if (!Array.isArray(slots)) {
  //     logger.error(`Invalid slots input for trainer ${trainerId}: ${JSON.stringify(slots)}`);
  //     throw new Error('Slots must be an array');
  //   }
  //   const validSlots = slots.filter(slot => slot.date && slot.startTime && slot.endTime);
  //   if (validSlots.length === 0 && slots.length > 0) {
  //     logger.warn(`No valid slots provided for trainer ${trainerId}`);
  //     throw new Error('All slots must have date, startTime, and endTime');
  //   }

  //   const trainerPers = await this._personalizationRepo.findByUserId(trainerId);
  //   if (!trainerPers) {
  //     throw new Error('Trainer personalization not found');
  //   }

  //   const trainerData = trainerPers.data as ITrainerPersonalization;
  //   const currentWeeklySlots = trainerData.availability || [];

  //   // Check new slots against existing sessions for the specific date
  //   const newSlots = [];
  //   for (const slot of validSlots) {
  //     const slotDate = new Date(slot.date);
  //     const [startHours, startMinutes] = slot.startTime.split(':').map(Number);
  //     const [endHours, endMinutes] = slot.endTime.split(':').map(Number);
  //     const startTime = set(slotDate, { hours: startHours, minutes: startMinutes });
  //     const endTime = set(slotDate, { hours: endHours, minutes: endMinutes });

  //     // Check for conflicts with existing sessions on the same date
  //     const existingSessions = await this._sessionRepo.findFreeSlotsByTrainer(
  //       trainerId,
  //       startOfDay(slotDate),
  //       endOfDay(slotDate)
  //     );
  //     const hasConflict = existingSessions.some(session => {
  //       const sessionStart = session.startTime.getTime();
  //       const sessionEnd = session.endTime.getTime();
  //       const newStart = startTime.getTime();
  //       const newEnd = endTime.getTime();
  //       return newStart <= sessionEnd && newEnd >= sessionStart;
  //     });

  //     if (!hasConflict) {
  //       newSlots.push(slot);
  //     }
  //   }

  //   if (newSlots.length === 0 && validSlots.length > 0) {
  //     logger.warn(`All provided slots conflict with existing sessions for trainer ${trainerId}`);
  //     throw createHttpError(HttpStatus.CONFLICT, HttpResponse.SLOTS_CONFLICT);
  //   }

  //   // Append non-conflicting slots to weeklySlots
  //   const updatedWeeklySlots = [...currentWeeklySlots, ...newSlots];

    
  //   await this._personalizationRepo.updateTrainerData(trainerId, {
  //     ...trainerData,
  //     availability: { ...trainerData.availability, weeklySlots: updatedWeeklySlots },
  //   });

  //   await this.generateSlots(trainerId, newSlots);
  // }

  /**
   * Set weekly day-level rules like Mon-Fri 09:00-18:00, with optional slotLength and bufferMinutes
   * rules example:
   * { Monday: [{ startTime: '09:00', endTime: '18:00' }], Tuesday: [...], slotLength: 30, bufferMinutes: 0 }
   */
  async setWeeklyRules(
    trainerId: string,
    rules: ITrainerPersonalization["availability"]
  ): Promise<void> {
    if (!trainerId) throw new Error("Trainer ID is required");

    const trainerPers = await this._personalizationRepo.findByUserId(trainerId);
    if (!trainerPers) throw new Error("Trainer personalization not found");

    const trainerData = trainerPers.data as ITrainerPersonalization;

    // Remove weeklySlots completely
    const availability: ITrainerPersonalization["availability"] = {
      weeklyRules: rules.weeklyRules,
      slotLength: rules.slotLength || 30,    // in minutes, e.g., 30
      bufferMinutes: rules.bufferMinutes|| 0,
      engagementType: trainerData.availability?.engagementType || "contract",
    };

    await this._personalizationRepo.updateTrainerData(trainerId, {
      ...trainerData,
      availability,
    });
  }

  async getFreeSlots(trainerId: string, fromDate: Date, toDate: Date): Promise<ISession[]> {
    return await this._sessionRepo.findFreeSlotsByTrainer(trainerId, fromDate, toDate);
  }

  async getAllSlots(trainerId: string, fromDate: Date, toDate: Date): Promise<ISession[]> {
    const free = await this._sessionRepo.findFreeSlotsByTrainer(trainerId, fromDate, toDate);
    const booked = await this._sessionRepo.findUnFreeSlotsByTrainer(trainerId, fromDate, toDate);
    return [...free, ...booked].sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
  }

  async getWeeklyRules(trainerId: string): Promise<Record<string, unknown> | null> {
    const trainerPers = await this._personalizationRepo.findByUserId(trainerId);
    if (!trainerPers) return null;
    const trainerData = trainerPers.data as ITrainerPersonalization;
    return trainerData?.availability || null;
  }

  async getUnFreeSlotsByTrainer(trainerId: string, fromDate: Date, toDate: Date): Promise<ISession[]> {
    return await this._sessionRepo.findUnFreeSlotsByTrainer(trainerId, fromDate, toDate);
  }
  async getUnFreeSlotsByClient(clinetId: string, fromDate: Date, toDate: Date): Promise<ISession[]> {
    return await this._sessionRepo.findUnFreeSlotsByClient(clinetId, fromDate, toDate);
  }
}
