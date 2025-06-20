import { TrainerInterviewSchedule } from "@/models/implementation/TrainerInterview";

export interface IAdminService  {
    getAllClients: (userid:string) => Promise<any>;
    blockOrUnblock(userId:string):Promise<{success:boolean,message:string}>;
    updateClientStatus: (id:string,status:boolean)=> Promise<string>;
    getAllTrainers: () => Promise<any>;
    updateTrainertatus: (id:string,status:string)=> Promise<string>;
    getPendingTrainers(page:number):Promise<any>;
    getApprovedTrainers(page:number):Promise<any>;
    scheduleInterview(trainerId:string,adminId:string,date:Date,time:string):Promise<{success:boolean,message:string}>;
    submitInterviewFeedback(trainerId:string,adminId:string,feedback:TrainerInterviewSchedule["result"]):Promise<{success:boolean,message:string}>;
    approveTrainer(trainerId:string,salary:number):Promise<{success:boolean,message:string}>;
    rejectTrainer(trainerId:string):Promise<{success:boolean,message:string}>;
}