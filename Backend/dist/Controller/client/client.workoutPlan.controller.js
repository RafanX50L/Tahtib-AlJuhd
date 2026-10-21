"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientWorkoutPlanController = void 0;
const response_message_constant_1 = require("../../constants/response-message.constant");
const logger_utils_1 = __importDefault(require("../../utils/logger.utils"));
const ClientWorkoutPlanDTO_1 = require("../../dtos/reverse-mapping/client/ClientWorkoutPlanDTO");
const controller_error_handler_util_1 = require("../../utils/controller-error-handler.util");
class ClientWorkoutPlanController {
    _workoutPlanServices;
    constructor(_workoutPlanServices) {
        this._workoutPlanServices = _workoutPlanServices;
    }
    /** Reserved for Diet plan specific methods */
    _placeholder;
    async getWorkouts(req, res, next) {
        try {
            logger_utils_1.default.info('entered to get workouts');
            // Validate and transform request parameters using DTO
            const validatedParams = ClientWorkoutPlanDTO_1.ClientWorkoutPlanDTO.validateGetWorkoutsRequest(req.params);
            const userId = req.user?.id;
            const workouts = await this._workoutPlanServices.getWorkouts(userId, validatedParams.week);
            controller_error_handler_util_1.ControllerErrorHandler.handleSuccess(res, { workouts }, response_message_constant_1.HttpResponse.WORKOUTS_FETCHED_SUCCESSFULL);
        }
        catch (error) {
            controller_error_handler_util_1.ControllerErrorHandler.handleError(error, res, next);
        }
    }
    async completeDailyWorkoutAndFetchReport(req, res, next) {
        try {
            // Validate and transform request body using DTO
            const validatedBody = ClientWorkoutPlanDTO_1.ClientWorkoutPlanDTO.validateCompleteDailyWorkoutRequest(req.body);
            const userId = req.user?.id;
            const report = await this._workoutPlanServices.completeDailyWorkoutAndFetchReport(userId, validatedBody.week, validatedBody.day, validatedBody.workout);
            controller_error_handler_util_1.ControllerErrorHandler.handleSuccess(res, { data: report }, response_message_constant_1.HttpResponse.WORKOUT_STATUS_UPDATED_SUCCESSFULL);
        }
        catch (error) {
            controller_error_handler_util_1.ControllerErrorHandler.handleError(error, res, next);
        }
    }
    async getWorkoutReport(req, res, next) {
        try {
            // Validate and transform request query using DTO
            const validatedQuery = ClientWorkoutPlanDTO_1.ClientWorkoutPlanDTO.validateGetWorkoutReportRequest(req.query);
            const userId = req.user?.id;
            const report = await this._workoutPlanServices.getWorkoutReport(userId, validatedQuery.week, validatedQuery.day);
            controller_error_handler_util_1.ControllerErrorHandler.handleSuccess(res, { report }, response_message_constant_1.HttpResponse.DATA_FETCHING_SUCCESSFULL);
        }
        catch (error) {
            controller_error_handler_util_1.ControllerErrorHandler.handleError(error, res, next);
        }
    }
}
exports.ClientWorkoutPlanController = ClientWorkoutPlanController;
//# sourceMappingURL=client.workoutPlan.controller.js.map