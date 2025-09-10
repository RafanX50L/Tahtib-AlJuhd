"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LikeModel = void 0;
const mongoose_1 = require("mongoose");
const likeSchema = new mongoose_1.Schema({
    postId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Post", required: true, index: true },
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true, index: true },
}, { timestamps: { createdAt: true, updatedAt: false } });
likeSchema.index({ postId: 1, userId: 1 }, { unique: true });
exports.LikeModel = (0, mongoose_1.model)("Like", likeSchema);
//# sourceMappingURL=Like.model.js.map