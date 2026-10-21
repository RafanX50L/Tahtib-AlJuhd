"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationDTO = void 0;
const validation_util_1 = require("../../../utils/validation.util");
/**
 * Notification DTO class for input validation
 * Handles validation and transformation of notification-related requests
 */
class NotificationDTO {
    /**
     * Validates and transforms get notifications request
     */
    static validateGetNotificationsRequest(query) {
        const page = query.page
            ? validation_util_1.ValidationUtil.validateRange(query.page, 'page', 1, 1000)
            : 1;
        const limit = query.limit
            ? validation_util_1.ValidationUtil.validateRange(query.limit, 'limit', 1, 100)
            : 10;
        const search = query.search ? validation_util_1.ValidationUtil.validateString(query.search, 'search', 100) : undefined;
        const type = query.type ? validation_util_1.ValidationUtil.validateString(query.type, 'type', 50) : undefined;
        const sort = query.sort ? validation_util_1.ValidationUtil.validateString(query.sort, 'sort', 50) : undefined;
        return {
            page,
            limit,
            search,
            type,
            sort,
        };
    }
    /**
     * Validates and transforms mark as read request
     */
    static validateMarkAsReadRequest(params) {
        const notificationId = validation_util_1.ValidationUtil.validateString(params.notificationId, 'notificationId', 50);
        return {
            notificationId,
        };
    }
    /**
     * Validates and transforms delete notification request
     */
    static validateDeleteNotificationRequest(params) {
        const notificationId = validation_util_1.ValidationUtil.validateString(params.notificationId, 'notificationId', 50);
        return {
            notificationId,
        };
    }
}
exports.NotificationDTO = NotificationDTO;
//# sourceMappingURL=NotificationDTO.js.map