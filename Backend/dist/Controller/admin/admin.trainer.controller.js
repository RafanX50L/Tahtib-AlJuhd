"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminTrainerController = void 0;
const response_message_constant_1 = require("../../constants/response-message.constant");
const status_constant_1 = require("../../constants/status.constant");
class AdminTrainerController {
    _adminTrainerService;
    constructor(_adminTrainerService) {
        this._adminTrainerService = _adminTrainerService;
    }
    async getApprovedTrainers(req, res, next) {
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;
            const search = req.query.search || "";
            const data = await this._adminTrainerService.getApprovedTrainers(page, limit, search);
            res.status(status_constant_1.HttpStatus.OK).json({
                message: response_message_constant_1.HttpResponse.DATA_FETCHING_SUCCESSFULL,
                data,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getPendingTrainers(req, res, next) {
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;
            const search = req.query.search || "";
            const data = await this._adminTrainerService.getPendingTrainers(page, limit, search);
            res.status(status_constant_1.HttpStatus.OK).json({
                message: response_message_constant_1.HttpResponse.DATA_FETCHING_SUCCESSFULL,
                data,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async scheduleInterview(req, res, next) {
        try {
            const adminId = req.user.id;
            const { trainerId, date, time } = req.params;
            const result = await this._adminTrainerService.scheduleInterview(trainerId, adminId, new Date(date), time);
            res.status(status_constant_1.HttpStatus.OK).json(result);
        }
        catch (error) {
            next(error);
        }
    }
    async submitInterviewFeedback(req, res, next) {
        try {
            const trainerId = req.body.id;
            const adminId = req.user.id;
            const { feedback } = req.body;
            await this._adminTrainerService.submitInterviewFeedback(trainerId, adminId, feedback);
            res.status(status_constant_1.HttpStatus.OK).json({ message: response_message_constant_1.HttpResponse.INTERVIEW_FEEDBACK_UPDATED_SUCCESSFULL });
        }
        catch (error) {
            next(error);
        }
    }
    async approveTrainer(req, res, next) {
        try {
            const trainerId = req.body.id;
            const salary = req.body.salary;
            await this._adminTrainerService.approveTrainer(trainerId, salary);
            res.status(status_constant_1.HttpStatus.OK).json({ message: response_message_constant_1.HttpResponse.TRAINER_APPROVAL_SUCCESSFULL });
        }
        catch (error) {
            next(error);
        }
    }
    async rejectTrainer(req, res, next) {
        try {
            const trainerId = req.body.id;
            await this._adminTrainerService.rejectTrainer(trainerId);
            res.status(status_constant_1.HttpStatus.OK).json({ message: response_message_constant_1.HttpResponse.TRAINER_REJECTED_SUCCESSFULL });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.AdminTrainerController = AdminTrainerController;
//# sourceMappingURL=admin.trainer.controller.js.map