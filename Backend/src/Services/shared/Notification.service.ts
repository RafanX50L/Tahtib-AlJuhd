import { INotification } from "@/core/interface/model/INotification.model";
import { INotificationRepository } from "@/core/interface/repositories/INotification.repository";
import { INotificationService } from "@/core/interface/services/shared/INotification.Service";
import { INotificationView, NotificationDTO } from "@/dtos/shared/NotificationDTO";

export class NotificationService implements INotificationService {
  constructor(private readonly notificationRepo: INotificationRepository) {}

  async createNotification(data: {
    senderId: string;
    recipientId?: string;
    recipientRole?: string;
    message: string;
    type: string;
  }): Promise<INotification> {
    return this.notificationRepo.create({
      ...data,
      createdAt: new Date(),
      read: false,
    });
  }

  async getLastFiveNotification(userId: string): Promise<INotificationView[]> {
    console.log("notification user", userId);
    const result = await this.notificationRepo.findLastFiveByUser(userId);
    console.log("notification result", result);
    return await NotificationDTO.mapToNotificationData(result);
  }

  async getNotificationsForUser({
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
  }): Promise< { notifications: INotificationView[]; total: number } > {
    const result = await this.notificationRepo.findByUser(userId, page, limit, search, type, sort);

    const mapped = await NotificationDTO.mapToNotificationData(result.notifications);
    return { notifications: mapped, total: result.total };
  }

  async getBasicDetails(userId:string): Promise<{ total: number; read: number }> {
    return await this.notificationRepo.getBasicDetails(userId);
  }

  async markNotificationAsRead(notificationId: string): Promise<INotification | null> {
    return await this.notificationRepo.markAsRead(notificationId);
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.notificationRepo.markAllAsRead(userId);
  }
  
  async deleteNotification(notificationId: string): Promise<void> {
    await this.notificationRepo.deleteOne({ _id: notificationId });
  }
}