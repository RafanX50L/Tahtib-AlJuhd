import { HttpResponse } from "@/constants/response-message.constant";
import { HttpStatus } from "@/constants/status.constant";
import { IAdminClientController } from "@/core/interface/controllers/admin/IAdmin.Clinet.Controller";
import { IAdminClientService } from "@/core/interface/services/admin/IAdmin.Clinet.Service";
import { Request, Response, NextFunction } from "express";

export class AdminClientController implements IAdminClientController{
    constructor(
        private readonly _adminClientService: IAdminClientService
    ) {}
    placeholder?: never;
    async getAllClient(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { page, limit, planStatus, search } = req.query;
            const data = await this._adminClientService.getAllClients(planStatus.toString(), search.toString(), Number(page), Number(limit));
            res.status(HttpStatus.OK).json({message:HttpResponse.DATA_FETCHING_SUCCESSFULL,data:data});
        } catch (error) {
            next(error);
        }
    }
}