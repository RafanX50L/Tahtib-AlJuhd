import { Types } from "mongoose";
import { IPersonalization } from "../model/IPersonalization.model";
import { IBaseRepository } from "./IBase.repository";

export interface ITrainerPersonalizationRepository extends IBaseRepository<IPersonalization> {
    _placeholder:never;
    getApprovedTrainers(page:number,limit:number,search:string);
    getPendingTrainers(page: number, limit: number, search:string );
    updateInterviewDetails(trainerId:string,interviewId:string):Promise<void>;
    updateTrainerStatus(trainerId: string, status:string ):Promise<IPersonalization>;
    approveTrainer(trainerId: string, salary: number):Promise<IPersonalization>;
    getTrainerProfileData(id: string);
    updateProfilePictureId(clientId: string, id: Types.ObjectId):Promise<IPersonalization>;
    getAvailableTrainer(currentTrainerId:string,page: number, limit: number, search: string, specialty: string);
}