import { Response, NextFunction } from "express";
import { AddedRequest } from "@/middleware/verify.token.middleware";
import { INotificationService } from "@/core/interface/services/shared/INotification.Service";
import { INotificationController } from "@/core/interface/controllers/shared/INotification.Controller";
import { 
  NotificationDTO,
  GetNotificationsRequestDTO,
  MarkAsReadRequestDTO,
  DeleteNotificationRequestDTO
} from '@/dtos/reverse-mapping/shared/NotificationDTO';
import { ControllerErrorHandler } from '@/utils/controller-error-handler.util';

export class NotificationController implements INotificationController{
  constructor(private readonly notificationService: INotificationService) {}

  async getNotifications(req: AddedRequest, res: Response, next: NextFunction){
    try {
      const userId = req.user?.id;
      if (!userId) {
        ControllerErrorHandler.handleError(new Error("Unauthorized"), res, next);
        return;
      }
      
      // Validate and transform request query using DTO
      const validatedQuery: GetNotificationsRequestDTO = NotificationDTO.validateGetNotificationsRequest(req.query);
      
      const notifications = await this.notificationService.getNotificationsForUser({
        userId,
        page: validatedQuery.page,
        limit: validatedQuery.limit,
        search: validatedQuery.search,
        type: validatedQuery.type,
        sort: validatedQuery.sort,
      });
      
      ControllerErrorHandler.handleSuccess(res, notifications, "Notifications retrieved successfully");
    } catch (err) {
      ControllerErrorHandler.handleError(err, res, next);
    }
  }

  async getBasicDetails( req: AddedRequest, res: Response, next: NextFunction){
    try {
      const userId = req.user?.id;
      if (!userId) {
        ControllerErrorHandler.handleError(new Error("Unauthorized"), res, next);
        return;
      }
      
      const basicDetails = await this.notificationService.getBasicDetails(userId);
      
      ControllerErrorHandler.handleSuccess(res, basicDetails, "Basic details retrieved successfully");
    } catch (error) {
      ControllerErrorHandler.handleError(error, res, next);
    }
  }

  async getLastFiveNotifications(req: AddedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        ControllerErrorHandler.handleError(new Error("Unauthorized"), res, next);
        return;
      }
      
      const notifications = await this.notificationService.getLastFiveNotification(userId);
      
      ControllerErrorHandler.handleSuccess(res, notifications, "Last five notifications retrieved successfully");
    } catch (err) {
      ControllerErrorHandler.handleError(err, res, next);
    }
  }

  async markAsRead(req: AddedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        ControllerErrorHandler.handleError(new Error("Unauthorized"), res, next);
        return;
      }
      
      // Validate and transform request parameters using DTO
      const validatedParams: MarkAsReadRequestDTO = NotificationDTO.validateMarkAsReadRequest(req.params);
      
      const notification = await this.notificationService.markNotificationAsRead(validatedParams.notificationId);
      
      if (!notification) {
        ControllerErrorHandler.handleNotFound(res, "Notification not found");
        return;
      }
      
      ControllerErrorHandler.handleSuccess(res, notification, "Notification marked as read successfully");
    } catch (err) {
      ControllerErrorHandler.handleError(err, res, next);
    }
  }

  async markAllAsRead(req: AddedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        ControllerErrorHandler.handleError(new Error("Unauthorized"), res, next);
        return;
      }
      
      await this.notificationService.markAllAsRead(userId);
      
      ControllerErrorHandler.handleSuccess(res, null, "All notifications marked as read");
    } catch (err) {
      ControllerErrorHandler.handleError(err, res, next);
    }
  }

  async deleteNotification(req: AddedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        ControllerErrorHandler.handleError(new Error("Unauthorized"), res, next);
        return;
      }
      
      // Validate and transform request parameters using DTO
      const validatedParams: DeleteNotificationRequestDTO = NotificationDTO.validateDeleteNotificationRequest(req.params);
      
      await this.notificationService.deleteNotification(validatedParams.notificationId);
      
      ControllerErrorHandler.handleSuccess(res, null, "Notification deleted successfully");
    } catch (err) {
      ControllerErrorHandler.handleError(err, res, next);
    }
  }
}