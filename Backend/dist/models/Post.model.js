"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostModel = void 0;
const mongoose_1 = require("mongoose");
const mediaSchema = new mongoose_1.Schema({
    key: { type: String, required: true },
    type: { type: String, enum: ["image", "video"], required: true },
    mimeType: { type: String, required: true },
}, { _id: false });
const postSchema = new mongoose_1.Schema({
    authorId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    caption: { type: String, trim: true, maxlength: 2200 },
    media: { type: [mediaSchema], default: [] },
    likesCount: { type: Number, default: 0 },
    commentsCount: { type: Number, default: 0 },
    sharesCount: { type: Number, default: 0 },
}, { timestamps: true });
postSchema.index({ authorId: 1, createdAt: -1 });
exports.PostModel = (0, mongoose_1.model)("Post", postSchema);
//# sourceMappingURL=Post.model.js.map