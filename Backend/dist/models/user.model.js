"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const mongoose_1 = require("mongoose");
const bcrypt_util_1 = require("../utils/bcrypt.util");
const userSchema = new mongoose_1.Schema({
    name: { type: String, required: true, unique: true, trim: true },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ["client", "trainer", "admin"],
        default: "client",
    },
    calendlyLink: { type: String, default: null },
    personalizationId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Personalization",
        default: null,
    },
    isBlocked: { type: Boolean, default: false },
    tokenVersion: { type: Number, default: 0 },
}, { timestamps: true });
// Hash password before saving
userSchema.pre("save", async function (next) {
    if (this.isModified("password") && this.password) {
        this.password = await (0, bcrypt_util_1.hashPassword)(this.password);
    }
    next();
});
// Indexes
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
exports.UserModel = (0, mongoose_1.model)("User", userSchema);
//# sourceMappingURL=user.model.js.map