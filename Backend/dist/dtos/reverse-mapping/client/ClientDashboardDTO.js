"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientDashboardDTO = void 0;
const validation_util_1 = require("../../../utils/validation.util");
/**
 * Client Dashboard DTO class for input validation
 * Handles validation and transformation of client dashboard-related requests
 */
class ClientDashboardDTO {
    /**
     * Validates and transforms get client dashboard stats request
     */
    static validateGetClientDashboardStatsRequest(params) {
        const clientId = params.clientId
            ? validation_util_1.ValidationUtil.validateString(params.clientId, 'clientId', 50)
            : undefined;
        return {
            clientId,
        };
    }
}
exports.ClientDashboardDTO = ClientDashboardDTO;
//# sourceMappingURL=ClientDashboardDTO.js.map