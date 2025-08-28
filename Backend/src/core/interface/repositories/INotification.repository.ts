import { INotification } from "../model/INotification.model";
import { IBaseRepository } from "./IBase.repository";

export interface INotificationRepository
  extends IBaseRepository<INotification> {
  findByUser(
    userId: string,
    page?: number,
    limit?: number,
    search?: string,
    type?: string,
    sort?: string
  ): Promise< { notifications: INotification[]; total: number } >;
  getBasicDetails(userId:string): Promise<{ total: number; read: number}>;
  markAsRead(notificationId: string): Promise<INotification | null>;
  findLastFiveByUser(userId: string): Promise<INotification[]>;
  markAllAsRead(userId: string): Promise<void>
}
