"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminDashboardDTO = void 0;
const validation_util_1 = require("../../../utils/validation.util");
class AdminDashboardDTO {
    /**
     * Validates and transforms get revenue trends request parameters
     */
    static validateGetRevenueTrendsRequest(query) {
        const monthsBack = query.monthsBack
            ? validation_util_1.ValidationUtil.validateRange(query.monthsBack, "monthsBack", 1, 24)
            : 6; // default to 6 months
        return {
            monthsBack,
        };
    }
    /**
     * Validates and transforms get top trainers request parameters
     */
    static validateGetTopTrainersRequest(query) {
        const limit = query.limit
            ? validation_util_1.ValidationUtil.validateRange(query.limit, "limit", 1, 50)
            : 5; // default to 5 trainers
        return {
            limit,
        };
    }
    /**
     * Validates and transforms get recent payments request parameters
     */
    static validateGetRecentPaymentsRequest(query) {
        const page = query.page
            ? validation_util_1.ValidationUtil.validateRange(query.page, "page", 1, 1000)
            : 1; // default to page 1
        const pageSize = query.pageSize
            ? validation_util_1.ValidationUtil.validateRange(query.pageSize, "pageSize", 1, 100)
            : 10; // default to 10 items per page
        const searchTerm = validation_util_1.ValidationUtil.validateString(query.searchTerm, "searchTerm", 100);
        return {
            page,
            pageSize,
            searchTerm,
        };
    }
}
exports.AdminDashboardDTO = AdminDashboardDTO;
//# sourceMappingURL=DashboardDTO.js.map