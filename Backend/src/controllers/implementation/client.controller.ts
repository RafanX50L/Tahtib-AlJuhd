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

    updateDayCompletionStatus = async (req: userData, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.user?.id as string;
            const { week, day, workout } = req.body;
            console.log("body",req.body);
            console.log("User ID:", userId, "Week:", week, "Day:", day, "Workout:", workout);
            if (!week || !day || !workout) {
                res.status(HttpStatus.BAD_REQUEST).json({
                    message: HttpResponse.INVALID_REQUEST_DATA
                });
                return;
            }

            const workoutReport = await this._clientService.updateDayCompletionStatus(userId, week, day, workout);
            res.status(HttpStatus.OK).json(workoutReport);
        } catch (error) {
            next(error);
        }
    };
    getWorkoutReport = async (req: userData, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.user?.id as string;
            const { week, day } = req.query;
            console.log("Week:", week, "Day:", day);
            if (!week || !day) {
                res.status(HttpStatus.BAD_REQUEST).json({
                    message: HttpResponse.INVALID_REQUEST_DATA
                });
                return;
            }

            const workoutReport = await this._clientService.getWorkoutReport(
                userId,
                week as string,
                day as string
            );
            res.status(HttpStatus.OK).json(workoutReport);
        } catch (error) {
            next(error);
        }
    };
}