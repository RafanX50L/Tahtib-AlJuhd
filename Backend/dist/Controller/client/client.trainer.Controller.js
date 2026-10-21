"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientTrainerController = void 0;
const response_message_constant_1 = require("../../constants/response-message.constant");
const ClientTrainerDTO_1 = require("../../dtos/reverse-mapping/client/ClientTrainerDTO");
const controller_error_handler_util_1 = require("../../utils/controller-error-handler.util");
class ClientTrainerController {
    _clinetTrainerServ;
    constructor(_clinetTrainerServ) {
        this._clinetTrainerServ = _clinetTrainerServ;
    }
    placeholder;
    async getAvailableTrainers(req, res, next) {
        try {
            // Validate and transform request query using DTO
            const validatedQuery = ClientTrainerDTO_1.ClientTrainerDTO.validateGetAvailableTrainersRequest(req.query);
            const userId = req.user?.id;
            const result = await this._clinetTrainerServ.getAvailableTrainers(userId, validatedQuery.page, validatedQuery.limit, validatedQuery.search, validatedQuery.specialty);
            controller_error_handler_util_1.ControllerErrorHandler.handleSuccess(res, {
                availableTrainers: result.mappedResult,
                currentPage: result.currentPage,
                totalPages: result.totalPages,
                total: result.total
            }, response_message_constant_1.HttpResponse.DATA_FETCHING_SUCCESSFULL);
        }
        catch (error) {
            controller_error_handler_util_1.ControllerErrorHandler.handleError(error, res, next);
        }
    }
    async getTrainerById(req, res, next) {
        try {
            // Validate and transform request parameters using DTO
            const validatedParams = ClientTrainerDTO_1.ClientTrainerDTO.validateGetTrainerByIdRequest(req.params);
            const trainerData = await this._clinetTrainerServ.getTrainerById(validatedParams.id);
            controller_error_handler_util_1.ControllerErrorHandler.handleSuccess(res, { trainerData }, response_message_constant_1.HttpResponse.DATA_FETCHING_SUCCESSFULL);
        }
        catch (error) {
            controller_error_handler_util_1.ControllerErrorHandler.handleError(error, res, next);
        }
    }
    async getCurrentTrainer(req, res, next) {
        try {
            const userId = req.user?.id;
            const trainerData = await this._clinetTrainerServ.getCurrentTrainer(userId);
            controller_error_handler_util_1.ControllerErrorHandler.handleSuccess(res, { trainerData }, response_message_constant_1.HttpResponse.DATA_FETCHING_SUCCESSFULL);
        }
        catch (error) {
            controller_error_handler_util_1.ControllerErrorHandler.handleError(error, res, next);
        }
    }
    async getCurrentTrainerContract(req, res, next) {
        try {
            const userId = req.user?.id;
            const contractData = await this._clinetTrainerServ.getCurrentTrainerContract(userId);
            controller_error_handler_util_1.ControllerErrorHandler.handleSuccess(res, { contractData }, response_message_constant_1.HttpResponse.DATA_FETCHING_SUCCESSFULL);
        }
        catch (error) {
            controller_error_handler_util_1.ControllerErrorHandler.handleError(error, res, next);
        }
    }
    async bookSlot(req, res, next) {
        try {
            // Validate and transform request body using DTO
            const validatedBody = ClientTrainerDTO_1.ClientTrainerDTO.validateBookSlotRequest(req.body);
            const userId = req.user?.id;
            const result = await this._clinetTrainerServ.bookSlot(userId, validatedBody.sessionId);
            controller_error_handler_util_1.ControllerErrorHandler.handleSuccess(res, { result }, response_message_constant_1.HttpResponse.DATA_FETCHING_SUCCESSFULL);
        }
        catch (error) {
            controller_error_handler_util_1.ControllerErrorHandler.handleError(error, res, next);
        }
    }
    async cancelSession(req, res, next) {
        try {
            // Validate and transform request parameters using DTO
            const validatedParams = ClientTrainerDTO_1.ClientTrainerDTO.validateCancelSessionRequest(req.params);
            const userId = req.user?.id;
            const result = await this._clinetTrainerServ.cancelSession(userId, validatedParams.sessionId);
            controller_error_handler_util_1.ControllerErrorHandler.handleSuccess(res, { result }, response_message_constant_1.HttpResponse.DATA_FETCHING_SUCCESSFULL);
        }
        catch (error) {
            controller_error_handler_util_1.ControllerErrorHandler.handleError(error, res, next);
        }
    }
}
exports.ClientTrainerController = ClientTrainerController;
;
//# sourceMappingURL=Client.Trainer.Controller.js.map