"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminClientDTO = void 0;
const validation_util_1 = require("../../../utils/validation.util");
class AdminClientDTO {
    /**
     * Validates and transforms request query parameters
     */
    static validateGetAllClientsRequest(query) {
        // Validate pagination parameters
        const { page, limit } = validation_util_1.ValidationUtil.validatePagination(query);
        // Validate plan status filter
        const planStatus = validation_util_1.ValidationUtil.validateEnum(query.planStatus, 'planStatus', ['Active', 'Inactive', 'all']);
        // Validate and sanitize search term
        const search = validation_util_1.ValidationUtil.validateString(query.search, 'search', 100);
        return {
            page,
            limit,
            planStatus,
            search,
        };
    }
}
exports.AdminClientDTO = AdminClientDTO;
//# sourceMappingURL=ClientDTO.js.map