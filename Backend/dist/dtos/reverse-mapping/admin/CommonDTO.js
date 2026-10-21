"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminCommonDTO = void 0;
const validation_util_1 = require("../../../utils/validation.util");
class AdminCommonDTO {
    /**
     * Validates and transforms block/unblock request parameters
     */
    static validateBlockOrUnblockRequest(params) {
        const id = validation_util_1.ValidationUtil.validateObjectId(params.id, 'id');
        return {
            id,
        };
    }
}
exports.AdminCommonDTO = AdminCommonDTO;
//# sourceMappingURL=CommonDTO.js.map