"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Notification_controller_1 = require("../../Controller/shared/Notification.controller");
const isBlocked_middleware_1 = __importDefault(require("../../middleware/isBlocked.middleware"));
const verify_token_middleware_1 = require("../../middleware/verify.token.middleware");
const Notification_repository_1 = require("../../Repository/Notification.repository");
const Notification_service_1 = require("../../Services/shared/Notification.service");
const express_1 = require("express");
const router = (0, express_1.Router)();
const notificationRepo = new Notification_repository_1.NotificationRepository();
const notificationService = new Notification_service_1.NotificationService(notificationRepo);
const notificationController = new Notification_controller_1.NotificationController(notificationService);
router.use("/", (0, verify_token_middleware_1.verifyAnyToken)(), (0, isBlocked_middleware_1.default)());
router.get("/", notificationController.getNotifications.bind(notificationController));
router.get("/base-details", notificationController.getBasicDetails.bind(notificationController));
router.get("/last-five", notificationController.getLastFiveNotifications.bind(notificationController));
router.patch("/:notificationId/read", notificationController.markAsRead.bind(notificationController));
router.delete("/:notificationId", notificationController.deleteNotification.bind(notificationController));
router.patch("/mark-all-read", notificationController.markAllAsRead.bind(notificationController));
exports.default = router;
//# sourceMappingURL=notification.routes.js.map