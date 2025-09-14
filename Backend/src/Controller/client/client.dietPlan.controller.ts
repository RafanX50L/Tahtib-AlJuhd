import { HttpResponse } from "@/constants/response-message.constant";
import { IClientDietPlanController } from "@/core/interface/controllers/client/IClient.DietPlan.Controller";
import { IClientDietPlanService } from "@/core/interface/services/client/IClient.DietPlan.Service";
import { AddedRequest } from "@/middleware/verify.token.middleware";
import { NextFunction, Response } from "express";
import { ControllerErrorHandler } from '@/utils/controller-error-handler.util';

export class ClientDietPlanController implements IClientDietPlanController{
    constructor(
        private readonly _dietPlanServices: IClientDietPlanService,
    ) {}
    _placeholder?: never;

    async getDietPlan(req:AddedRequest, res:Response, next:NextFunction){
        try {
            const userId = req.user?.id;
            const data = await this._dietPlanServices.getDietPlan(userId);
            
            ControllerErrorHandler.handleSuccess(res, { data }, HttpResponse.DATA_FETCHING_SUCCESSFULL);
        } catch (error) {
            ControllerErrorHandler.handleError(error, res, next);
        }
    }
}