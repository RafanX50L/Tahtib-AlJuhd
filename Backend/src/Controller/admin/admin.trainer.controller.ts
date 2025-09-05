import { HttpResponse } from "@/constants/response-message.constant";
import { HttpStatus } from "@/constants/status.constant";
import { IAdminTrainerController } from "@/core/interface/controllers/admin/IAdmin.Trainer.Controller";
import { IAdminTrainerSerice } from "@/core/interface/services/admin/IAdmin.Trainer.Service";
import { AddedRequest } from "@/middleware/verify.token.middleware";
import { Request, Response, NextFunction } from "express";

export class AdminTrainerController implements IAdminTrainerController {
    constructor(
        private readonly _adminTrainerService: IAdminTrainerSerice
    ){}
    async getApprovedTrainers(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = (req.query.search as string) || "";

    const data = await this._adminTrainerService.getApprovedTrainers(page, limit, search);

    res.status(HttpStatus.OK).json({
      message: HttpResponse.DATA_FETCHING_SUCCESSFULL,
      data,
    });
  } catch (error) {
    next(error);
  }
    }

    async getPendingTrainers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const search = (req.query.search as string) || "";

        const data = await this._adminTrainerService.getPendingTrainers(page, limit, search);

        res.status(HttpStatus.OK).json({
        message: HttpResponse.DATA_FETCHING_SUCCESSFULL,
        data,
        });
    } catch (error) {
        next(error);
    }
    }

    async scheduleInterview(req:AddedRequest, res:Response, next:NextFunction):Promise<void>{
        try {
            const adminId = req.user.id;
            const {trainerId,date,time} = req.params;
            const result = await this._adminTrainerService.scheduleInterview(trainerId,adminId,new Date(date),time);
            res.status(HttpStatus.OK).json(result);
        } catch (error) {
            next(error);
        }
    }
    async submitInterviewFeedback(req:AddedRequest, res:Response, next:NextFunction):Promise<void>{
        try {
            const trainerId = req.body.id;
            const adminId = req.user.id;
            const { feedback } = req.body;
            await this._adminTrainerService.submitInterviewFeedback(trainerId,adminId,feedback);
            res.status(HttpStatus.OK).json({message:HttpResponse.INTERVIEW_FEEDBACK_UPDATED_SUCCESSFULL});
        } catch (error) {
            next(error);
        }
    }
    async approveTrainer(req:Request, res:Response, next:NextFunction):Promise<void>{
        try {
        const trainerId = req.body.id;
        const salary = req.body.salary;
        await this._adminTrainerService.approveTrainer(trainerId,salary);
        res.status(HttpStatus.OK).json({message:HttpResponse.TRAINER_APPROVAL_SUCCESSFULL});
        } catch (error) {
        next(error);
        }
    }
    async rejectTrainer(req:Request, res:Response, next:NextFunction):Promise<void>{
        try {
        const trainerId = req.body.id;
        await this._adminTrainerService.rejectTrainer(trainerId);
        res.status(HttpStatus.OK).json({message:HttpResponse.TRAINER_REJECTED_SUCCESSFULL});
        } catch (error) {
        next(error);
        }
    }
}