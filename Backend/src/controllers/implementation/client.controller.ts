import { IClientService } from "../../services/interface/IClient.service";
import { IClientController } from "../interface/IClient.controller";
import { HttpStatus } from "../../constants/status.constant";
import { HttpResponse } from "../../constants/response-message.constant";
import { Request, Response, NextFunction } from "express";
import { userData } from "@/middleware/verify.token.middleware";

export class ClientController implements IClientController{
    constructor(private _clientService: IClientService){}

    async generateFitnessPlan(req:Request, res:Response, next:NextFunction):Promise<void>{
        try {
            const userData = req.body;
            await this._clientService.generateFitnessPlan(userData);
            res.status(HttpStatus.CREATED).json({
                message: HttpResponse.GENERATING_FITNESS_PLAN_SUCCESSFULL
            });
        } catch (error) {
            next(error);
        }
    }

    async getBasicFitnessPlan(req: userData, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user?.id as string;
            const basicPlan = await this._clientService.getBasicFitnessPlan(userId);
            res.status(HttpStatus.OK).json(basicPlan);
        } catch (error) {
            next(error);
        }
    }

    async getWorkouts(req: userData, res: Response, next: NextFunction): Promise<void> {
        try {
            const week = req.params.week as string;
            console.log("Week:", week);
            const userId = req.user?.id as string;
            const workouts = await this._clientService.getWorkouts(userId,week);
            res.status(HttpStatus.OK).json(workouts);
        } catch (error) {
            next(error);
        }
    }

    async getWeekCompletionStatus(req: userData, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user?.id as string;
            const weekCompletionStatus = await this._clientService.getWeekCompletionStatus(userId);
            res.status(HttpStatus.OK).json(weekCompletionStatus);
        } catch (error) {
            next(error);
        }
    }
}