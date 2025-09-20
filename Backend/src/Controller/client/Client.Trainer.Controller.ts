import { HttpResponse } from "@/constants/response-message.constant";
import { IClientTrainerController } from "@/core/interface/controllers/client/IClinet.trainer.controller";
import { IClientTrainerService } from "@/core/interface/services/client/IClinet.Trainer.service";
import { AddedRequest } from "@/middleware/verify.token.middleware";
import { NextFunction, Request, Response } from "express";
import { 
  ClientTrainerDTO,
  GetAvailableTrainersRequestDTO,
  GetTrainerByIdRequestDTO,
  BookSlotRequestDTO,
  CancelSessionRequestDTO
} from '@/dtos/reverse-mapping/client/ClientTrainerDTO';
import { ControllerErrorHandler } from '@/utils/controller-error-handler.util';

export class ClientTrainerController implements IClientTrainerController{
    constructor(
        private readonly _clinetTrainerServ: IClientTrainerService,
    ) {}
    placeholder?: never;

    async getAvailableTrainers(req: AddedRequest, res: Response, next: NextFunction):Promise<void> {
        try {
            // Validate and transform request query using DTO
            const validatedQuery: GetAvailableTrainersRequestDTO = ClientTrainerDTO.validateGetAvailableTrainersRequest(req.query);
            
            const userId = req.user?.id;
            const result = await this._clinetTrainerServ.getAvailableTrainers(
                userId,
                validatedQuery.page, 
                validatedQuery.limit, 
                validatedQuery.search, 
                validatedQuery.specialty
            );
            
            ControllerErrorHandler.handleSuccess(res, {
                availableTrainers: result.mappedResult, 
                currentPage: result.currentPage, 
                totalPages: result.totalPages, 
                total: result.total
            }, HttpResponse.DATA_FETCHING_SUCCESSFULL);
        } catch (error) {
            ControllerErrorHandler.handleError(error, res, next);
        }
    }

    async getTrainerById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            // Validate and transform request parameters using DTO
            const validatedParams: GetTrainerByIdRequestDTO = ClientTrainerDTO.validateGetTrainerByIdRequest(req.params);
            
            const trainerData = await this._clinetTrainerServ.getTrainerById(validatedParams.id);
            
            ControllerErrorHandler.handleSuccess(res, { trainerData }, HttpResponse.DATA_FETCHING_SUCCESSFULL);
        } catch (error) {
            ControllerErrorHandler.handleError(error, res, next);
        }
    }

    async getCurrentTrainer(req: AddedRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user?.id;
            const trainerData = await this._clinetTrainerServ.getCurrentTrainer(userId);
            
            ControllerErrorHandler.handleSuccess(res, { trainerData }, HttpResponse.DATA_FETCHING_SUCCESSFULL);
        } catch (error) {
            ControllerErrorHandler.handleError(error, res, next);
        }
    }

    async getCurrentTrainerContract(req: AddedRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user?.id;
            const contractData = await this._clinetTrainerServ.getCurrentTrainerContract(userId);
            
            ControllerErrorHandler.handleSuccess(res, { contractData }, HttpResponse.DATA_FETCHING_SUCCESSFULL);
        } catch (error) {
            ControllerErrorHandler.handleError(error, res, next);
        }
    }

    async bookSlot(req: AddedRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            // Validate and transform request body using DTO
            const validatedBody: BookSlotRequestDTO = ClientTrainerDTO.validateBookSlotRequest(req.body);
            
            const userId = req.user?.id;
            const result = await this._clinetTrainerServ.bookSlot(userId, validatedBody.sessionId);
            
            ControllerErrorHandler.handleSuccess(res, { result }, HttpResponse.DATA_FETCHING_SUCCESSFULL);
        } catch (error) {
            ControllerErrorHandler.handleError(error, res, next);
        }
    }

    async cancelSession(req: AddedRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            // Validate and transform request parameters using DTO
            const validatedParams: CancelSessionRequestDTO = ClientTrainerDTO.validateCancelSessionRequest(req.params);
            
            const userId = req.user?.id;
            const result = await this._clinetTrainerServ.cancelSession(userId, validatedParams.sessionId);
            
            ControllerErrorHandler.handleSuccess(res, { result }, HttpResponse.DATA_FETCHING_SUCCESSFULL);
        } catch (error) {
            ControllerErrorHandler.handleError(error, res, next);
        }
    }
};