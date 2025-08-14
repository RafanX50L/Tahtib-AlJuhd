import { Request } from "express";
import { ITrainerPersonalization } from "../../model/IPersonalization.model";
import { TrainerProfileDTO } from "@/dtos/trainer/TrainerDTO";

export interface ITrainerPersonalizationService {
  /** Reserved for Workout plan specific methods */
  _placeholder?: never;

  submitApplication(userId: string, req: Request): Promise<void>;
  getPendingApplicationDetails(uesrId: string):Promise<Partial<ITrainerPersonalization>>;
  getTrainerProfile(userId: string): Promise<TrainerProfileDTO>;
  updateProfileData(userId: string, data:Partial<{name:string,location:string,phoneNumber:string}>): Promise<void>;
  getSalary(userId: string): Promise< number >;
}
