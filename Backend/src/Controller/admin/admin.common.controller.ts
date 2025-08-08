import { HttpResponse } from "@/constants/response-message.constant";
import { HttpStatus } from "@/constants/status.constant";
import { IAdminCommonController } from "@/core/interface/controllers/admin/IAdmin.Common.Controller";
import { IAdminCommonService } from "@/core/interface/services/admin/IAdmin.Common.Service";
import { Request, Response, NextFunction } from "express";

export class AdminCommonController implements IAdminCommonController{
    constructor(
        private readonly _adminCommonService: IAdminCommonService,
    ) {}
    placeholder?: never;
    async blockOrUnblock(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            await this._adminCommonService.blockOrUnblock(id);
            res.status(HttpStatus.OK).json({message:HttpResponse.USER_STATUS_UPDATED_SUCCESSFULL});
        } catch (error) {
            next(error);
        }
    }
}