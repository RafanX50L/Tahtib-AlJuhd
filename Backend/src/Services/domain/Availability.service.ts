import { ITrainerPersonalization } from '@/core/interface/model/IPersonalization.model';
import { ISession } from '@/core/interface/model/ISession';
import { IPersonalizationRepository } from '@/core/interface/repositories/IPersonalization.repository';
import { ISessionRepository } from '@/core/interface/repositories/ISession.repository';
import { IAvailabilityService } from '@/core/interface/services/domain/IAvailability.Service';
import { addWeeks, set, startOfWeek } from 'date-fns';
import { Types } from 'mongoose';

export class AvailabilityService implements IAvailabilityService {
  constructor(
    private readonly _personalizationRepo: IPersonalizationRepository,
    private readonly _sessionRepo: ISessionRepository) {}

  async setAvailability(trainerId: string, slots: ITrainerPersonalization['availability']['weeklySlots']): Promise<void> {
    const trainerPers = await this._personalizationRepo.findByUserId(trainerId);
    if (!trainerPers) throw new Error('Trainer not found');
    const trainerData = trainerPers.data as ITrainerPersonalization;
    await this._personalizationRepo.updateTrainerData(trainerId, {
      ...trainerData,
      availability: { ...trainerData.availability, weeklySlots: slots },
    });
    await this.generateSlots(trainerId, 4);
  }

  async generateSlots(trainerId: string, weeksAhead: number): Promise<void> {
    const trainerPers = await this._personalizationRepo.findByUserId(trainerId);
    if (!trainerPers) return;
    const avail = (trainerPers.data as ITrainerPersonalization).availability?.weeklySlots;
    if (!avail) return;

    const now = new Date();
    const start = startOfWeek(now, { weekStartsOn: 1 }); // Monday

    for (const slot of avail) {
      for (let week = 0; week < weeksAhead; week++) {
        const weekStart = addWeeks(start, week);
        const [startHours, startMinutes] = slot.startTime.split(':').map(Number);
        const [endHours, endMinutes] = slot.endTime.split(':').map(Number);
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayIndex = days.indexOf(slot.day);
        const startTime = set(weekStart, { date: weekStart.getDate() + dayIndex, hours: startHours, minutes: startMinutes });
        const endTime = set(weekStart, { date: weekStart.getDate() + dayIndex, hours: endHours, minutes: endMinutes });

        const existing = await this._sessionRepo.findFreeSlotsByTrainer(trainerId, startTime, endTime);
        if (!existing.some(s => s.startTime.getTime() === startTime.getTime())) {
          await this._sessionRepo.create({
            trainerId: new Types.ObjectId(trainerId),
            startTime,
            endTime,
            status: 'free',
          });
        }
      }
    }
  }

  async getFreeSlots(trainerId: string, fromDate: Date, toDate: Date): Promise<ISession[]> {
    return await this._sessionRepo.findFreeSlotsByTrainer(trainerId, fromDate, toDate);
  }
}