import { HttpResponse } from "@/constants/response-message.constant";
import { IAdminClientController } from "@/core/interface/controllers/admin/IAdmin.Clinet.Controller";
import { IAdminClientService } from "@/core/interface/services/admin/IAdmin.Clinet.Service";
import { Request, Response, NextFunction } from "express";
import { GetAllClientsRequestDTO } from "@/dtos/reverse-mapping/admin/ClientDTO";
import { ValidationUtil, ValidationError } from "@/utils/validation.util";
import { ControllerErrorHandler } from "@/utils/controller-error-handler.util";

export class AdminClientController implements IAdminClientController{
    constructor(
        private readonly _adminClientService: IAdminClientService
    ) {}
    placeholder?: never;

    /**
     * Get all clients with pagination, filtering, and search
     * Validates input parameters and maps response using DTOs
     */
    async getAllClient(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            // Validate and transform request parameters using DTO
            const validatedParams: GetAllClientsRequestDTO = this.validateGetAllClientsRequest(req.query);
            
            // Call service with validated parameters - service already returns DTOs
            const data = await this._adminClientService.getAllClients(
                validatedParams.planStatus || '',
                validatedParams.search || '',
                validatedParams.page || 1,
                validatedParams.limit || 10
            );

            ControllerErrorHandler.handleSuccess(res, data, HttpResponse.DATA_FETCHING_SUCCESSFULL);
        } catch (error) {
            ControllerErrorHandler.handleError(error, res, next);
        }
    }

    /**
     * Validates and transforms request query parameters
     * Implements reverse mapping from request to validated DTO
     */
    private validateGetAllClientsRequest(query: Record<string, unknown>): GetAllClientsRequestDTO {
        try {
            // Validate pagination parameters
            const { page, limit } = ValidationUtil.validatePagination(query);
            
            // Validate plan status filter
            const planStatus = ValidationUtil.validateEnum(
                query.planStatus,
                'planStatus',
                ['Active', 'Inactive', 'all'] as const
            );

            // Validate and sanitize search term
            const search = ValidationUtil.validateString(query.search, 'search', 100);

            return {
                page,
                limit,
                planStatus,
                search
            };
        } catch (error) {
            // Re-throw validation errors with additional context
            if (error instanceof ValidationError) {
                throw error;
            }
            throw new ValidationError([{
                field: 'request',
                message: 'Invalid request parameters',
                value: query
            }]);
        }
    }
}