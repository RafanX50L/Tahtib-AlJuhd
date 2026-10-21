"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const NotificationDTO_1 = require("../../dtos/shared/NotificationDTO");
class NotificationService {
    notificationRepo;
    constructor(notificationRepo) {
        this.notificationRepo = notificationRepo;
    }
    async createNotification(data) {
        return this.notificationRepo.create({
            ...data,
            createdAt: new Date(),
            read: false,
        });
    }
    async getLastFiveNotification(userId) {
        const result = await this.notificationRepo.findLastFiveByUser(userId);
        return await NotificationDTO_1.NotificationDTO.mapToNotificationData(result);
    }
    async getNotificationsForUser({ userId, page, limit, search, type, sort, }) {
        const result = await this.notificationRepo.findByUser(userId, page, limit, search, type, sort);
        const mapped = await NotificationDTO_1.NotificationDTO.mapToNotificationData(result.notifications);
        return { notifications: mapped, total: result.total };
    }
    async getBasicDetails(userId) {
        return await this.notificationRepo.getBasicDetails(userId);
    }
    async markNotificationAsRead(notificationId) {
        return await this.notificationRepo.markAsRead(notificationId);
    }
    async markAllAsRead(userId) {
        await this.notificationRepo.markAllAsRead(userId);
    }
    async deleteNotification(notificationId) {
        await this.notificationRepo.deleteOne({ _id: notificationId });
    }
}
exports.NotificationService = NotificationService;
//# sourceMappingURL=Notification.service.js.map