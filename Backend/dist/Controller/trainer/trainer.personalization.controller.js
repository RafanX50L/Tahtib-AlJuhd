"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrainerPersonalizationController = void 0;
const response_message_constant_1 = require("../../constants/response-message.constant");
const logger_utils_1 = __importDefault(require("../../utils/logger.utils"));
const TrainerPersonalizationDTO_1 = require("../../dtos/reverse-mapping/trainer/TrainerPersonalizationDTO");
const controller_error_handler_util_1 = require("../../utils/controller-error-handler.util");
class TrainerPersonalizationController {
    _personalizationService;
    constructor(_personalizationService) {
        this._personalizationService = _personalizationService;
    }
    _private;
    async submitApplication(req, res, next) {
        try {
            const userId = req.user.id;
            await this._personalizationService.submitApplication(userId, req);
            controller_error_handler_util_1.ControllerErrorHandler.handleSuccess(res, null, response_message_constant_1.HttpResponse.APPLICATION_SUBMISSION_SUCCESSFULL);
        }
        catch (error) {
            controller_error_handler_util_1.ControllerErrorHandler.handleError(error, res, next);
        }
    }
    async getPendingApplicationDetails(req, res, next) {
        try {
            logger_utils_1.default.info('entered to fetch details');
            const userId = req.user?.id;
            const data = await this._personalizationService.getPendingApplicationDetails(userId);
            controller_error_handler_util_1.ControllerErrorHandler.handleSuccess(res, data, response_message_constant_1.HttpResponse.DATA_FETCHING_SUCCESSFULL);
        }
        catch (error) {
            controller_error_handler_util_1.ControllerErrorHandler.handleError(error, res, next);
        }
    }
    async getProfileData(req, res, next) {
        try {
            const userId = req.user.id;
            const result = await this._personalizationService.getTrainerProfile(userId);
            controller_error_handler_util_1.ControllerErrorHandler.handleSuccess(res, result, response_message_constant_1.HttpResponse.DATA_FETCHING_SUCCESSFULL);
        }
        catch (error) {
            controller_error_handler_util_1.ControllerErrorHandler.handleError(error, res, next);
        }
    }
    async updateProfileData(req, res, next) {
        try {
            // Validate and transform request body using DTO
            const validatedBody = TrainerPersonalizationDTO_1.TrainerPersonalizationDTO.validateUpdateProfileDataRequest(req.body);
            const userId = req.user.id;
            await this._personalizationService.updateProfileData(userId, validatedBody);
            controller_error_handler_util_1.ControllerErrorHandler.handleSuccess(res, null, response_message_constant_1.HttpResponse.PROFILE_DATA_UPDATION_SUCCESSFULL);
        }
        catch (error) {
            controller_error_handler_util_1.ControllerErrorHandler.handleError(error, res, next);
        }
    }
    async getSalary(req, res, next) {
        try {
            const userId = req.user.id;
            const salary = await this._personalizationService.getSalary(userId);
            controller_error_handler_util_1.ControllerErrorHandler.handleSuccess(res, { salary }, response_message_constant_1.HttpResponse.DATA_FETCHING_SUCCESSFULL);
        }
        catch (error) {
            controller_error_handler_util_1.ControllerErrorHandler.handleError(error, res, next);
        }
    }
}
exports.TrainerPersonalizationController = TrainerPersonalizationController;
//# sourceMappingURL=trainer.personalization.controller.js.map