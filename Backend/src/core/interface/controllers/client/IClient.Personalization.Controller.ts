import { AddedRequest } from "@/middleware/verify.token.middleware";
import { Response,NextFunction } from "express";

export interface IClientPersonalizationController {
    generatePersonalization(req:AddedRequest,res:Response,next:NextFunction):Promise<void>;
    getProfileData(req:AddedRequest,res:Response,next:NextFunction):Promise<void>;
    updateClientProfile(req:AddedRequest, res:Response, next:NextFunction):Promise<void>;
}