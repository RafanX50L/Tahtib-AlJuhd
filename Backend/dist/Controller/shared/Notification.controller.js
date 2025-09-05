var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { HttpStatus } from "../../constants/status.constant";
export class NotificationController {
    constructor(notificationService) {
        this.notificationService = notificationService;
    }
    getNotifications(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                if (!userId) {
                    return res.status(HttpStatus.UNAUTHORIZED).json({ error: "Unauthorized" });
                }
                const { page = 1, limit = 10, search, type, sort } = req.query;
                const notifications = yield this.notificationService.getNotificationsForUser({
                    userId,
                    page: parseInt(page, 10),
                    limit: parseInt(limit, 10),
                    search: search,
                    type: type,
                    sort: sort,
                });
                res.status(HttpStatus.OK).json(notifications);
            }
            catch (err) {
                next(err);
            }
        });
    }
    getBasicDetails(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                if (!userId) {
                    return res.status(HttpStatus.UNAUTHORIZED).json({ error: "Unauthorized" });
                }
                const basicDetails = yield this.notificationService.getBasicDetails(userId);
                res.status(HttpStatus.OK).json(basicDetails);
            }
            catch (error) {
                next(error);
            }
        });
    }
    getLastFiveNotifications(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                if (!userId) {
                    return res.status(HttpStatus.UNAUTHORIZED).json({ error: "Unauthorized" });
                }
                const notifications = yield this.notificationService.getLastFiveNotification(userId);
                res.status(HttpStatus.OK).json(notifications);
            }
            catch (err) {
                next(err);
            }
        });
    }
    markAsRead(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { notificationId } = req.params;
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                if (!userId) {
                    return res.status(HttpStatus.UNAUTHORIZED).json({ error: "Unauthorized" });
                }
                const notification = yield this.notificationService.markNotificationAsRead(notificationId);
                if (!notification) {
                    return res.status(HttpStatus.NOT_FOUND).json({ error: "Notification not found" });
                }
                res.status(HttpStatus.OK).json(notification);
            }
            catch (err) {
                next(err);
            }
        });
    }
    markAllAsRead(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                if (!userId) {
                    return res.status(HttpStatus.UNAUTHORIZED).json({ error: "Unauthorized" });
                }
                yield this.notificationService.markAllAsRead(userId);
                res.status(HttpStatus.OK).json({ message: "All notifications marked as read" });
            }
            catch (err) {
                next(err);
            }
        });
    }
    deleteNotification(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { notificationId } = req.params;
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                if (!userId) {
                    return res.status(HttpStatus.UNAUTHORIZED).json({ error: "Unauthorized" });
                }
                yield this.notificationService.deleteNotification(notificationId);
                res.status(HttpStatus.OK).json({ message: "Notification deleted" });
            }
            catch (err) {
                next(err);
            }
        });
    }
}
//# sourceMappingURL=Notification.controller.js.map