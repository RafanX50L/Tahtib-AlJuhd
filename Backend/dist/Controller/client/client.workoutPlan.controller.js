var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { HttpResponse } from "../../constants/response-message.constant";
import { HttpStatus } from "../../constants/status.constant";
import logger from "../../utils/logger.utils";
export class ClientWorkoutPlanController {
    constructor(_workoutPlanServices) {
        this._workoutPlanServices = _workoutPlanServices;
    }
    getWorkouts(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                logger.info('enterd to get workouts');
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                const week = req.params.week;
                const workouts = yield this._workoutPlanServices.getWorkouts(userId, week);
                res.status(HttpStatus.OK).json({ message: HttpResponse.WORKOUTS_FETCHED_SUCCESSFULL, workouts: workouts });
            }
            catch (error) {
                next(error);
            }
        });
    }
    completeDailyWorkoutAndFetchReport(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { week, day, workout } = req.body;
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                const report = yield this._workoutPlanServices.completeDailyWorkoutAndFetchReport(userId, week, day, workout);
                res.status(HttpStatus.OK).json({ message: HttpResponse.WORKOUT_STATUS_UPDATED_SUCCESSFULL, data: report });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
//# sourceMappingURL=client.workoutPlan.controller.js.map