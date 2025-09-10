"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatModel = void 0;
const mongoose_1 = require("mongoose");
const ChatSchema = new mongoose_1.Schema({
    participants: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true }],
    messages: [{
            senderId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
            content: String,
            timestamp: { type: Date, default: Date.now },
        }],
}, { timestamps: true });
exports.ChatModel = (0, mongoose_1.model)('Chat', ChatSchema);
//# sourceMappingURL=Chat.model.js.map