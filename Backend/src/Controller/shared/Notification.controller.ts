import { Response, NextFunction } from "express";
import { AddedRequest } from "@/middleware/verify.token.middleware";
import { HttpStatus } from "@/constants/status.constant";
import { INotificationService } from "@/core/interface/services/shared/INotification.Service";
import { INotificationController } from "@/core/interface/controllers/shared/INotification.Controller";

export class NotificationController implements INotificationController{
  constructor(private readonly notificationService: INotificationService) {}

  async getNotifications(req: AddedRequest, res: Response, next: NextFunction){
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(HttpStatus.UNAUTHORIZED).json({ error: "Unauthorized" });
        return;
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
        res.status(HttpStatus.UNAUTHORIZED).json({ error: "Unauthorized" });
        return;
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
        res.status(HttpStatus.UNAUTHORIZED).json({ error: "Unauthorized" });
        return;
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
        res.status(HttpStatus.UNAUTHORIZED).json({ error: "Unauthorized" });
        return;
      }
      const notification = await this.notificationService.markNotificationAsRead(notificationId);
      if (!notification) {
        res.status(HttpStatus.NOT_FOUND).json({ error: "Notification not found" });
        return;
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
        res.status(HttpStatus.UNAUTHORIZED).json({ error: "Unauthorized" });
        return;
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
        res.status(HttpStatus.UNAUTHORIZED).json({ error: "Unauthorized" });
        return;
      }
      await this.notificationService.deleteNotification(notificationId);
      res.status(HttpStatus.OK).json({ message: "Notification deleted" });
    } catch (err) {
      next(err);
    }
  }
}