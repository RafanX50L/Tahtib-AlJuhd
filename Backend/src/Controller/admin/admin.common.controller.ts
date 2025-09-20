import { HttpResponse } from "@/constants/response-message.constant";
import { IAdminCommonController } from "@/core/interface/controllers/admin/IAdmin.Common.Controller";
import { IAdminCommonService } from "@/core/interface/services/admin/IAdmin.Common.Service";
import { Request, Response, NextFunction } from "express";
import { 
  AdminCommonDTO,
  BlockOrUnblockRequestDTO
} from "@/dtos/reverse-mapping/admin/CommonDTO";
import { ControllerErrorHandler } from "@/utils/controller-error-handler.util";

export class AdminCommonController implements IAdminCommonController{
    constructor(
        private readonly _adminCommonService: IAdminCommonService,
    ) {}
    placeholder?: never;
    async blockOrUnblock(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            // Validate and transform request parameters using DTO
            const validatedParams: BlockOrUnblockRequestDTO = AdminCommonDTO.validateBlockOrUnblockRequest(req.params);
            
            // Call service with validated parameters - service already returns DTOs
            await this._adminCommonService.blockOrUnblock(validatedParams.id);

            ControllerErrorHandler.handleSuccess(res, null, HttpResponse.USER_STATUS_UPDATED_SUCCESSFULL);
        } catch (error) {
            ControllerErrorHandler.handleError(error, res, next);
        }
    }
}