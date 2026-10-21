"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationRepository = void 0;
const base_repository_1 = require("../Repository/base.repository");
const Notification_model_1 = require("../models/Notification.model");
class NotificationRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(Notification_model_1.NotificationModel);
    }
    async findLastFiveByUser(userId) {
        return this.model
            .find({
            $or: [
                { recipientId: userId }
            ],
        })
            .sort({ createdAt: -1 }) // 🔥 Newest first
            .limit(5);
    }
    async findByUser(userId, page, limit, search, type, sort) {
        const query = {
            $or: [
                { recipientId: userId },
            ],
        };
        if (search) {
            query.message = { $regex: search, $options: "i" };
        }
        if (type) {
            if (type === "unread") {
                query.read = false;
            }
            else if (type === "read") {
                query.read = true;
            }
            else {
                query.type = type;
            }
        }
        const sortOption = sort === "newest" ? { createdAt: -1 } : { createdAt: 1 };
        let queryBuilder = this.model.find(query).sort(sortOption);
        const total = await this.model.countDocuments(query);
        if (page && limit) {
            queryBuilder = queryBuilder.skip((page - 1) * limit).limit(limit);
        }
        const result = await queryBuilder;
        return { notifications: result, total: total };
    }
    async getBasicDetails(userId) {
        const total = await this.model.countDocuments({
            $or: [
                { recipientId: userId },
            ],
        });
        const read = await this.model.countDocuments({
            $or: [
                { recipientId: userId },
            ],
            read: true,
        });
        return { total, read };
    }
    async markAsRead(notificationId) {
        return this.model.findByIdAndUpdate(notificationId, { read: true }, { new: true });
    }
    async markAllAsRead(userId) {
        await this.model.updateMany({ recipientId: userId, read: false }, { read: true });
    }
}
exports.NotificationRepository = NotificationRepository;
//# sourceMappingURL=Notification.repository.js.map