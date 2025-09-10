"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAccessToken = generateAccessToken;
exports.generateRefreshToken = generateRefreshToken;
exports.verifyAccessToken = verifyAccessToken;
exports.verifyRefreshToken = verifyRefreshToken;
exports.decodeAndVerifyToken = decodeAndVerifyToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_config_1 = require("../config/env.config");
const ACCESS_KEY = env_config_1.env.JWT_ACCESS_SECRET;
const REFRESH_KEY = env_config_1.env.JWT_REFRESH_SECRET;
const ACCESS_TOKEN_EXPIRY = "15m";
const REFRESH_TOKEN_EXPIRY = "7d";
function generateAccessToken(payload) {
    return jsonwebtoken_1.default.sign(payload, ACCESS_KEY, {
        expiresIn: ACCESS_TOKEN_EXPIRY,
        algorithm: 'HS256'
    });
}
function generateRefreshToken(payload) {
    return jsonwebtoken_1.default.sign(payload, REFRESH_KEY, {
        expiresIn: REFRESH_TOKEN_EXPIRY,
        algorithm: 'HS256'
    });
}
function verifyAccessToken(token) {
    try {
        const decode = jsonwebtoken_1.default.verify(token, ACCESS_KEY, { algorithms: ['HS256'] });
        console.log('Acess Data decoded', decode);
        return decode;
    }
    catch (err) {
        console.error("Access token verification failed:", err);
        return null;
    }
}
function verifyRefreshToken(token) {
    try {
        return jsonwebtoken_1.default.verify(token, REFRESH_KEY, { algorithms: ['HS256'] });
    }
    catch (err) {
        console.error("Refresh token verification failed:", err);
        return null;
    }
}
function decodeAndVerifyToken(token) {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, ACCESS_KEY, { algorithms: ['HS256'] });
        return typeof decoded === 'object' && decoded !== null ? decoded : null;
    }
    catch (err) {
        console.error("Token verification failed:", err);
        return null;
    }
}
//# sourceMappingURL=jwt.utils.js.map