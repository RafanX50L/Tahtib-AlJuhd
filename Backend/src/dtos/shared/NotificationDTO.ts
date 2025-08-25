import { INotification } from "@/core/interface/model/INotification.model";

export interface INotificationView {
  id: string;            // unique identifier
  sender: string;        // who sent it
  receiver?: string;     // who receives it (optional for role-based)
  role?: string;         // role of receiver (user, admin, trainer)
  text: string;          // notification message
  category: string;      // notification category/type
  date: Date;            // ISO date string for createdAt
  isRead: boolean;       // read/unread status
}

export class NotificationDTO {
    static async mapToNotificationData(raw:INotification[]):Promise<INotificationView[]>{
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