"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminClinetController = void 0;
const response_message_constant_1 = require("../../constants/response-message.constant");
const status_constant_1 = require("../../constants/status.constant");
class AdminClinetController {
    _adminClinetService;
    constructor(_adminClinetService) {
        this._adminClinetService = _adminClinetService;
    }
    placeholder;
    async getAllClinet(req, res, next) {
        try {
            const { page, limit, planStatus, search } = req.query;
            const data = await this._adminClinetService.getAllClinets(planStatus.toString(), search.toString(), Number(page), Number(limit));
            res.status(status_constant_1.HttpStatus.OK).json({ message: response_message_constant_1.HttpResponse.DATA_FETCHING_SUCCESSFULL, data: data });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.AdminClinetController = AdminClinetController;
//# sourceMappingURL=admin.client.controller.js.map