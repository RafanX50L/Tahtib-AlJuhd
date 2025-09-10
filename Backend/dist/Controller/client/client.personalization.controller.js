"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientPersonalizationController = void 0;
const response_message_constant_1 = require("../../constants/response-message.constant");
const status_constant_1 = require("../../constants/status.constant");
class ClientPersonalizationController {
    _personalizationServices;
    constructor(_personalizationServices) {
        this._personalizationServices = _personalizationServices;
    }
    async generatePersonalization(req, res, next) {
        try {
            const clientPersonalizationData = req.body;
            const userId = req.user?.id;
            await this._personalizationServices.generatePersonalization(userId, clientPersonalizationData);
            res.status(status_constant_1.HttpStatus.CREATED).json({
                message: response_message_constant_1.HttpResponse.GENERATING_FITNESS_PLAN_SUCCESSFULL,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getWorkoutDetails(req, res, next) {
        try {
            const userId = req.user?.id;
            const workoutDetails = await this._personalizationServices.getWorkoutDetails(userId);
            res.status(status_constant_1.HttpStatus.OK).json({ message: response_message_constant_1.HttpResponse.DATA_FETCHING_SUCCESSFULL, workoutDetails: workoutDetails });
        }
        catch (error) {
            next(error);
        }
    }
    async getProfileData(req, res, next) {
        try {
            const userId = req.user?.id;
            const profileData = await this._personalizationServices.getProfileData(userId);
            res.status(status_constant_1.HttpStatus.OK).json({ message: response_message_constant_1.HttpResponse.DATA_FETCHING_SUCCESSFULL, data: profileData });
        }
        catch (error) {
            next(error);
        }
    }
    async updateClientProfile(req, res, next) {
        try {
            const userId = req.user.id;
            const formdata = req.body;
            console.log(req.body);
            await this._personalizationServices.updateClientProfile(userId, formdata);
            res.status(status_constant_1.HttpStatus.OK).json({ success: true, message: response_message_constant_1.HttpResponse.PROFILE_DATA_UPDATION_SUCCESSFULL });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.ClientPersonalizationController = ClientPersonalizationController;
//# sourceMappingURL=client.personalization.controller.js.map