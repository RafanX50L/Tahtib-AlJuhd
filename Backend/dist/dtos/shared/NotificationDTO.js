"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationDTO = void 0;
class NotificationDTO {
    static async mapToNotificationData(raw) {
        return raw.map(notification => ({
            id: notification.id,
            sender: notification.senderId,
            receiver: notification.recipientId,
            role: notification.recipientRole,
            text: notification.message,
            category: notification.type,
            date: notification.createdAt,
            isRead: notification.read
        }));
    }
}
exports.NotificationDTO = NotificationDTO;
//# sourceMappingURL=NotificationDTO.js.map