import { createHttpError } from "../../utils";
import { IAdminService } from "../interface/IAdmin.service";
import { IAdminRepository } from "../../repositories/interface/IAdmin.respository";
import { HttpStatus } from "../../constants/status.constant";
import { HttpResponse } from "../../constants/response-message.constant";
import { IUser } from "@/models/interface/IUser.model";
import { start } from "repl";

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

        const pendingTrainers = this._adminRepository.getPendingTrainers(skip,limit);
        console.log('pendingtrainers',pendingTrainers);
        return pendingTrainers;
    }
}