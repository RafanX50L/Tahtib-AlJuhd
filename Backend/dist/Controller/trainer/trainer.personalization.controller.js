"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrainerPersonalizationController = void 0;
const response_message_constant_1 = require("../../constants/response-message.constant");
const status_constant_1 = require("../../constants/status.constant");
const logger_utils_1 = __importDefault(require("../../utils/logger.utils"));
class TrainerPersonalizationController {
    _personalizationService;
    constructor(_personalizationService) {
        this._personalizationService = _personalizationService;
    }
    _private;
    async submitApplication(req, res, next) {
        try {
            const userId = req.user.id;
            console.log("nice one");
            await this._personalizationService.submitApplication(userId, req);
            console.log("nice one1");
            res
                .status(status_constant_1.HttpStatus.OK)
                .json({ message: response_message_constant_1.HttpResponse.APPLICATION_SUBMISSION_SUCCESSFULL });
        }
        catch (error) {
            next(error);
        }
    }
    async getPendingApplicationDetails(req, res, next) {
        try {
            logger_utils_1.default.info('enterd to fetch details');
            const userId = req.user?.id;
            const data = await this._personalizationService.getPendingApplicationDetails(userId);
            res.status(status_constant_1.HttpStatus.OK).json({ message: response_message_constant_1.HttpResponse.DATA_FETCHING_SUCCESSFULL, data: data });
        }
        catch (error) {
            next(error);
        }
    }
    async getProfileData(req, res, next) {
        try {
            const userId = req.user.id;
            const result = await this._personalizationService.getTrainerProfile(userId);
            console.log('result', result);
            res.status(status_constant_1.HttpStatus.OK).json({ message: response_message_constant_1.HttpResponse.DATA_FETCHING_SUCCESSFULL, data: result });
        }
        catch (error) {
            next(error);
        }
    }
    async updateProfileData(req, res, next) {
        try {
            const data = req.body;
            const userId = req.user.id;
            console.log(data);
            await this._personalizationService.updateProfileData(userId, data);
            res.status(status_constant_1.HttpStatus.OK).json({ message: response_message_constant_1.HttpResponse.PROFILE_DATA_UPDATION_SUCCESSFULL });
        }
        catch (error) {
            next(error);
        }
    }
    async getSalary(req, res, next) {
        try {
            const userId = req.user.id;
            const salary = await this._personalizationService.getSalary(userId);
            res.status(status_constant_1.HttpStatus.OK).json({ message: response_message_constant_1.HttpResponse.DATA_FETCHING_SUCCESSFULL, salary });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.TrainerPersonalizationController = TrainerPersonalizationController;
//# sourceMappingURL=trainer.personalization.controller.js.map