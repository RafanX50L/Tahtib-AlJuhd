"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminTrainerController = void 0;
const response_message_constant_1 = require("../../constants/response-message.constant");
const TrainerDTO_1 = require("../../dtos/reverse-mapping/admin/TrainerDTO");
const controller_error_handler_util_1 = require("../../utils/controller-error-handler.util");
class AdminTrainerController {
    _adminTrainerService;
    constructor(_adminTrainerService) {
        this._adminTrainerService = _adminTrainerService;
    }
    async getApprovedTrainers(req, res, next) {
        try {
            // Validate and transform request parameters using DTO
            const validatedParams = TrainerDTO_1.AdminTrainerDTO.validateGetTrainersRequest(req.query);
            // Call service with validated parameters - service already returns DTOs
            const data = await this._adminTrainerService.getApprovedTrainers(validatedParams.page || 1, validatedParams.limit || 10, validatedParams.search || "");
            controller_error_handler_util_1.ControllerErrorHandler.handleSuccess(res, data, response_message_constant_1.HttpResponse.DATA_FETCHING_SUCCESSFULL);
        }
        catch (error) {
            controller_error_handler_util_1.ControllerErrorHandler.handleError(error, res, next);
        }
    }
    async getPendingTrainers(req, res, next) {
        try {
            // Validate and transform request parameters using DTO
            const validatedParams = TrainerDTO_1.AdminTrainerDTO.validateGetTrainersRequest(req.query);
            // Call service with validated parameters - service already returns DTOs
            const data = await this._adminTrainerService.getPendingTrainers(validatedParams.page || 1, validatedParams.limit || 10, validatedParams.search || "");
            controller_error_handler_util_1.ControllerErrorHandler.handleSuccess(res, data, response_message_constant_1.HttpResponse.DATA_FETCHING_SUCCESSFULL);
        }
        catch (error) {
            controller_error_handler_util_1.ControllerErrorHandler.handleError(error, res, next);
        }
    }
    async scheduleInterview(req, res, next) {
        try {
            const adminId = req.user.id;
            // Validate and transform request parameters using DTO
            const validatedParams = TrainerDTO_1.AdminTrainerDTO.validateScheduleInterviewRequest(req.params);
            // Call service with validated parameters - service already returns DTOs
            const result = await this._adminTrainerService.scheduleInterview(validatedParams.trainerId, adminId, new Date(validatedParams.date), validatedParams.time);
            controller_error_handler_util_1.ControllerErrorHandler.handleSuccess(res, result, "Interview scheduled successfully");
        }
        catch (error) {
            controller_error_handler_util_1.ControllerErrorHandler.handleError(error, res, next);
        }
    }
    async submitInterviewFeedback(req, res, next) {
        try {
            const adminId = req.user.id;
            // Validate and transform request body using DTO
            const validatedBody = TrainerDTO_1.AdminTrainerDTO.validateSubmitInterviewFeedbackRequest(req.body);
            // Call service with validated parameters - service already returns DTOs
            await this._adminTrainerService.submitInterviewFeedback(validatedBody.id, adminId, validatedBody.feedback);
            controller_error_handler_util_1.ControllerErrorHandler.handleSuccess(res, null, response_message_constant_1.HttpResponse.INTERVIEW_FEEDBACK_UPDATED_SUCCESSFULL);
        }
        catch (error) {
            controller_error_handler_util_1.ControllerErrorHandler.handleError(error, res, next);
        }
    }
    async approveTrainer(req, res, next) {
        try {
            // Validate and transform request body using DTO
            const validatedBody = TrainerDTO_1.AdminTrainerDTO.validateApproveTrainerRequest(req.body);
            // Call service with validated parameters - service already returns DTOs
            await this._adminTrainerService.approveTrainer(validatedBody.id, validatedBody.salary);
            controller_error_handler_util_1.ControllerErrorHandler.handleSuccess(res, null, response_message_constant_1.HttpResponse.TRAINER_APPROVAL_SUCCESSFULL);
        }
        catch (error) {
            controller_error_handler_util_1.ControllerErrorHandler.handleError(error, res, next);
        }
    }
    async rejectTrainer(req, res, next) {
        try {
            // Validate and transform request body using DTO
            const validatedBody = TrainerDTO_1.AdminTrainerDTO.validateRejectTrainerRequest(req.body);
            // Call service with validated parameters - service already returns DTOs
            await this._adminTrainerService.rejectTrainer(validatedBody.id);
            controller_error_handler_util_1.ControllerErrorHandler.handleSuccess(res, null, response_message_constant_1.HttpResponse.TRAINER_REJECTED_SUCCESSFULL);
        }
        catch (error) {
            controller_error_handler_util_1.ControllerErrorHandler.handleError(error, res, next);
        }
    }
}
exports.AdminTrainerController = AdminTrainerController;
//# sourceMappingURL=admin.trainer.controller.js.map