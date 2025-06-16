import { TrainerData } from "@/services/implementation/Trainer.service";
import { ITrainerRepository } from "../interface/ITrainer.repository";
import { PersonalizationModel } from "@/models/implementation/personalization.model";
import { AuditLog, TrainerFile } from "@/models/implementation/trainer/sample";
import { BaseRepository } from "../base.repository";
import { IUserModel, UserModel } from "@/models/implementation/user.model";
import { ObjectId } from "mongoose";

export interface TrainerFileData {
  trainerId: string;
  fileName: string;
  filePath: string;
  fileType: string;
}

export interface AuditLogData {
  userId?: string;
  action: string;
  entityType: string;
  entityId: string;
  details: { message: string };
}

export interface PersonalizationData {
  userId: string;
  role: "trainer";
  data: TrainerData;
}

export class TrainerRepository
  extends BaseRepository<IUserModel>
  implements ITrainerRepository
{
  constructor() {
    
    super(UserModel);
  }
  async createTrainerPersonalization(data: PersonalizationData): Promise<any> {
    const personalization = new PersonalizationModel(data);
    return await personalization.save();
  }

  async updateTrainerPersonalization(
    id: string,
    data: PersonalizationData
  ): Promise<void> {
    console.log("datgsakdjfasdf", data, data.role);
    const result = await PersonalizationModel.findByIdAndUpdate(id, data, {
      runValidators: true,
      new: true,
    });
    const user = await this.findByIdAndUpdatePersonalization(
      data.userId,
      result?._id
    );
    if (!result && !user) {
      throw new Error("Personalization document not found");
    }
  }

  async createTrainerFile(data: TrainerFileData): Promise<any> {
    const trainerFile = new TrainerFile(data);
    return await trainerFile.save();
  }

  async createAuditLog(data: AuditLogData): Promise<void> {
    const auditLog = new AuditLog(data);
    await auditLog.save();
  }
}
