"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientDietPlanController = void 0;
const response_message_constant_1 = require("../../constants/response-message.constant");
const controller_error_handler_util_1 = require("../../utils/controller-error-handler.util");
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
            controller_error_handler_util_1.ControllerErrorHandler.handleSuccess(res, { data }, response_message_constant_1.HttpResponse.DATA_FETCHING_SUCCESSFULL);
        }
        catch (error) {
            controller_error_handler_util_1.ControllerErrorHandler.handleError(error, res, next);
        }
    }
}
exports.ClientDietPlanController = ClientDietPlanController;
//# sourceMappingURL=client.dietPlan.controller.js.map