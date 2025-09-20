import { HttpResponse } from "@/constants/response-message.constant";
import { IAdminTrainerController } from "@/core/interface/controllers/admin/IAdmin.Trainer.Controller";
import { IAdminTrainerSerice } from "@/core/interface/services/admin/IAdmin.Trainer.Service";
import { AddedRequest } from "@/middleware/verify.token.middleware";
import { Request, Response, NextFunction } from "express";
import { 
  AdminTrainerDTO, 
  GetTrainersRequestDTO,
  ScheduleInterviewRequestDTO,
  SubmitInterviewFeedbackRequestDTO,
  ApproveTrainerRequestDTO,
  RejectTrainerRequestDTO
} from "@/dtos/reverse-mapping/admin/TrainerDTO";
import { ControllerErrorHandler } from "@/utils/controller-error-handler.util";

export class AdminTrainerController implements IAdminTrainerController {
    constructor(
        private readonly _adminTrainerService: IAdminTrainerSerice
    ){}
    async getApprovedTrainers(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            // Validate and transform request parameters using DTO
            const validatedParams: GetTrainersRequestDTO = AdminTrainerDTO.validateGetTrainersRequest(req.query);
            
            // Call service with validated parameters - service already returns DTOs
            const data = await this._adminTrainerService.getApprovedTrainers(
                validatedParams.page || 1,
                validatedParams.limit || 10,
                validatedParams.search || ""
            );

            ControllerErrorHandler.handleSuccess(res, data, HttpResponse.DATA_FETCHING_SUCCESSFULL);
        } catch (error) {
            ControllerErrorHandler.handleError(error, res, next);
        }
    }

    async getPendingTrainers(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            // Validate and transform request parameters using DTO
            const validatedParams: GetTrainersRequestDTO = AdminTrainerDTO.validateGetTrainersRequest(req.query);
            
            // Call service with validated parameters - service already returns DTOs
            const data = await this._adminTrainerService.getPendingTrainers(
                validatedParams.page || 1,
                validatedParams.limit || 10,
                validatedParams.search || ""
            );

            ControllerErrorHandler.handleSuccess(res, data, HttpResponse.DATA_FETCHING_SUCCESSFULL);
        } catch (error) {
            ControllerErrorHandler.handleError(error, res, next);
        }
    }

    async scheduleInterview(req:AddedRequest, res:Response, next:NextFunction):Promise<void>{
        try {
            const adminId = req.user.id;
            
            // Validate and transform request parameters using DTO
            const validatedParams: ScheduleInterviewRequestDTO = AdminTrainerDTO.validateScheduleInterviewRequest(req.params);
            
            // Call service with validated parameters - service already returns DTOs
            const result = await this._adminTrainerService.scheduleInterview(
                validatedParams.trainerId,
                adminId,
                new Date(validatedParams.date),
                validatedParams.time
            );

            ControllerErrorHandler.handleSuccess(res, result, "Interview scheduled successfully");
        } catch (error) {
            ControllerErrorHandler.handleError(error, res, next);
        }
    }
    async submitInterviewFeedback(req:AddedRequest, res:Response, next:NextFunction):Promise<void>{
        try {
            const adminId = req.user.id;
            
            // Validate and transform request body using DTO
            const validatedBody: SubmitInterviewFeedbackRequestDTO = AdminTrainerDTO.validateSubmitInterviewFeedbackRequest(req.body);
            
            // Call service with validated parameters - service already returns DTOs
            await this._adminTrainerService.submitInterviewFeedback(
                validatedBody.id,
                adminId,
                validatedBody.feedback
            );

            ControllerErrorHandler.handleSuccess(res, null, HttpResponse.INTERVIEW_FEEDBACK_UPDATED_SUCCESSFULL);
        } catch (error) {
            ControllerErrorHandler.handleError(error, res, next);
        }
    }

    async approveTrainer(req:Request, res:Response, next:NextFunction):Promise<void>{
        try {
            // Validate and transform request body using DTO
            const validatedBody: ApproveTrainerRequestDTO = AdminTrainerDTO.validateApproveTrainerRequest(req.body);
            
            // Call service with validated parameters - service already returns DTOs
            await this._adminTrainerService.approveTrainer(validatedBody.id, validatedBody.salary);

            ControllerErrorHandler.handleSuccess(res, null, HttpResponse.TRAINER_APPROVAL_SUCCESSFULL);
        } catch (error) {
            ControllerErrorHandler.handleError(error, res, next);
        }
    }

    async rejectTrainer(req:Request, res:Response, next:NextFunction):Promise<void>{
        try {
            // Validate and transform request body using DTO
            const validatedBody: RejectTrainerRequestDTO = AdminTrainerDTO.validateRejectTrainerRequest(req.body);
            
            // Call service with validated parameters - service already returns DTOs
            await this._adminTrainerService.rejectTrainer(validatedBody.id);

            ControllerErrorHandler.handleSuccess(res, null, HttpResponse.TRAINER_REJECTED_SUCCESSFULL);
        } catch (error) {
            ControllerErrorHandler.handleError(error, res, next);
        }
    }
}