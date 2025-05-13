import { IAdminService } from "../interface/IAdmin.service";
import { IAdminRepository } from "@/repositories/interface/IAdmin.respository";

export class AdminService implements IAdminService{
    constructor(private readonly _adminRepository: IAdminRepository) {} // Replace 'any' with the actual type of your repository

    async getAllClients(): Promise<any> {
        // Logic to get all clients
        console.log('functin entered to here');
        const clientData = await this._adminRepository.findAllClientsWithPersonalization();
        // console.log(clientData);
        return clientData;
    }
    async updateClientStatus(id:string,status:string):Promise<string>{
        console.log('enterd ot update status');
        await this._adminRepository.updateStatusWithId(id,status);
        return 'Update Success Full';
    }
    
    async getAllTrainers(): Promise<any> {
        // Logic to get all trainers
        console.log('functin entered to here');
        const trainerData = await this._adminRepository.findAllTrainersWithPersonalization();
        console.log(trainerData);
        return trainerData;
    }

    async updateTrainertatus(id:string,status:string):Promise<string>{
        console.log('enterd ot update status');
        await this._adminRepository.updateStatusWithId(id,status);
        return 'Update Success Full';
    }
}