"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminCommonController = void 0;
const response_message_constant_1 = require("../../constants/response-message.constant");
const status_constant_1 = require("../../constants/status.constant");
class AdminCommonController {
    _adminCommonService;
    constructor(_adminCommonService) {
        this._adminCommonService = _adminCommonService;
    }
    placeholder;
    async blockOrUnblock(req, res, next) {
        try {
            const { id } = req.params;
            await this._adminCommonService.blockOrUnblock(id);
            res.status(status_constant_1.HttpStatus.OK).json({ message: response_message_constant_1.HttpResponse.USER_STATUS_UPDATED_SUCCESSFULL });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.AdminCommonController = AdminCommonController;
//# sourceMappingURL=admin.common.controller.js.map