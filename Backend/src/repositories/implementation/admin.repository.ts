import { IUserModel, UserModel } from "../../models/implementation/user.model";
import { BaseRepository } from "../base.repository";
import { IAdminRepository } from "../interface/IAdmin.respository";

export class AdminRepository extends BaseRepository<IUserModel> implements IAdminRepository{
    constructor(){
        super(UserModel);
    }

    async findAllClientsWithPersonalization(){
        try{
            return await this.model.find({role:'client'}).populate('personalization');
        }catch(error){
            console.error('Error finding clients',error);
            throw new Error("Error finding clients");
        }
    }

    async updateStatusWithId(id:string,status:boolean){
        try{
            return await this.model.findByIdAndUpdate(id, { $set: { isBlocked: status } });
        }catch(error){
            console.error('Error finding clients',error);
            throw new Error("Error finding clients");
        }
    }

    async findAllTrainersWithPersonalization(){
        try{
            return await this.model.find({role:'trainer'}).populate('personalization');
        }catch(error){
            console.error('Error finding clients',error);
            throw new Error("Error finding clients");
        }
    }

    async IsBlocked(id:string){
        try{
            return await this.isBlocked(id);
        }catch(error){
            console.error('Error finding clients',error);
            throw new Error("Error finding clients");
        }
    }
}