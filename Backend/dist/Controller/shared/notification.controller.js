"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationController = void 0;
const NotificationDTO_1 = require("../../dtos/reverse-mapping/shared/NotificationDTO");
const controller_error_handler_util_1 = require("../../utils/controller-error-handler.util");
class NotificationController {
    notificationService;
    constructor(notificationService) {
        this.notificationService = notificationService;
    }
    async getNotifications(req, res, next) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                controller_error_handler_util_1.ControllerErrorHandler.handleError(new Error("Unauthorized"), res, next);
                return;
            }
            // Validate and transform request query using DTO
            const validatedQuery = NotificationDTO_1.NotificationDTO.validateGetNotificationsRequest(req.query);
            const notifications = await this.notificationService.getNotificationsForUser({
                userId,
                page: validatedQuery.page,
                limit: validatedQuery.limit,
                search: validatedQuery.search,
                type: validatedQuery.type,
                sort: validatedQuery.sort,
            });
            controller_error_handler_util_1.ControllerErrorHandler.handleSuccess(res, notifications, "Notifications retrieved successfully");
        }
        catch (err) {
            controller_error_handler_util_1.ControllerErrorHandler.handleError(err, res, next);
        }
    }
    async getBasicDetails(req, res, next) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                controller_error_handler_util_1.ControllerErrorHandler.handleError(new Error("Unauthorized"), res, next);
                return;
            }
            const basicDetails = await this.notificationService.getBasicDetails(userId);
            controller_error_handler_util_1.ControllerErrorHandler.handleSuccess(res, basicDetails, "Basic details retrieved successfully");
        }
        catch (error) {
            controller_error_handler_util_1.ControllerErrorHandler.handleError(error, res, next);
        }
    }
    async getLastFiveNotifications(req, res, next) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                controller_error_handler_util_1.ControllerErrorHandler.handleError(new Error("Unauthorized"), res, next);
                return;
            }
            const notifications = await this.notificationService.getLastFiveNotification(userId);
            controller_error_handler_util_1.ControllerErrorHandler.handleSuccess(res, notifications, "Last five notifications retrieved successfully");
        }
        catch (err) {
            controller_error_handler_util_1.ControllerErrorHandler.handleError(err, res, next);
        }
    }
    async markAsRead(req, res, next) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                controller_error_handler_util_1.ControllerErrorHandler.handleError(new Error("Unauthorized"), res, next);
                return;
            }
            // Validate and transform request parameters using DTO
            const validatedParams = NotificationDTO_1.NotificationDTO.validateMarkAsReadRequest(req.params);
            const notification = await this.notificationService.markNotificationAsRead(validatedParams.notificationId);
            if (!notification) {
                controller_error_handler_util_1.ControllerErrorHandler.handleNotFound(res, "Notification not found");
                return;
            }
            controller_error_handler_util_1.ControllerErrorHandler.handleSuccess(res, notification, "Notification marked as read successfully");
        }
        catch (err) {
            controller_error_handler_util_1.ControllerErrorHandler.handleError(err, res, next);
        }
    }
    async markAllAsRead(req, res, next) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                controller_error_handler_util_1.ControllerErrorHandler.handleError(new Error("Unauthorized"), res, next);
                return;
            }
            await this.notificationService.markAllAsRead(userId);
            controller_error_handler_util_1.ControllerErrorHandler.handleSuccess(res, null, "All notifications marked as read");
        }
        catch (err) {
            controller_error_handler_util_1.ControllerErrorHandler.handleError(err, res, next);
        }
    }
    async deleteNotification(req, res, next) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                controller_error_handler_util_1.ControllerErrorHandler.handleError(new Error("Unauthorized"), res, next);
                return;
            }
            // Validate and transform request parameters using DTO
            const validatedParams = NotificationDTO_1.NotificationDTO.validateDeleteNotificationRequest(req.params);
            await this.notificationService.deleteNotification(validatedParams.notificationId);
            controller_error_handler_util_1.ControllerErrorHandler.handleSuccess(res, null, "Notification deleted successfully");
        }
        catch (err) {
            controller_error_handler_util_1.ControllerErrorHandler.handleError(err, res, next);
        }
    }
}
exports.NotificationController = NotificationController;
//# sourceMappingURL=Notification.controller.js.map