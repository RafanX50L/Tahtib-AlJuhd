"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrainerDashboardDTO = void 0;
const validation_util_1 = require("../../../utils/validation.util");
/**
 * Trainer Dashboard DTO class for input validation
 * Handles validation and transformation of trainer dashboard-related requests
 */
class TrainerDashboardDTO {
    /**
     * Validates and transforms get payments request
     */
    static validateGetPaymentsRequest(query) {
        const page = query.page
            ? validation_util_1.ValidationUtil.validateRange(query.page, 'page', 1, 1000)
            : undefined;
        const limit = query.limit
            ? validation_util_1.ValidationUtil.validateRange(query.limit, 'limit', 1, 100)
            : undefined;
        const status = query.status
            ? validation_util_1.ValidationUtil.validateEnum(query.status, 'status', ['pending', 'completed', 'failed', 'refunded', 'all'])
            : 'all';
        const search = validation_util_1.ValidationUtil.validateString(query.search, 'search', 100);
        return {
            page,
            limit,
            status,
            search,
        };
    }
}
exports.TrainerDashboardDTO = TrainerDashboardDTO;
//# sourceMappingURL=TrainerDashboardDTO.js.map