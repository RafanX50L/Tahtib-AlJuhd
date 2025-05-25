import { IClientService } from "../../services/interface/IClient.service";
import { IClientController } from "../interface/IClient.controller";
import { HttpStatus } from "../../constants/status.constant";
import { HttpResponse } from "../../constants/response-message.constant";
import { Request, Response, NextFunction } from "express";

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
}