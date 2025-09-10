"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashPassword = hashPassword;
exports.comparePassword = comparePassword;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
async function hashPassword(value) {
    const salt = 10;
    return await bcryptjs_1.default.hash(value, salt);
}
async function comparePassword(password, hashedPassword) {
    return await bcryptjs_1.default.compare(password, hashedPassword);
}
//# sourceMappingURL=bcrypt.util.js.map