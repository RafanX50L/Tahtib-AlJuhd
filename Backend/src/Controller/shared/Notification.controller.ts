import { Response, NextFunction } from "express";
import { AddedRequest } from "@/middleware/verify.token.middleware";
import { HttpStatus } from "@/constants/status.constant";
import { INotificationService } from "@/core/interface/services/shared/INotification.Service";

export class NotificationController {
  constructor(private readonly notificationService: INotificationService) {}

  async getNotifications(req: AddedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(HttpStatus.UNAUTHORIZED).json({ error: "Unauthorized" });
      }
      const { page = 1, limit = 10, search, type, sort } = req.query;
      const notifications = await this.notificationService.getNotificationsForUser({
        userId,
        page: parseInt(page as string, 10),
        limit: parseInt(limit as string, 10),
        search: search as string,
        type: type as string,
        sort: sort as string,
      });
      res.status(HttpStatus.OK).json(notifications);
    } catch (err) {
      next(err);
    }
  }

  async getBasicDetails( req: AddedRequest, res: Response, next: NextFunction){
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(HttpStatus.UNAUTHORIZED).json({ error: "Unauthorized" });
      }
      const basicDetails = await this.notificationService.getBasicDetails(userId);
      res.status(HttpStatus.OK).json(basicDetails);
    } catch (error) {
      next(error);
    }
  }

  async getLastFiveNotifications(req: AddedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(HttpStatus.UNAUTHORIZED).json({ error: "Unauthorized" });
      }
      const notifications = await this.notificationService.getLastFiveNotification(userId);
      res.status(HttpStatus.OK).json(notifications);
    } catch (err) {
      next(err);
    }
  }

  async markAsRead(req: AddedRequest, res: Response, next: NextFunction) {
    try {
      const { notificationId } = req.params;
      const userId = req.user?.id;
      if (!userId) {
        return res.status(HttpStatus.UNAUTHORIZED).json({ error: "Unauthorized" });
      }
      const notification = await this.notificationService.markNotificationAsRead(notificationId);
      if (!notification) {
        return res.status(HttpStatus.NOT_FOUND).json({ error: "Notification not found" });
      }
      res.status(HttpStatus.OK).json(notification);
    } catch (err) {
      next(err);
    }
  }

  async markAllAsRead(req: AddedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(HttpStatus.UNAUTHORIZED).json({ error: "Unauthorized" });
      }
      await this.notificationService.markAllAsRead(userId);
      res.status(HttpStatus.OK).json({ message: "All notifications marked as read" });
    } catch (err) {
      next(err);
    }
  }

  async deleteNotification(req: AddedRequest, res: Response, next: NextFunction) {
    try {
      const { notificationId } = req.params;
      const userId = req.user?.id;
      if (!userId) {
        return res.status(HttpStatus.UNAUTHORIZED).json({ error: "Unauthorized" });
      }
      await this.notificationService.deleteNotification(notificationId);
      res.status(HttpStatus.OK).json({ message: "Notification deleted" });
    } catch (err) {
      next(err);
    }
  }
}