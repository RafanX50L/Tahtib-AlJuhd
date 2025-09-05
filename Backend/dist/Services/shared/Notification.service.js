var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { NotificationDTO } from "../../dtos/shared/NotificationDTO";
export class NotificationService {
    constructor(notificationRepo) {
        this.notificationRepo = notificationRepo;
    }
    createNotification(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.notificationRepo.create(Object.assign(Object.assign({}, data), { createdAt: new Date(), read: false }));
        });
    }
    getLastFiveNotification(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("notification user", userId);
            const result = yield this.notificationRepo.findLastFiveByUser(userId);
            console.log("notification result", result);
            return yield NotificationDTO.mapToNotificationData(result);
        });
    }
    getNotificationsForUser(_a) {
        return __awaiter(this, arguments, void 0, function* ({ userId, page, limit, search, type, sort, }) {
            const result = yield this.notificationRepo.findByUser(userId, page, limit, search, type, sort);
            const mapped = yield NotificationDTO.mapToNotificationData(result.notifications);
            return { notifications: mapped, total: result.total };
        });
    }
    getBasicDetails(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.notificationRepo.getBasicDetails(userId);
        });
    }
    markNotificationAsRead(notificationId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.notificationRepo.markAsRead(notificationId);
        });
    }
    markAllAsRead(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.notificationRepo.markAllAsRead(userId);
        });
    }
    deleteNotification(notificationId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.notificationRepo.deleteOne({ _id: notificationId });
        });
    }
}
//# sourceMappingURL=Notification.service.js.map