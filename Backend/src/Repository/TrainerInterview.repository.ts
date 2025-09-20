import { ITrainerInterview } from "@/core/interface/model/ITrainerInterview.model";
import { BaseRepository } from "./base.repository";
import { TrainerInterviewModel } from "@/models/TrainerInterview.model";
import { ITrainerInterviewRepository } from "@/core/interface/repositories/ITraienrInterview.repository";
import { addHours, subHours } from "date-fns";

export class TrainerInterviewRepository
  extends BaseRepository<ITrainerInterview>
  implements ITrainerInterviewRepository
{
  constructor() {
    super(TrainerInterviewModel);
  }
  _placeholder: never;

  // trainerInterview.repository.ts
  async checkConflict(adminID: string, startTime: Date): Promise<boolean> {
    const conflictStart = subHours(startTime, 1);
    const conflictEnd = addHours(startTime, 1);

    const conflict = await this.model.findOne({
      adminID,
      $or: [
        {
          startTime: { $lt: conflictEnd },
          endTime: { $gt: conflictStart },
        },
      ],
    });

    return !!conflict;
  }

  async updateInterviewResult(
    trainerId: string,
    adminId: string,
    feedback: ITrainerInterview["result"]
  ) {
    const updatedData = await this.model.findOneAndUpdate(
      { trainerId: trainerId, adminId: adminId },
      {
        $set: {
          result: feedback,
          completed: true,
        },
      },
      { new: true } // This returns the updated document
    );

    return updatedData;
  }
  
}
