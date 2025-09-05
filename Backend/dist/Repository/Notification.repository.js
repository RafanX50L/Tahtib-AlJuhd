var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { BaseRepository } from "../Repository/base.repository";
import { NotificationModel } from "../models/Notification.model";
export class NotificationRepository extends BaseRepository {
    constructor() {
        super(NotificationModel);
    }
    findLastFiveByUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model
                .find({
                $or: [
                    { recipientId: userId }
                ],
            })
                .sort({ createdAt: -1 }) // 🔥 Newest first
                .limit(5);
        });
    }
    findByUser(userId, page, limit, search, type, sort) {
        return __awaiter(this, void 0, void 0, function* () {
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
            const total = yield this.model.countDocuments(query);
            if (page && limit) {
                queryBuilder = queryBuilder.skip((page - 1) * limit).limit(limit);
            }
            const result = yield queryBuilder;
            return { notifications: result, total: total };
        });
    }
    getBasicDetails(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const total = yield this.model.countDocuments({
                $or: [
                    { recipientId: userId },
                ],
            });
            const read = yield this.model.countDocuments({
                $or: [
                    { recipientId: userId },
                ],
                read: true,
            });
            return { total, read };
        });
    }
    markAsRead(notificationId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.findByIdAndUpdate(notificationId, { read: true }, { new: true });
        });
    }
    markAllAsRead(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.model.updateMany({ recipientId: userId, read: false }, { read: true });
        });
    }
}
//# sourceMappingURL=Notification.repository.js.map