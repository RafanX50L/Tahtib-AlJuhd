import { HttpResponse } from "@/constants/response-message.constant";
import { HttpStatus } from "@/constants/status.constant";
import { IClientTrainerController } from "@/core/interface/controllers/client/IClinet.trainer.controller";
import { IClientTrainerService } from "@/core/interface/services/client/IClinet.Trainer.service";
import { AddedRequest } from "@/middleware/verify.token.middleware";
import { NextFunction, Request, Response } from "express";

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

    async getTrainerById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const trainerId = req.params.id;
            const trainerData = await this._clinetTrainerServ.getTrainerById(trainerId);
            res.status(HttpStatus.OK).json({message:HttpResponse.DATA_FETCHING_SUCCESSFULL, trainerData});
        } catch (error) {
            next(error);
        }
    }

    async getCurrentTrainer(req: AddedRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user?.id;
            const trainerData = await this._clinetTrainerServ.getCurrentTrainer(userId);
            res.status(HttpStatus.OK).json({message:HttpResponse.DATA_FETCHING_SUCCESSFULL, trainerData});
        } catch (error) {
            next(error);
        }
    }

    async getCurrentTrainerContract(req: AddedRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user?.id;
            const contractData = await this._clinetTrainerServ.getCurrentTrainerContract(userId);
            res.status(HttpStatus.OK).json({message:HttpResponse.DATA_FETCHING_SUCCESSFULL, contractData});
        } catch (error) {
            next(error);
        }
    }

    async bookSlot(req: AddedRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user?.id;
            const { sessionId } = req.body;
            const result = await this._clinetTrainerServ.bookSlot(userId, sessionId);
            res.status(HttpStatus.OK).json({message:HttpResponse.DATA_FETCHING_SUCCESSFULL, result});
        } catch (error) {
            next(error);
        }
    }

    async cancelSession(req: AddedRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user?.id;
            const { sessionId } = req.params;
            const result = await this._clinetTrainerServ.cancelSession(userId, sessionId);
            res.status(HttpStatus.OK).json({message:HttpResponse.DATA_FETCHING_SUCCESSFULL, result});
        } catch (error) {
            next(error);
        }
    }
};