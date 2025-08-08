import { TrainerCardDTO } from "@/dtos/admin/TrainerDTO";
import { ITrainerInterview } from "../../model/ITrainerInterview.model";

export interface IAdminTrainerSerice {
    getApprovedTrainers(page:number,limit:number,search:string):Promise< { data: TrainerCardDTO[]; totalCount: number } >;
    getPendingTrainers(page:number,limit:number,search:string);
    scheduleInterview(trainerId: string,adminId: string,date: Date,time: string): Promise<{ success: boolean; message: string }>;
    submitInterviewFeedback(trainerId:string,adminId:string,feedback:ITrainerInterview["result"]):Promise<{success:boolean}>;
    approveTrainer(trainerId:string,salary:number):Promise<void>;
    rejectTrainer(trainerId:string):Promise<void>;
}