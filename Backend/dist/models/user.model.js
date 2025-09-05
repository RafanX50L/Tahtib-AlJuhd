var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Schema, model } from "mongoose";
import { hashPassword } from "../utils/bcrypt.util";
const userSchema = new Schema({
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
        type: Schema.Types.ObjectId,
        ref: "Personalization",
        default: null,
    },
    isBlocked: { type: Boolean, default: false },
    tokenVersion: { type: Number, default: 0 },
}, { timestamps: true });
// Hash password before saving
userSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (this.isModified("password") && this.password) {
            this.password = yield hashPassword(this.password);
        }
        next();
    });
});
// Indexes
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
export const UserModel = model("User", userSchema);
//# sourceMappingURL=user.model.js.map