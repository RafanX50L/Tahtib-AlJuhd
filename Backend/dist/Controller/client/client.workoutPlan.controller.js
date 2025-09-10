"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientWorkoutPlanController = void 0;
const response_message_constant_1 = require("../../constants/response-message.constant");
const status_constant_1 = require("../../constants/status.constant");
const logger_utils_1 = __importDefault(require("../../utils/logger.utils"));
class ClientWorkoutPlanController {
    _workoutPlanServices;
    constructor(_workoutPlanServices) {
        this._workoutPlanServices = _workoutPlanServices;
    }
    /** Reserved for Diet plan specific methods */
    _placeholder;
    async getWorkouts(req, res, next) {
        try {
            logger_utils_1.default.info('enterd to get workouts');
            const userId = req.user?.id;
            const week = req.params.week;
            const workouts = await this._workoutPlanServices.getWorkouts(userId, week);
            res.status(status_constant_1.HttpStatus.OK).json({ message: response_message_constant_1.HttpResponse.WORKOUTS_FETCHED_SUCCESSFULL, workouts: workouts });
        }
        catch (error) {
            next(error);
        }
    }
    async completeDailyWorkoutAndFetchReport(req, res, next) {
        try {
            const { week, day, workout } = req.body;
            const userId = req.user?.id;
            const report = await this._workoutPlanServices.completeDailyWorkoutAndFetchReport(userId, week, day, workout);
            res.status(status_constant_1.HttpStatus.OK).json({ message: response_message_constant_1.HttpResponse.WORKOUT_STATUS_UPDATED_SUCCESSFULL, data: report });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.ClientWorkoutPlanController = ClientWorkoutPlanController;
//# sourceMappingURL=client.workoutPlan.controller.js.map