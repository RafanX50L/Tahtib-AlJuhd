"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminCommonController = void 0;
const response_message_constant_1 = require("../../constants/response-message.constant");
const CommonDTO_1 = require("../../dtos/reverse-mapping/admin/CommonDTO");
const controller_error_handler_util_1 = require("../../utils/controller-error-handler.util");
class AdminCommonController {
    _adminCommonService;
    constructor(_adminCommonService) {
        this._adminCommonService = _adminCommonService;
    }
    placeholder;
    async blockOrUnblock(req, res, next) {
        try {
            // Validate and transform request parameters using DTO
            const validatedParams = CommonDTO_1.AdminCommonDTO.validateBlockOrUnblockRequest(req.params);
            // Call service with validated parameters - service already returns DTOs
            await this._adminCommonService.blockOrUnblock(validatedParams.id);
            controller_error_handler_util_1.ControllerErrorHandler.handleSuccess(res, null, response_message_constant_1.HttpResponse.USER_STATUS_UPDATED_SUCCESSFULL);
        }
        catch (error) {
            controller_error_handler_util_1.ControllerErrorHandler.handleError(error, res, next);
        }
    }
}
exports.AdminCommonController = AdminCommonController;
//# sourceMappingURL=admin.common.controller.js.map