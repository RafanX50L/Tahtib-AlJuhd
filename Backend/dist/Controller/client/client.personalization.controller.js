"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientPersonalizationController = void 0;
const response_message_constant_1 = require("../../constants/response-message.constant");
const status_constant_1 = require("../../constants/status.constant");
const ClientPersonalizationDTO_1 = require("../../dtos/reverse-mapping/client/ClientPersonalizationDTO");
const controller_error_handler_util_1 = require("../../utils/controller-error-handler.util");
class ClientPersonalizationController {
    _personalizationServices;
    constructor(_personalizationServices) {
        this._personalizationServices = _personalizationServices;
    }
    async generatePersonalization(req, res, next) {
        try {
            // Validate and transform request body using DTO
            const validatedBody = ClientPersonalizationDTO_1.ClientPersonalizationDTO.validateGeneratePersonalizationRequest(req.body);
            const userId = req.user?.id;
            await this._personalizationServices.generatePersonalization(userId, validatedBody);
            controller_error_handler_util_1.ControllerErrorHandler.handleSuccess(res, null, response_message_constant_1.HttpResponse.GENERATING_FITNESS_PLAN_SUCCESSFULL, status_constant_1.HttpStatus.CREATED);
        }
        catch (error) {
            controller_error_handler_util_1.ControllerErrorHandler.handleError(error, res, next);
        }
    }
    async getWorkoutDetails(req, res, next) {
        try {
            const userId = req.user?.id;
            const workoutDetails = await this._personalizationServices.getWorkoutDetails(userId);
            controller_error_handler_util_1.ControllerErrorHandler.handleSuccess(res, { workoutDetails }, response_message_constant_1.HttpResponse.DATA_FETCHING_SUCCESSFULL);
        }
        catch (error) {
            controller_error_handler_util_1.ControllerErrorHandler.handleError(error, res, next);
        }
    }
    async getProfileData(req, res, next) {
        try {
            const userId = req.user?.id;
            const profileData = await this._personalizationServices.getProfileData(userId);
            controller_error_handler_util_1.ControllerErrorHandler.handleSuccess(res, { data: profileData }, response_message_constant_1.HttpResponse.DATA_FETCHING_SUCCESSFULL);
        }
        catch (error) {
            controller_error_handler_util_1.ControllerErrorHandler.handleError(error, res, next);
        }
    }
    async updateClientProfile(req, res, next) {
        try {
            // Validate and transform request body using DTO
            const validatedBody = ClientPersonalizationDTO_1.ClientPersonalizationDTO.validateUpdateClientProfileRequest(req.body);
            const userId = req.user.id;
            await this._personalizationServices.updateClientProfile(userId, validatedBody);
            controller_error_handler_util_1.ControllerErrorHandler.handleSuccess(res, null, response_message_constant_1.HttpResponse.PROFILE_DATA_UPDATION_SUCCESSFULL);
        }
        catch (error) {
            controller_error_handler_util_1.ControllerErrorHandler.handleError(error, res, next);
        }
    }
}
exports.ClientPersonalizationController = ClientPersonalizationController;
//# sourceMappingURL=client.personalization.controller.js.map