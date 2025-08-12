import { HttpResponse } from "@/constants/response-message.constant";
import { HttpStatus } from "@/constants/status.constant";
import { IClientTrainerController } from "@/core/interface/controllers/client/IClinet.trainer.controller";
import { IClientTrainerService } from "@/core/interface/services/client/IClinet.Trainer.service";
import { AddedRequest } from "@/middleware/verify.token.middleware";
import { NextFunction, Response } from "express";

export class ClientTrainerController implements IClientTrainerController{
    constructor(
        private readonly _clinetTrainerServ: IClientTrainerService,
    ) {}
    placeholder?: never;

    async getAvailableTrainers(req: AddedRequest, res: Response, next: NextFunction):Promise<void> {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const search = (req.query.search as string) || "";
            const specialty = (req.query.specialty as string) || "";
            const userId = req.user?.id;
            const result = await this._clinetTrainerServ.getAvailableTrainers(userId,page, limit, search, specialty);
            res.status(HttpStatus.OK).json({message:HttpResponse.DATA_FETCHING_SUCCESSFULL,availableTrainers:result.mappedResult, currentPage: result.currentPage, totalPages: result.totalPages, total: result.total});
        } catch (error) {
            next(error);
        }
    }
};