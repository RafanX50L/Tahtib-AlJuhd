import { Request, Response, NextFunction } from "express";
import { userData } from "@/middleware/verify.token.middleware";

export interface IAdminController {
    getAllClients(req: userData, res: Response, next: NextFunction): Promise<void>;
    blockOrUnblock(req:Request,res:Response,next:NextFunction):Promise<void>;
    updateClientStatus(req: Request, res: Response, next: NextFunction): Promise<void>;
    getAllTrainers(req: Request, res: Response, next: NextFunction): Promise<void>;
    updateTrainerStatus(req: Request, res: Response, next: NextFunction): Promise<void>;
    getPendingTrainers(req:Request, res:Response, next:NextFunction):Promise<void>;
    getApprovedTrainers(req:Request, res:Response, next:NextFunction):Promise<void>;
    scheduleInterview(req:userData, res:Response, next:NextFunction):Promise<void>;
    submitInterviewFeedback(req:userData, res:Response, next:NextFunction):Promise<void>;
    approveTrainer(req:Request, res:Response, next:NextFunction):Promise<void>;
    rejectTrainer(req:Request, res:Response, next:NextFunction):Promise<void>;
}