"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentModel = void 0;
const mongoose_1 = require("mongoose");
const commentSchema = new mongoose_1.Schema({
    postId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Post", required: true, index: true },
    authorId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    content: { type: String, required: true, trim: true, maxlength: 1000 },
    parentCommentId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Comment", default: null },
}, { timestamps: true });
commentSchema.index({ postId: 1, createdAt: -1 });
exports.CommentModel = (0, mongoose_1.model)("Comment", commentSchema);
//# sourceMappingURL=Comment.model.js.map