"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LikeRepository = void 0;
const base_repository_1 = require("./base.repository");
const Like_model_1 = require("../models/Like.model");
class LikeRepository extends base_repository_1.BaseRepository {
    constructor(model = Like_model_1.LikeModel) {
        super(model);
    }
    async countLikes(postId) {
        return this.model.countDocuments({ postId });
    }
}
exports.LikeRepository = LikeRepository;
//# sourceMappingURL=Like.repository.js.map