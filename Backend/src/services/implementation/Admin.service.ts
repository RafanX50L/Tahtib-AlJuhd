import { createHttpError } from "../../utils";
import { IAdminService } from "../interface/IAdmin.service";
import { IAdminRepository } from "../../repositories/interface/IAdmin.respository";
import { HttpStatus } from "../../constants/status.constant";
import { HttpResponse } from "../../constants/response-message.constant";
import { IUser } from "@/models/interface/IUser.model";
import { TrainerInterviewSchedule } from "@/models/implementation/TrainerInterview";

export class AdminService implements IAdminService{
    constructor(private readonly _adminRepository: IAdminRepository) {} // Replace 'any' with the actual type of your repository

    async getAllClients(userid:string): Promise<IUser> {
        // Logic to get all clients
        const isBlocked = await this._adminRepository.IsBlocked(userid);
        if(isBlocked){
            createHttpError(HttpStatus.FORBIDDEN,HttpResponse.USER_IS_BLOKED);
        }
        // console.log('functin entered to here');
        const clientData = await this._adminRepository.findAllClientsWithPersonalization();
        // console.log(clientData);
        return clientData;
    }

    async blockOrUnblock(userId:string):Promise<{success:boolean,message:string}>{
        const response = await this._adminRepository.blockOrUnblockUser(userId);
        return {success: response.success,message:response.message};
    }

    

    async updateClientStatus(id:string,status:boolean):Promise<string>{
        // console.log('enterd ot update status');
        await this._adminRepository.updateStatusWithId(id,status);
        return 'Update Success Full';
    }
    
    async getAllTrainers(): Promise<IUser> {
        // Logic to get all trainers
        // console.log('functin entered to here');
        const trainerData = await this._adminRepository.findAllTrainersWithPersonalization();
        // console.log(trainerData);
        return trainerData;
    }

    async updateTrainertatus(id:string,status:string):Promise<string>{
        // console.log('enterd ot update status');
        await this._adminRepository.updateStatusWithId(id,status);
        return 'Update Success Full';
    }

    async getPendingTrainers(page:number):Promise<any>{
        const skip = (page-1) * 8;
        const limit = 8;

        const pendingTrainers = await this._adminRepository.getPendingTrainers(skip,limit);
        return pendingTrainers;
    
    }
    async getApprovedTrainers(page:number):Promise<any>{
        const skip = (page-1) * 8;
        const limit = 8;

        const approvedTrainers = await this._adminRepository.getApprovedTrainers(skip,limit);
        return approvedTrainers;
    
    }

    async scheduleInterview(trainerId:string,adminId:string,date:Date,time:string):Promise<{success:boolean,message:string}>{
        const response = await this._adminRepository.scheduleInterview(trainerId,adminId,date,time);
        return {success: response.success,message:response.message};
    }
    
    async submitInterviewFeedback(trainerId:string,adminId:string,feedback:TrainerInterviewSchedule["result"]):Promise<{success:boolean,message:string}>{
        const response = await this._adminRepository.submitInterviewFeedback(trainerId,adminId,feedback);
        return {success: response.success,message:response.message};
    }
    
    async approveTrainer(trainerId:string,salary:number):Promise<{success:boolean,message:string}>{
        const response = await this._adminRepository.approveTrainer(trainerId,salary);
        return {success: response.success,message:response.message};

    }
    async rejectTrainer(trainerId:string):Promise<{success:boolean,message:string}>{
        const response = await this._adminRepository.rejectTrainer(trainerId);
        return {success: response.success,message:response.message};

    }
}