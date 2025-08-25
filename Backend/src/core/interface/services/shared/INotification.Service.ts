import { INotificationView } from "@/dtos/shared/NotificationDTO";
import { INotification } from "../../model/INotification.model";

export interface INotificationService {
  createNotification(data: {
    senderId: string;
    recipientId?: string;
    recipientRole?: string;
    message: string;
    type: string;
  }): Promise<INotification>;
  getLastFiveNotification(userId: string): Promise<INotificationView[]>;
  getNotificationsForUser({
    userId,
    page,
    limit,
    search,
    type,
    sort,
  }: {
    userId: string;
    page?: number;
    limit?: number;
    search?: string;
    type?: string;
    sort?: string;
  }): Promise< INotificationView[] >;
  getBasicDetails(userId:string): Promise<{ total: number; read: number }>;
  markNotificationAsRead(notificationId: string): Promise<INotification | null>;
  markAllAsRead(userId: string): Promise<void>;
  deleteNotification(notificationId: string): Promise<void>;
}
