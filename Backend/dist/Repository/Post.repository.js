"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostRepository = void 0;
const base_repository_1 = require("./base.repository");
const Post_model_1 = require("../models/Post.model");
class PostRepository extends base_repository_1.BaseRepository {
    constructor(model = Post_model_1.PostModel) {
        super(model);
    }
    async getFeedForUser(userId, followingIds, limit = 20, cursor) {
        const filter = {
        // authorId: { $in: [userId, ...followingIds] },
        };
        if (cursor) {
            filter.createdAt = { $lt: cursor };
        }
        return this.model
            .find(filter)
            .sort({ createdAt: -1 })
            .limit(limit);
    }
    async countPosts(userId) {
        return await this.model.countDocuments({ authorId: userId });
    }
}
exports.PostRepository = PostRepository;
//# sourceMappingURL=Post.repository.js.map