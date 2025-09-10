"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const base_repository_1 = require("../Repository/base.repository");
const user_model_1 = require("../models/user.model");
const utils_1 = require("../utils");
const status_constant_1 = require("../constants/status.constant");
const response_message_constant_1 = require("../constants/response-message.constant");
const mongoose_1 = require("mongoose");
class UserRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(user_model_1.UserModel);
    }
    async createUser(user) {
        console.log("Creating user:", user);
        const createdUser = await this.model.create(user);
        return createdUser;
    }
    async blockOrUnblockUser(id) {
        const user = await this.findById(new mongoose_1.Types.ObjectId(id));
        console.log(user);
        if (!user) {
            throw (0, utils_1.createHttpError)(status_constant_1.HttpStatus.NOT_FOUND, "User not found");
        }
        const updated = await this.model.findByIdAndUpdate(id, {
            $set: {
                isBlocked: !user.isBlocked, // Flip the actual value
            },
        }, { new: true });
        if (!updated) {
            throw (0, utils_1.createHttpError)(status_constant_1.HttpStatus.NO_CONTENT, response_message_constant_1.HttpResponse.FAILED_TO_UPDATE_USER_STATUS);
        }
        console.log("updated", updated);
        return { success: true, message: "User status updated scuccessfully" };
    }
    async isBlocked(id) {
        const user = await this.model.findById(id);
        if (user && user.isBlocked) {
            return true;
        }
        else {
            return false;
        }
    }
    async getUserById(id) {
        return await user_model_1.UserModel.findById(id);
    }
    async updateTokenVersion(userId, newVersion) {
        await user_model_1.UserModel.findByIdAndUpdate(userId, { tokenVersion: newVersion });
    }
    async findByEmail(email) {
        return await this.model.findOne({ email });
    }
    async findByIdWithPersonalization(id) {
        return await this.model.findById(id).populate("personalization");
    }
    async updatePassword(email, hashedPassword) {
        return await this.model
            .findOneAndUpdate({ email }, { password: hashedPassword }, { new: true })
            .populate("personalization");
    }
    async updatePersonalizationsId(userId, personalizationId) {
        return await this.update(userId, { personalizationId });
    }
    async getAllClientFilter(page, limit, statusFilter, searchTerm) {
        const skip = (page - 1) * limit;
        searchTerm = searchTerm?.trim() || "";
        console.log(statusFilter);
        const matchStatus = statusFilter === "all"
            ? {}
            : { "personalization.data.planStatus": statusFilter };
        const pipeline = [
            {
                $match: {
                    role: "client",
                    ...(searchTerm && { name: { $regex: searchTerm, $options: "i" } }),
                },
            },
            {
                $lookup: {
                    from: "personalizations",
                    localField: "personalizationId",
                    foreignField: "_id",
                    as: "personalization",
                },
            },
            {
                $unwind: { path: "$personalization", preserveNullAndEmptyArrays: true },
            },
            {
                $lookup: {
                    from: "userfiles",
                    localField: "personalization.data.userData.profilePictureId",
                    foreignField: "_id",
                    as: "profilePictureDoc",
                },
            },
            {
                $lookup: {
                    from: "sessions",
                    localField: "personalization.data.sessionsId",
                    foreignField: "_id",
                    as: "sessions",
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "sessions.trainerId",
                    foreignField: "_id",
                    as: "trainers",
                },
            },
            {
                $match: {
                    ...matchStatus,
                },
            },
            {
                $facet: {
                    data: [
                        { $skip: skip },
                        { $limit: limit },
                        {
                            $project: {
                                _id: 1,
                                name: 1,
                                email: 1,
                                isBlocked: 1,
                                role: 1,
                                createdAt: 1,
                                planStatus: "$personalization.data.planStatus",
                                profilePicture: {
                                    $arrayElemAt: ["$profilePictureDoc.filePath", 0],
                                },
                                trainer: { $arrayElemAt: ["$trainers.name", 0] },
                                sessionStatus: { $arrayElemAt: ["$sessions.status", 0] },
                            },
                        },
                    ],
                    totalCount: [{ $count: "count" }],
                },
            },
        ];
        const result = await this.model.aggregate(pipeline);
        const data = result[0]?.data || [];
        const totalCount = result[0]?.totalCount[0]?.count || 0;
        return { data, totalCount };
    }
    async searchForUsers(filter) {
        return await this.model
            .find(filter, { _id: 1, name: 1, role: 1 })
            .sort({ _id: -1 })
            .limit(20);
    }
}
exports.UserRepository = UserRepository;
//# sourceMappingURL=user.Repository.js.map