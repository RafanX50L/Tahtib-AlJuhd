import { BaseRepository } from "./base.repository";
import { ITrainerScheduleRepository } from "@/core/interface/repositories/ITrainerSchedule.repository";
import { ITrainerSchedule } from "@/core/interface/model/ITrainerSchedule";
import { TrainerScheduleModel } from "@/models/TrainerSchedule.model";
import { Types } from "mongoose";

export class TrainerScheduleRepository extends BaseRepository<ITrainerSchedule> implements ITrainerScheduleRepository {
  constructor() {
    super(TrainerScheduleModel);
  }

  async findByTrainerId(trainerId: string): Promise<ITrainerSchedule | null> {
    return await this.model.findOne({ trainerId: new Types.ObjectId(trainerId) }).exec();
  }
}
