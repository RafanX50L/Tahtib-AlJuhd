"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentRepository = void 0;
const base_repository_1 = require("./base.repository");
const Comment_model_1 = require("../models/Comment.model");
class CommentRepository extends base_repository_1.BaseRepository {
    constructor(model = Comment_model_1.CommentModel) {
        super(model);
    }
    async findByPost(postId, limit = 50, cursor) {
        const filter = { postId };
        if (cursor) {
            filter.createdAt = { $lt: cursor };
        }
        return this.model.find(filter).sort({ createdAt: -1 }).limit(limit);
    }
}
exports.CommentRepository = CommentRepository;
//# sourceMappingURL=Comment.repository.js.map