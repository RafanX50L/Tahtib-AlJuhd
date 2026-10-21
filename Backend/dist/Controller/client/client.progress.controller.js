"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientProgressController = void 0;
const response_message_constant_1 = require("../../constants/response-message.constant");
const status_constant_1 = require("../../constants/status.constant");
const ClientProgressDTO_1 = require("../../dtos/reverse-mapping/client/ClientProgressDTO");
const controller_error_handler_util_1 = require("../../utils/controller-error-handler.util");
class ClientProgressController {
    _progressService;
    constructor(_progressService) {
        this._progressService = _progressService;
    }
    async addEntry(req, res, next) {
        try {
            const userId = req.user.id;
            // Validate and transform request body using DTO
            const validatedBody = ClientProgressDTO_1.ClientProgressDTO.validateAddEntryRequest(req.body);
            await this._progressService.addEntry(userId, new Date(validatedBody.date), validatedBody.weight, validatedBody.height);
            controller_error_handler_util_1.ControllerErrorHandler.handleSuccess(res, null, response_message_constant_1.HttpResponse.DATA_CREATION_SUCCESSFULL, status_constant_1.HttpStatus.CREATED);
        }
        catch (error) {
            controller_error_handler_util_1.ControllerErrorHandler.handleError(error, res, next);
        }
    }
    async getCurrentStatus(req, res, next) {
        try {
            const userId = req.user.id;
            const current = await this._progressService.getCurrentStatus(userId);
            controller_error_handler_util_1.ControllerErrorHandler.handleSuccess(res, { current }, response_message_constant_1.HttpResponse.DATA_FETCHING_SUCCESSFULL);
        }
        catch (error) {
            controller_error_handler_util_1.ControllerErrorHandler.handleError(error, res, next);
        }
    }
    async getGraphData(req, res, next) {
        try {
            const userId = req.user.id;
            // Validate and transform request query using DTO
            const validatedQuery = ClientProgressDTO_1.ClientProgressDTO.validateGetGraphDataRequest(req.query);
            const points = await this._progressService.getGraphData(userId, new Date(validatedQuery.start), new Date(validatedQuery.end));
            controller_error_handler_util_1.ControllerErrorHandler.handleSuccess(res, { points }, response_message_constant_1.HttpResponse.DATA_FETCHING_SUCCESSFULL);
        }
        catch (error) {
            controller_error_handler_util_1.ControllerErrorHandler.handleError(error, res, next);
        }
    }
    async previewEntry(req, res, next) {
        try {
            // Validate and transform request body using DTO
            const validatedBody = ClientProgressDTO_1.ClientProgressDTO.validatePreviewEntryRequest(req.body);
            const preview = await this._progressService.previewEntry(new Date(validatedBody.date), validatedBody.weight, validatedBody.height);
            controller_error_handler_util_1.ControllerErrorHandler.handleSuccess(res, {
                preview,
                warning: 'Preview only. This will not be stored in the database.'
            }, response_message_constant_1.HttpResponse.DATA_FETCHING_SUCCESSFULL);
        }
        catch (error) {
            controller_error_handler_util_1.ControllerErrorHandler.handleError(error, res, next);
        }
    }
}
exports.ClientProgressController = ClientProgressController;
//# sourceMappingURL=client.progress.controller.js.map