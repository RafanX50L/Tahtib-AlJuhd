import { BaseRepository } from "@/Repository/base.repository";
import { INotification } from "@/core/interface/model/INotification.model";
import { INotificationRepository } from "@/core/interface/repositories/INotification.repository";
import { NotificationModel } from "@/models/Notification.model";
import { FilterQuery, SortOrder } from "mongoose";

export class NotificationRepository
  extends BaseRepository<INotification>
  implements INotificationRepository
{
  constructor() {
    super(NotificationModel);
  }

  async findLastFiveByUser(userId: string): Promise<INotification[]> {
  return this.model
    .find({
      $or: [
        { recipientId: userId }
      ],
    })
    .sort({ createdAt: -1 }) // 🔥 Newest first
    .limit(5);
}


  async findByUser(
    userId: string,
    page?: number,
    limit?: number,
    search?: string,
    type?: string,
    sort?: string
  ): Promise<INotification[]> {
    const query:  FilterQuery<INotification> = {
      $or: [
        { recipientId: userId },
        { recipientRole: { $in: ["trainer", "client", "admin"] } },
      ],
    };

    if (search) {
      query.message = { $regex: search, $options: "i" };
    }


    if (type) {
      if (type === "unread") {
        query.read = false;
      } else if (type === "read") {
        query.read = true;
      } else {
        query.type = type;
      }
    }

    const sortOption: Record<string, SortOrder> =
      sort === "newest" ? { createdAt: -1 } : { createdAt: 1 };

    let queryBuilder = this.model.find(query).sort(sortOption);

    if (page && limit) {
      queryBuilder = queryBuilder.skip((page - 1) * limit).limit(limit);
    }
    
    return await queryBuilder;

  }

  async getBasicDetails(userId:string): Promise<{ total: number; read: number}> {
    const total = await this.model.countDocuments({
      $or: [
        { recipientId: userId },
        { recipientRole: { $in: ["trainer", "client", "admin"] } },
      ],
    });
    const read = await this.model.countDocuments({
      $or: [
        { recipientId: userId },
        { recipientRole: { $in: ["trainer", "client", "admin"] } },
      ],
      read: true,
    });
    return { total, read};
  }

  async markAsRead(notificationId: string): Promise<INotification | null> {
    return this.model.findByIdAndUpdate(
      notificationId,
      { read: true },
      { new: true }
    );
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.model.updateMany(
      { recipientId: userId, read: false },
      { read: true }
    );
  }
}
