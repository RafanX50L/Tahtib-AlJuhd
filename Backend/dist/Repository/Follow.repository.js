"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FollowRepository = void 0;
const base_repository_1 = require("./base.repository");
const Follow_model_1 = require("../models/Follow.model");
class FollowRepository extends base_repository_1.BaseRepository {
    constructor(model = Follow_model_1.FollowModel) {
        super(model);
    }
    async getFollowingIds(userId) {
        const docs = await this.model.find({ followerId: userId }, { followingId: 1, _id: 0 });
        return docs.map((d) => d.followingId);
    }
    async isFollowing(followerId, followingId) {
        const existing = await this.model.findOne({ followerId, followingId });
        return !!existing;
    }
    async countFollowers(profileUserId) {
        return await this.model.countDocuments({ followingId: profileUserId });
    }
    async countFollowing(profileUserId) {
        return await this.model.countDocuments({ followerId: profileUserId });
    }
}
exports.FollowRepository = FollowRepository;
//# sourceMappingURL=Follow.repository.js.map