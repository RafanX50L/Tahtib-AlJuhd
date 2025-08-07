import { ITrainerInterview } from "../model/ITrainerInterview.model";
import { IBaseRepository } from "./IBase.repository";

export interface ITrainerInterviewRepository extends IBaseRepository<ITrainerInterview> {
    _placeholder:never;
    checkConflict(adminID: string, startTime: Date): Promise<boolean>;
    updateInterviewResult(trainerId: string,adminId: string,feedback: ITrainerInterview["result"]):Promise<ITrainerInterview>;
}