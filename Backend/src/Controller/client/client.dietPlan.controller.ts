import { HttpResponse } from "@/constants/response-message.constant";
import { HttpStatus } from "@/constants/status.constant";
import { IClientDietPlanController } from "@/core/interface/controllers/client/IClient.DietPlan.Controller";
import { IClientDietPlanService } from "@/core/interface/services/client/IClient.DietPlan.Service";
import { AddedRequest } from "@/middleware/verify.token.middleware";
import { NextFunction, Response } from "express";

export class ClientDietPlanController implements IClientDietPlanController{
    constructor(
        private readonly _dietPlanServices: IClientDietPlanService,
    ) {}
    _placeholder?: never;

    async getDietPlan(req:AddedRequest, res:Response, next:NextFunction){
        try {
            const userId = req.user?.id;
            const data = await this._dietPlanServices.getDietPlan(userId);
            res.status(HttpStatus.OK).json({message:HttpResponse.DATA_FETCHING_SUCCESSFULL,data:data});
        } catch (error) {
            next(error);
        }
    }
}