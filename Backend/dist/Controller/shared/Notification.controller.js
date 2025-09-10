"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationController = void 0;
const status_constant_1 = require("../../constants/status.constant");
class NotificationController {
    notificationService;
    constructor(notificationService) {
        this.notificationService = notificationService;
    }
    async getNotifications(req, res, next) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(status_constant_1.HttpStatus.UNAUTHORIZED).json({ error: "Unauthorized" });
            }
            const { page = 1, limit = 10, search, type, sort } = req.query;
            const notifications = await this.notificationService.getNotificationsForUser({
                userId,
                page: parseInt(page, 10),
                limit: parseInt(limit, 10),
                search: search,
                type: type,
                sort: sort,
            });
            res.status(status_constant_1.HttpStatus.OK).json(notifications);
        }
        catch (err) {
            next(err);
        }
    }
    async getBasicDetails(req, res, next) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(status_constant_1.HttpStatus.UNAUTHORIZED).json({ error: "Unauthorized" });
            }
            const basicDetails = await this.notificationService.getBasicDetails(userId);
            res.status(status_constant_1.HttpStatus.OK).json(basicDetails);
        }
        catch (error) {
            next(error);
        }
    }
    async getLastFiveNotifications(req, res, next) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(status_constant_1.HttpStatus.UNAUTHORIZED).json({ error: "Unauthorized" });
            }
            const notifications = await this.notificationService.getLastFiveNotification(userId);
            res.status(status_constant_1.HttpStatus.OK).json(notifications);
        }
        catch (err) {
            next(err);
        }
    }
    async markAsRead(req, res, next) {
        try {
            const { notificationId } = req.params;
            const userId = req.user?.id;
            if (!userId) {
                return res.status(status_constant_1.HttpStatus.UNAUTHORIZED).json({ error: "Unauthorized" });
            }
            const notification = await this.notificationService.markNotificationAsRead(notificationId);
            if (!notification) {
                return res.status(status_constant_1.HttpStatus.NOT_FOUND).json({ error: "Notification not found" });
            }
            res.status(status_constant_1.HttpStatus.OK).json(notification);
        }
        catch (err) {
            next(err);
        }
    }
    async markAllAsRead(req, res, next) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(status_constant_1.HttpStatus.UNAUTHORIZED).json({ error: "Unauthorized" });
            }
            await this.notificationService.markAllAsRead(userId);
            res.status(status_constant_1.HttpStatus.OK).json({ message: "All notifications marked as read" });
        }
        catch (err) {
            next(err);
        }
    }
    async deleteNotification(req, res, next) {
        try {
            const { notificationId } = req.params;
            const userId = req.user?.id;
            if (!userId) {
                return res.status(status_constant_1.HttpStatus.UNAUTHORIZED).json({ error: "Unauthorized" });
            }
            await this.notificationService.deleteNotification(notificationId);
            res.status(status_constant_1.HttpStatus.OK).json({ message: "Notification deleted" });
        }
        catch (err) {
            next(err);
        }
    }
}
exports.NotificationController = NotificationController;
//# sourceMappingURL=Notification.controller.js.map