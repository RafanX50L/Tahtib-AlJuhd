import { NotificationController } from "@/Controller/shared/Notification.controller";
import isBlocked from "@/middleware/isBlocked.middleware";
import { verifyAnyToken } from "@/middleware/verify.token.middleware";
import { NotificationRepository } from "@/Repository/Notification.repository";
import { NotificationService } from "@/Services/shared/Notification.service";
import { Router } from "express";

const router = Router();

const notificationRepo = new NotificationRepository();
const notificationService = new NotificationService(notificationRepo);
const notificationController = new NotificationController(notificationService);

router.use("/", verifyAnyToken(), isBlocked());

router.get(
  "/",
  notificationController.getNotifications.bind(notificationController)
);
router.get(
  "/base-details",
  notificationController.getBasicDetails.bind(notificationController)
);
router.get(
  "/last-five",
  notificationController.getLastFiveNotifications.bind(notificationController)
);
router.patch(
  "/:notificationId/read",
  notificationController.markAsRead.bind(notificationController)
);
router.delete(
  "/:notificationId",
  notificationController.deleteNotification.bind(notificationController)
);
router.patch(
  "/mark-all-read",
  notificationController.markAllAsRead.bind(notificationController)
);

export default router;
