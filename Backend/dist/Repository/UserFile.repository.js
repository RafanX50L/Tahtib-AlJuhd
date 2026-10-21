"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserFileRepository = void 0;
const base_repository_1 = require("./base.repository");
const UserFile_model_1 = require("../models/UserFile.model");
const mongoose_1 = require("mongoose");
class UserFileRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(UserFile_model_1.UserFileModel);
    }
    async findLatestProfilePicture(userId) {
        return await this.model
            .findOne({
            userId: userId,
            purpose: "profilePhoto",
        })
            .sort({ createdAt: -1 });
    }
    async updateProfilePicture(userId, fileData) {
        return await this.model.findOneAndUpdate({ userId: new mongoose_1.Types.ObjectId(userId), purpose: "profilePhoto" }, { $set: fileData }, { upsert: true, new: true });
    }
}
exports.UserFileRepository = UserFileRepository;
//# sourceMappingURL=UserFile.repository.js.map