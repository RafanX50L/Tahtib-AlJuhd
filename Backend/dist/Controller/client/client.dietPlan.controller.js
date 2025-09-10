"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientDietPlanController = void 0;
const response_message_constant_1 = require("../../constants/response-message.constant");
const status_constant_1 = require("../../constants/status.constant");
class ClientDietPlanController {
    _dietPlanServices;
    constructor(_dietPlanServices) {
        this._dietPlanServices = _dietPlanServices;
    }
    _placeholder;
    async getDietPlan(req, res, next) {
        try {
            const userId = req.user?.id;
            const data = await this._dietPlanServices.getDietPlan(userId);
            res.status(status_constant_1.HttpStatus.OK).json({ message: response_message_constant_1.HttpResponse.DATA_FETCHING_SUCCESSFULL, data: data });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.ClientDietPlanController = ClientDietPlanController;
//# sourceMappingURL=client.dietPlan.controller.js.map