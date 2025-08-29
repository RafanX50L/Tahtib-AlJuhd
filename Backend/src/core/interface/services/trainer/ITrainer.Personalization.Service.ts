import { Request } from "express";
import { ITrainerPersonalization } from "../../model/IPersonalization.model";
import { TrainerProfileDTO } from "@/dtos/trainer/TrainerDTO";
import { ITrainerInterview } from "../../model/ITrainerInterview.model";

export interface IInterviewDetails {
  adminId: string;
  trainerId: string;
  startTime: Date; 
  endTime: Date ;
  date: Date;
  roomId: string;
  completed: boolean;
  result: ITrainerInterview['result'];
}

export interface IPendingApplicationReturnType {
  basicInfo: ITrainerPersonalization["basicInfo"];
  interviewDetails: IInterviewDetails | null;
}


export interface ITrainerPersonalizationService {
  /** Reserved for Workout plan specific methods */
  _placeholder?: never;

  submitApplication(userId: string, req: Request): Promise<void>;
  getPendingApplicationDetails(uesrId: string):Promise<IPendingApplicationReturnType>;
  getTrainerProfile(userId: string): Promise<TrainerProfileDTO>;
  updateProfileData(userId: string, data:Partial<{name:string,location:string,phoneNumber:string}>): Promise<void>;
  getSalary(userId: string): Promise< number >;
}
