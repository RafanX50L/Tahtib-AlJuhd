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
export class AdminTrainerController {
    constructor(_adminTrainerService) {
        this._adminTrainerService = _adminTrainerService;
    }
    getApprovedTrainers(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = Number(req.query.page) || 1;
                const limit = Number(req.query.limit) || 10;
                const search = req.query.search || "";
                const data = yield this._adminTrainerService.getApprovedTrainers(page, limit, search);
                res.status(HttpStatus.OK).json({
                    message: HttpResponse.DATA_FETCHING_SUCCESSFULL,
                    data,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getPendingTrainers(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = Number(req.query.page) || 1;
                const limit = Number(req.query.limit) || 10;
                const search = req.query.search || "";
                const data = yield this._adminTrainerService.getPendingTrainers(page, limit, search);
                res.status(HttpStatus.OK).json({
                    message: HttpResponse.DATA_FETCHING_SUCCESSFULL,
                    data,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    scheduleInterview(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const adminId = req.user.id;
                const { trainerId, date, time } = req.params;
                const result = yield this._adminTrainerService.scheduleInterview(trainerId, adminId, new Date(date), time);
                res.status(HttpStatus.OK).json(result);
            }
            catch (error) {
                next(error);
            }
        });
    }
    submitInterviewFeedback(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const trainerId = req.body.id;
                const adminId = req.user.id;
                const { feedback } = req.body;
                yield this._adminTrainerService.submitInterviewFeedback(trainerId, adminId, feedback);
                res.status(HttpStatus.OK).json({ message: HttpResponse.INTERVIEW_FEEDBACK_UPDATED_SUCCESSFULL });
            }
            catch (error) {
                next(error);
            }
        });
    }
    approveTrainer(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const trainerId = req.body.id;
                const salary = req.body.salary;
                yield this._adminTrainerService.approveTrainer(trainerId, salary);
                res.status(HttpStatus.OK).json({ message: HttpResponse.TRAINER_APPROVAL_SUCCESSFULL });
            }
            catch (error) {
                next(error);
            }
        });
    }
    rejectTrainer(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const trainerId = req.body.id;
                yield this._adminTrainerService.rejectTrainer(trainerId);
                res.status(HttpStatus.OK).json({ message: HttpResponse.TRAINER_REJECTED_SUCCESSFULL });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
//# sourceMappingURL=admin.trainer.controller.js.map