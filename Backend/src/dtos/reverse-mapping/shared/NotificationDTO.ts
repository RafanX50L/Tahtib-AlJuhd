import { ValidationUtil } from "@/utils/validation.util";

/**
 * Request DTOs for Notification Controller
 * Input validation and transformation for notification endpoints
 */

// Get Notifications Request DTO
export interface GetNotificationsRequestDTO {
  page: number;
  limit: number;
  search?: string;
  type?: string;
  sort?: string;
}

// Mark As Read Request DTO
export interface MarkAsReadRequestDTO {
  notificationId: string;
}

// Delete Notification Request DTO
export interface DeleteNotificationRequestDTO {
  notificationId: string;
}

/**
 * Notification DTO class for input validation
 * Handles validation and transformation of notification-related requests
 */
export class NotificationDTO {
  /**
   * Validates and transforms get notifications request
   */
  static validateGetNotificationsRequest(query: Record<string, unknown>): GetNotificationsRequestDTO {
    const page = query.page 
      ? ValidationUtil.validateRange(query.page, 'page', 1, 1000)
      : 1;
      
    const limit = query.limit 
      ? ValidationUtil.validateRange(query.limit, 'limit', 1, 100)
      : 10;
      
    const search = query.search ? ValidationUtil.validateString(query.search, 'search', 100) : undefined;
    const type = query.type ? ValidationUtil.validateString(query.type, 'type', 50) : undefined;
    const sort = query.sort ? ValidationUtil.validateString(query.sort, 'sort', 50) : undefined;

    return {
      page,
      limit,
      search,
      type,
      sort,
    };
  }

  /**
   * Validates and transforms mark as read request
   */
  static validateMarkAsReadRequest(params: Record<string, unknown>): MarkAsReadRequestDTO {
    const notificationId = ValidationUtil.validateString(params.notificationId, 'notificationId', 50);

    return {
      notificationId,
    };
  }

  /**
   * Validates and transforms delete notification request
   */
  static validateDeleteNotificationRequest(params: Record<string, unknown>): DeleteNotificationRequestDTO {
    const notificationId = ValidationUtil.validateString(params.notificationId, 'notificationId', 50);

    return {
      notificationId,
    };
  }
}
