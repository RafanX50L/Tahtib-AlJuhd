"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientTrainerDTO = void 0;
const validation_util_1 = require("../../../utils/validation.util");
/**
 * Client Trainer DTO class for input validation
 * Handles validation and transformation of client trainer-related requests
 */
class ClientTrainerDTO {
    /**
     * Validates and transforms get available trainers request
     */
    static validateGetAvailableTrainersRequest(query) {
        const page = query.page
            ? validation_util_1.ValidationUtil.validateRange(query.page, 'page', 1, 1000)
            : 1;
        const limit = query.limit
            ? validation_util_1.ValidationUtil.validateRange(query.limit, 'limit', 1, 100)
            : 10;
        const search = validation_util_1.ValidationUtil.validateString(query.search, 'search', 100);
        const specialty = validation_util_1.ValidationUtil.validateString(query.specialty, 'specialty', 100);
        return {
            page,
            limit,
            search,
            specialty,
        };
    }
    /**
     * Validates and transforms get trainer by ID request
     */
    static validateGetTrainerByIdRequest(params) {
        const id = validation_util_1.ValidationUtil.validateString(params.id, 'id', 50);
        return {
            id,
        };
    }
    /**
     * Validates and transforms book slot request
     */
    static validateBookSlotRequest(body) {
        const sessionId = validation_util_1.ValidationUtil.validateString(body.sessionId, 'sessionId', 50);
        return {
            sessionId,
        };
    }
    /**
     * Validates and transforms cancel session request
     */
    static validateCancelSessionRequest(params) {
        const sessionId = validation_util_1.ValidationUtil.validateString(params.sessionId, 'sessionId', 50);
        return {
            sessionId,
        };
    }
}
exports.ClientTrainerDTO = ClientTrainerDTO;
//# sourceMappingURL=ClientTrainerDTO.js.map