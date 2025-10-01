import { ITrainerPersonalization } from '@/core/interface/model/IPersonalization.model';
import { ISession } from '@/core/interface/model/ISession';
import { IPersonalizationRepository } from '@/core/interface/repositories/IPersonalization.repository';
import { ISessionRepository } from '@/core/interface/repositories/ISession.repository';
import { IAvailabilityService, ISessionView } from '@/core/interface/services/domain/IAvailability.Service';
import { SessionDto } from '@/dtos/domain/SessionDTO';


export class AvailabilityService implements IAvailabilityService {
  constructor(
    private readonly _personalizationRepo: IPersonalizationRepository,
    private readonly _sessionRepo: ISessionRepository
  ) {}

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
    
    // Get trainer's timezone from basicInfo
    const trainerTimezone = trainerData.basicInfo?.timeZone || 'UTC';

    // Remove weeklySlots completely
    const availability: ITrainerPersonalization["availability"] = {
      weeklyRules: rules.weeklyRules,
      slotLength: rules.slotLength || 30,    // in minutes, e.g., 30
      bufferMinutes: rules.bufferMinutes|| 0,
      engagementType: trainerData.availability?.engagementType || "contract",
      timezone: trainerTimezone, // Store trainer's timezone with weekly rules
    };

    await this._personalizationRepo.updateTrainerData(trainerId, {
      ...trainerData,
      availability,
    });
  }

  async getFreeSlots(trainerId: string, fromDate: Date, toDate: Date): Promise<ISessionView[]> {
    const result = await this._sessionRepo.findFreeSlotsByTrainer(trainerId, fromDate, toDate);
    return await SessionDto.mapToISessionData(result);
  }

  async getAllSlots(trainerId: string, fromDate: Date, toDate: Date): Promise<ISession[]> {
    const free = await this._sessionRepo.findFreeSlotsByTrainer(trainerId, fromDate, toDate);
    const booked = await this._sessionRepo.findUnFreeSlotsByTrainer(trainerId, fromDate, toDate);
    return [...free, ...booked].sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
  }

  async getWeeklyRules(trainerId: string){
    const trainerPers = await this._personalizationRepo.findByUserId(trainerId);
    if (!trainerPers) return null;
    const trainerData = trainerPers.data as ITrainerPersonalization;
    return trainerData?.availability || null;
  }

  async getUnFreeSlotsByTrainer(trainerId: string, fromDate: Date, toDate: Date): Promise<ISessionView[]> {
    const result = await this._sessionRepo.findUnFreeSlotsByTrainer(trainerId, fromDate, toDate);
    return await SessionDto.mapToISessionData(result);
  }
  async getUnFreeSlotsByClient(clinetId: string, fromDate: Date, toDate: Date): Promise<ISessionView[]> {
    const result = await this._sessionRepo.findUnFreeSlotsByClient(clinetId, fromDate, toDate);
    return await SessionDto.mapToISessionData(result);
  }
}
