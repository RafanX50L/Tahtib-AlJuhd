import { AuditLogData, PersonalizationData, TrainerFileData } from "../implementation/trainer.repositor";

export interface ITrainerRepository {
  createTrainerPersonalization(data: PersonalizationData): Promise<any>;
  updateTrainerPersonalization(id: string, data: PersonalizationData): Promise<void>;
  createTrainerFile(data: TrainerFileData): Promise<any>;
  createAuditLog(data: AuditLogData): Promise<void>;
}