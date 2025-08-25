import { ITrainerSchedule } from "../../model/ITrainerSchedule";

export interface ITrainerScheduleService {
  createSchedule(trainerId: string, scheduleData: Partial<ITrainerSchedule>): Promise<ITrainerSchedule>;
  updateSchedule(trainerId: string, scheduleData: Partial<ITrainerSchedule>): Promise<ITrainerSchedule>;
  getSchedule(trainerId: string): Promise<ITrainerSchedule | null>;
  getAvailableSlots(trainerId: string, date: Date): Promise<Array<{
    startTime: string;
    endTime: string;
    duration: number;
    price: number;
  }>>;
  toggleScheduleActive(trainerId: string, isActive: boolean): Promise<ITrainerSchedule>;
}
