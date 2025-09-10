"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserFileRepository = void 0;
const base_repository_1 = require("./base.repository");
const UserFile_model_1 = require("../models/UserFile.model");
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
}
exports.UserFileRepository = UserFileRepository;
//# sourceMappingURL=UserFile.repository.js.map