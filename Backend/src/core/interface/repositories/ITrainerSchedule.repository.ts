import { IBaseRepository } from "./IBase.repository";
import { ITrainerSchedule } from "../model/ITrainerSchedule";

export interface ITrainerScheduleRepository extends IBaseRepository<ITrainerSchedule> {
  findByTrainerId(trainerId: string): Promise<ITrainerSchedule | null>;
}
