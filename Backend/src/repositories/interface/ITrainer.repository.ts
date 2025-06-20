import { TrainerData } from "@/services/implementation/Trainer.service";
import { AuditLogData, PersonalizationData, TrainerFileData } from "../implementation/trainer.repositor";

export interface ITrainerRepository {
  getPendingApplicationDetails(trainerId:string):Promise<any>;
  createTrainerPersonalization(data: PersonalizationData): Promise<any>;
  updateTrainerPersonalization(id: string, data: PersonalizationData): Promise<void>;
  createTrainerFile(data: TrainerFileData): Promise<any>;
  createAuditLog(data: AuditLogData): Promise<void>;
  getProfileData(userId:string);
  updateProfilePicture(clientId: string, PhotoId: string);
   findTrainerById(trainerId: string);
   updateTrainer(trainerId:string, updateData:any);
}