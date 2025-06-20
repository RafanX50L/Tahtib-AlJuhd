import { TrainerInterviewSchedule } from "@/models/implementation/TrainerInterview";
import { BaseRepository } from "../base.repository";
import { IUserModel } from "@/models/implementation/user.model";

export interface IAdminRepository extends BaseRepository<IUserModel> {
  findAllClientsWithPersonalization(): Promise<any>;
  updateStatusWithId(id: string, status: string | boolean): Promise<any>;
  findAllTrainersWithPersonalization(): Promise<any>;
  IsBlocked(id: string): Promise<boolean>;
  getPendingTrainers(start: number, limit: number): Promise<any>;
  getApprovedTrainers(start: number, limit: number): Promise<any>;
  scheduleInterview(
    trainerId: string,
    adminId: string,
    date: Date,
    time: string
  ): Promise<{success:boolean,message:string}>;
  submitInterviewFeedback(trainerId:string,adminId:string,feedback:TrainerInterviewSchedule["result"]):Promise<{success:boolean,message:string}>;
  approveTrainer(trainerId: string, salary: number):Promise<{success:boolean,message:string}>;
  rejectTrainer(trainerId: string):Promise<{success:boolean,message:string}>;
}
