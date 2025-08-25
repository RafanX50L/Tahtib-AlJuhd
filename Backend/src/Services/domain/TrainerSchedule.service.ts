import { ITrainerScheduleRepository } from "@/core/interface/repositories/ITrainerSchedule.repository";
import { ITrainerScheduleService } from "@/core/interface/services/domain/ITrainerSchedule.service";
import { ITrainerSchedule } from "@/core/interface/model/ITrainerSchedule";
import { createHttpError } from "@/utils";
import { HttpStatus } from "@/constants/status.constant";
import { Types } from "mongoose";

export class TrainerScheduleService implements ITrainerScheduleService {
  constructor(
    private readonly _trainerScheduleRepository: ITrainerScheduleRepository
  ) {}

  async createSchedule(trainerId: string, scheduleData: Partial<ITrainerSchedule>): Promise<ITrainerSchedule> {
    // Check if schedule already exists for this trainer
    const existingSchedule = await this._trainerScheduleRepository.findByTrainerId(trainerId);
    if (existingSchedule) {
      throw createHttpError(
        HttpStatus.CONFLICT,
        "Schedule already exists for this trainer"
      );
    }

    const schedule = await this._trainerScheduleRepository.create({
      trainerId: new Types.ObjectId(trainerId),
      weeklySchedule: scheduleData.weeklySchedule || {},
      timezone: scheduleData.timezone || 'UTC',
      isActive: true
    });

    return schedule;
  }

  async updateSchedule(trainerId: string, scheduleData: Partial<ITrainerSchedule>): Promise<ITrainerSchedule> {
    const existingSchedule = await this._trainerScheduleRepository.findByTrainerId(trainerId);
    if (!existingSchedule) {
      throw createHttpError(
        HttpStatus.NOT_FOUND,
        "Schedule not found for this trainer"
      );
    }

    const updatedSchedule = await this._trainerScheduleRepository.update(
      existingSchedule._id.toString(),
      scheduleData
    );

    return updatedSchedule;
  }

  async getSchedule(trainerId: string): Promise<ITrainerSchedule | null> {
    return await this._trainerScheduleRepository.findByTrainerId(trainerId);
  }

  async getAvailableSlots(trainerId: string, date: Date): Promise<Array<{
    startTime: string;
    endTime: string;
    duration: number;
    price: number;
  }>> {
    const schedule = await this._trainerScheduleRepository.findByTrainerId(trainerId);
    if (!schedule || !schedule.isActive) {
      return [];
    }

    const dayOfWeek = this.getDayOfWeek(date);
    const daySchedule = schedule.weeklySchedule[dayOfWeek];
    
    if (!daySchedule || !daySchedule.isAvailable) {
      return [];
    }

    return daySchedule.timeSlots;
  }

  async toggleScheduleActive(trainerId: string, isActive: boolean): Promise<ITrainerSchedule> {
    const existingSchedule = await this._trainerScheduleRepository.findByTrainerId(trainerId);
    if (!existingSchedule) {
      throw createHttpError(
        HttpStatus.NOT_FOUND,
        "Schedule not found for this trainer"
      );
    }

    const updatedSchedule = await this._trainerScheduleRepository.update(
      existingSchedule._id.toString(),
      { isActive }
    );

    return updatedSchedule;
  }

  private getDayOfWeek(date: Date): string {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[date.getDay()];
  }
}
