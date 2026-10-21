"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminClientController = void 0;
const response_message_constant_1 = require("../../constants/response-message.constant");
const validation_util_1 = require("../../utils/validation.util");
const controller_error_handler_util_1 = require("../../utils/controller-error-handler.util");
class AdminClientController {
    _adminClientService;
    constructor(_adminClientService) {
        this._adminClientService = _adminClientService;
    }
    placeholder;
    /**
     * Get all clients with pagination, filtering, and search
     * Validates input parameters and maps response using DTOs
     */
    async getAllClient(req, res, next) {
        try {
            // Validate and transform request parameters using DTO
            const validatedParams = this.validateGetAllClientsRequest(req.query);
            // Call service with validated parameters - service already returns DTOs
            const data = await this._adminClientService.getAllClients(validatedParams.planStatus || '', validatedParams.search || '', validatedParams.page || 1, validatedParams.limit || 10);
            controller_error_handler_util_1.ControllerErrorHandler.handleSuccess(res, data, response_message_constant_1.HttpResponse.DATA_FETCHING_SUCCESSFULL);
        }
        catch (error) {
            controller_error_handler_util_1.ControllerErrorHandler.handleError(error, res, next);
        }
    }
    /**
     * Validates and transforms request query parameters
     * Implements reverse mapping from request to validated DTO
     */
    validateGetAllClientsRequest(query) {
        try {
            // Validate pagination parameters
            const { page, limit } = validation_util_1.ValidationUtil.validatePagination(query);
            // Validate plan status filter
            const planStatus = validation_util_1.ValidationUtil.validateEnum(query.planStatus, 'planStatus', ['Active', 'Inactive', 'all']);
            // Validate and sanitize search term
            const search = validation_util_1.ValidationUtil.validateString(query.search, 'search', 100);
            return {
                page,
                limit,
                planStatus,
                search
            };
        }
        catch (error) {
            // Re-throw validation errors with additional context
            if (error instanceof validation_util_1.ValidationError) {
                throw error;
            }
            throw new validation_util_1.ValidationError([{
                    field: 'request',
                    message: 'Invalid request parameters',
                    value: query
                }]);
        }
    }
}
exports.AdminClientController = AdminClientController;
//# sourceMappingURL=admin.client.controller.js.map