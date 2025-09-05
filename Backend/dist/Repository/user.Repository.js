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
import { UserModel } from "../models/user.model";
import { createHttpError } from "../utils";
import { HttpStatus } from "../constants/status.constant";
import { HttpResponse } from "../constants/response-message.constant";
import { Types } from "mongoose";
export class UserRepository extends BaseRepository {
    constructor() {
        super(UserModel);
    }
    createUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Creating user:", user);
            const createdUser = yield this.model.create(user);
            return createdUser;
        });
    }
    blockOrUnblockUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.findById(new Types.ObjectId(id));
            console.log(user);
            if (!user) {
                throw createHttpError(HttpStatus.NOT_FOUND, "User not found");
            }
            const updated = yield this.model.findByIdAndUpdate(id, {
                $set: {
                    isBlocked: !user.isBlocked, // Flip the actual value
                },
            }, { new: true });
            if (!updated) {
                throw createHttpError(HttpStatus.NO_CONTENT, HttpResponse.FAILED_TO_UPDATE_USER_STATUS);
            }
            console.log("updated", updated);
            return { success: true, message: "User status updated scuccessfully" };
        });
    }
    isBlocked(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.model.findById(id);
            if (user && user.isBlocked) {
                return true;
            }
            else {
                return false;
            }
        });
    }
    getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield UserModel.findById(id);
        });
    }
    updateTokenVersion(userId, newVersion) {
        return __awaiter(this, void 0, void 0, function* () {
            yield UserModel.findByIdAndUpdate(userId, { tokenVersion: newVersion });
        });
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.findOne({ email });
        });
    }
    findByIdWithPersonalization(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.findById(id).populate("personalization");
        });
    }
    updatePassword(email, hashedPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model
                .findOneAndUpdate({ email }, { password: hashedPassword }, { new: true })
                .populate("personalization");
        });
    }
    updatePersonalizationsId(userId, personalizationId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.update(userId, { personalizationId });
        });
    }
    getAllClientFilter(page, limit, statusFilter, searchTerm) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const skip = (page - 1) * limit;
            searchTerm = (searchTerm === null || searchTerm === void 0 ? void 0 : searchTerm.trim()) || "";
            console.log(statusFilter);
            const matchStatus = statusFilter === "all" ? {} : { "personalization.data.planStatus": statusFilter };
            const pipeline = [
                {
                    $match: Object.assign({ role: "client" }, (searchTerm && { name: { $regex: searchTerm, $options: "i" } })),
                },
                {
                    $lookup: {
                        from: "personalizations",
                        localField: "personalizationId",
                        foreignField: "_id",
                        as: "personalization",
                    },
                },
                { $unwind: { path: "$personalization", preserveNullAndEmptyArrays: true } },
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
                    $match: Object.assign({}, matchStatus),
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
                                    profilePicture: { $arrayElemAt: ["$profilePictureDoc.filePath", 0] },
                                    trainer: { $arrayElemAt: ["$trainers.name", 0] },
                                    sessionStatus: { $arrayElemAt: ["$sessions.status", 0] },
                                },
                            },
                        ],
                        totalCount: [{ $count: "count" }],
                    },
                },
            ];
            const result = yield this.model.aggregate(pipeline);
            const data = ((_a = result[0]) === null || _a === void 0 ? void 0 : _a.data) || [];
            const totalCount = ((_c = (_b = result[0]) === null || _b === void 0 ? void 0 : _b.totalCount[0]) === null || _c === void 0 ? void 0 : _c.count) || 0;
            return { data, totalCount };
        });
    }
}
//# sourceMappingURL=user.Repository.js.map