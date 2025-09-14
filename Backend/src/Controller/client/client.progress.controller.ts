import { HttpResponse } from '@/constants/response-message.constant';
import { HttpStatus } from '@/constants/status.constant';
import { IClientProgressController } from '@/core/interface/controllers/client/IClient.Progress.Controller';
import { IClientProgressService } from '@/core/interface/services/client/IClient.Progress.Service';
import { AddedRequest } from '@/middleware/verify.token.middleware';
import { NextFunction, Request, Response } from 'express';
import { 
  ClientProgressDTO,
  AddEntryRequestDTO,
  GetGraphDataRequestDTO,
  PreviewEntryRequestDTO
} from '@/dtos/reverse-mapping/client/ClientProgressDTO';
import { ControllerErrorHandler } from '@/utils/controller-error-handler.util';

export class ClientProgressController implements IClientProgressController {
  constructor(private readonly _progressService: IClientProgressService) {}

  async addEntry(req: AddedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user.id;
      
      // Validate and transform request body using DTO
      const validatedBody: AddEntryRequestDTO = ClientProgressDTO.validateAddEntryRequest(req.body);
      
      await this._progressService.addEntry(userId, new Date(validatedBody.date), validatedBody.weight, validatedBody.height);
      
      ControllerErrorHandler.handleSuccess(res, null, HttpResponse.DATA_CREATION_SUCCESSFULL, HttpStatus.CREATED);
    } catch (error) {
      ControllerErrorHandler.handleError(error, res, next);
    }
  }

  async getCurrentStatus(req: AddedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user.id;
      const current = await this._progressService.getCurrentStatus(userId);
      
      ControllerErrorHandler.handleSuccess(res, { current }, HttpResponse.DATA_FETCHING_SUCCESSFULL);
    } catch (error) {
      ControllerErrorHandler.handleError(error, res, next);
    }
  }

  async getGraphData(req: AddedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user.id;
      
      // Validate and transform request query using DTO
      const validatedQuery: GetGraphDataRequestDTO = ClientProgressDTO.validateGetGraphDataRequest(req.query);
      
      const points = await this._progressService.getGraphData(userId, new Date(validatedQuery.start), new Date(validatedQuery.end));
      
      ControllerErrorHandler.handleSuccess(res, { points }, HttpResponse.DATA_FETCHING_SUCCESSFULL);
    } catch (error) {
      ControllerErrorHandler.handleError(error, res, next);
    }
  }

  async previewEntry(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Validate and transform request body using DTO
      const validatedBody: PreviewEntryRequestDTO = ClientProgressDTO.validatePreviewEntryRequest(req.body);
      
      const preview = await this._progressService.previewEntry(new Date(validatedBody.date), validatedBody.weight, validatedBody.height);
      
      ControllerErrorHandler.handleSuccess(res, { 
        preview, 
        warning: 'Preview only. This will not be stored in the database.' 
      }, HttpResponse.DATA_FETCHING_SUCCESSFULL);
    } catch (error) {
      ControllerErrorHandler.handleError(error, res, next);
    }
  }
}


