"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const utils_1 = require("../../utils");
const redis_config_1 = require("../../config/redis.config");
const http_error_util_1 = require("../../utils/http-error.util");
const status_constant_1 = require("../../constants/status.constant");
const response_message_constant_1 = require("../../constants/response-message.constant");
const generate_nanoid_1 = require("../../utils/generate-nanoid");
const mongoose_1 = __importDefault(require("mongoose"));
const UserDTO_1 = require("../../dtos/auth/UserDTO");
class AuthService {
    _userRepository;
    constructor(_userRepository) {
        this._userRepository = _userRepository;
    }
    async signUp(user) {
        const existingUser = await this._userRepository.findByEmail(user.email);
        if (existingUser) {
            throw (0, http_error_util_1.createHttpError)(status_constant_1.HttpStatus.CONFLICT, response_message_constant_1.HttpResponse.USER_EXIST);
        }
        const otp = (0, utils_1.generateOTP)();
        console.log("Generated OTP:", otp);
        await (0, utils_1.sendOtpEmail)(user.email, otp);
        const response = await redis_config_1.redisClient.setEx(user.email, 300, JSON.stringify({ ...user, otp }));
        if (!response) {
            throw (0, http_error_util_1.createHttpError)(status_constant_1.HttpStatus.INTERNAL_SERVER_ERROR, "Error saving OTP to Redis");
        }
        console.log("OTP sent to email:", user.email);
        return user.email;
    }
    async signIn(email, password) {
        const existingUser = await this._userRepository.findByEmail(email);
        if (!existingUser) {
            throw (0, http_error_util_1.createHttpError)(status_constant_1.HttpStatus.NOT_FOUND, response_message_constant_1.HttpResponse.USER_NOT_FOUND);
        }
        if (!existingUser.password ||
            !(await (0, utils_1.comparePassword)(password, existingUser.password))) {
            throw (0, http_error_util_1.createHttpError)(status_constant_1.HttpStatus.FORBIDDEN, response_message_constant_1.HttpResponse.INVALID_PASSWORD);
        }
        if (existingUser.isBlocked) {
            throw (0, http_error_util_1.createHttpError)(status_constant_1.HttpStatus.UNAUTHORIZED, response_message_constant_1.HttpResponse.USER_IS_BLOKED);
        }
        const payload = {
            id: existingUser._id.toString(),
            role: existingUser.role,
            tokenVersion: existingUser.tokenVersion,
        };
        const accessToken = (0, utils_1.generateAccessToken)(payload);
        const refreshToken = (0, utils_1.generateRefreshToken)(payload);
        const userData = await UserDTO_1.UserDTO.toResponse(existingUser);
        return {
            user: userData,
            accessToken,
            refreshToken,
            tokenVersion: existingUser.tokenVersion,
        };
    }
    async verifyOtp(email, otp) {
        const storedDataString = await redis_config_1.redisClient.get(email);
        if (!storedDataString) {
            throw (0, http_error_util_1.createHttpError)(status_constant_1.HttpStatus.NOT_FOUND, response_message_constant_1.HttpResponse.OTP_NOT_FOUND);
        }
        const storedData = JSON.parse(storedDataString);
        if (storedData.otp !== otp) {
            throw (0, http_error_util_1.createHttpError)(status_constant_1.HttpStatus.BAD_REQUEST, response_message_constant_1.HttpResponse.OTP_INCORRECT);
        }
        const name = storedData.email.split("@")[0].replace(/[^a-zA-Z0-9]/g, "_");
        const user = {
            name,
            email: storedData.email,
            password: storedData.password,
            role: storedData.role,
        };
        const createdUser = await this._userRepository.createUser(user);
        if (!createdUser) {
            throw (0, http_error_util_1.createHttpError)(status_constant_1.HttpStatus.CONFLICT, response_message_constant_1.HttpResponse.USER_CREATION_FAILED);
        }
        await redis_config_1.redisClient.del(email);
        const payload = { id: createdUser._id.toString(), role: createdUser.role };
        const accessToken = (0, utils_1.generateAccessToken)(payload);
        const refreshToken = (0, utils_1.generateRefreshToken)(payload);
        const userData = await UserDTO_1.UserDTO.toResponse(createdUser);
        return {
            user: userData,
            tokenVersion: createdUser.tokenVersion,
            accessToken,
            refreshToken,
        };
    }
    async resendOtp(email) {
        const storedDataString = await redis_config_1.redisClient.get(email);
        if (!storedDataString) {
            throw (0, http_error_util_1.createHttpError)(status_constant_1.HttpStatus.NOT_FOUND, response_message_constant_1.HttpResponse.OTP_NOT_FOUND);
        }
        const storedData = JSON.parse(storedDataString);
        const otp = (0, utils_1.generateOTP)();
        console.log("Resending OTP:", otp);
        await (0, utils_1.sendOtpEmail)(email, otp);
        await redis_config_1.redisClient.setEx(email, 300, JSON.stringify({ ...storedData, otp }));
        return email;
    }
    async forgotPassword(email) {
        const existingUser = await this._userRepository.findByEmail(email);
        if (!existingUser) {
            throw (0, http_error_util_1.createHttpError)(status_constant_1.HttpStatus.NOT_FOUND, response_message_constant_1.HttpResponse.USER_NOT_FOUND);
        }
        const token = (0, generate_nanoid_1.generateNanoId)();
        const storedOnRedis = await redis_config_1.redisClient.setEx(token, 300, email);
        if (!storedOnRedis) {
            throw (0, http_error_util_1.createHttpError)(status_constant_1.HttpStatus.INTERNAL_SERVER_ERROR, response_message_constant_1.HttpResponse.SERVER_ERROR);
        }
        await (0, utils_1.sendPasswordResetEmail)(email, token);
        return {
            status: status_constant_1.HttpStatus.OK,
            message: response_message_constant_1.HttpResponse.EMAIL_SENT_SUCCESS,
        };
    }
    async resetPassword(token, password) {
        const getEmail = await redis_config_1.redisClient.get(token);
        if (!getEmail) {
            throw (0, http_error_util_1.createHttpError)(status_constant_1.HttpStatus.NOT_FOUND, response_message_constant_1.HttpResponse.TOKEN_EXPIRED);
        }
        const hashedPassword = await (0, utils_1.hashPassword)(password);
        const updatedUser = await this._userRepository.updatePassword(getEmail, hashedPassword);
        if (!updatedUser) {
            throw (0, http_error_util_1.createHttpError)(status_constant_1.HttpStatus.INTERNAL_SERVER_ERROR, response_message_constant_1.HttpResponse.SERVER_ERROR);
        }
        await redis_config_1.redisClient.del(token);
        return {
            status: status_constant_1.HttpStatus.OK,
            message: response_message_constant_1.HttpResponse.PASSWORD_RESET_SUCCESS,
        };
    }
    async googleSignUp(email, name, role) {
        const existingUser = await this._userRepository.findByEmail(email);
        if (!existingUser) {
            if (!role) {
                throw (0, http_error_util_1.createHttpError)(status_constant_1.HttpStatus.BAD_REQUEST, "User does not exist, please register first");
            }
            const user = {
                name,
                email,
                role,
            };
            const createdUser = await this._userRepository.createUser(user);
            if (!createdUser) {
                throw (0, http_error_util_1.createHttpError)(status_constant_1.HttpStatus.INTERNAL_SERVER_ERROR, response_message_constant_1.HttpResponse.USER_CREATION_FAILED);
            }
            const payload = { id: createdUser._id.toString(), role: createdUser.role };
            const accessToken = (0, utils_1.generateAccessToken)(payload);
            const refreshToken = (0, utils_1.generateRefreshToken)(payload);
            const userData = await UserDTO_1.UserDTO.toResponse(createdUser);
            return {
                user: userData,
                tokenVersion: createdUser.tokenVersion,
                accessToken,
                refreshToken,
            };
        }
        else if (existingUser.password) {
            throw (0, http_error_util_1.createHttpError)(status_constant_1.HttpStatus.UNAUTHORIZED, response_message_constant_1.HttpResponse.USER_ALREADY_EXIST_WITH_PASSWORD);
        }
        else {
            if (existingUser.isBlocked) {
                throw (0, http_error_util_1.createHttpError)(status_constant_1.HttpStatus.UNAUTHORIZED, response_message_constant_1.HttpResponse.USER_IS_BLOKED);
            }
            const payload = { id: existingUser._id.toString(), role: existingUser.role };
            const accessToken = (0, utils_1.generateAccessToken)(payload);
            const refreshToken = (0, utils_1.generateRefreshToken)(payload);
            const userData = await UserDTO_1.UserDTO.toResponse(existingUser);
            return {
                user: userData,
                tokenVersion: existingUser.tokenVersion,
                accessToken,
                refreshToken,
            };
        }
    }
    async getUserData(id) {
        const objectId = new mongoose_1.default.Types.ObjectId(id);
        const user = await this._userRepository.findById(objectId);
        if (!user) {
            throw (0, http_error_util_1.createHttpError)(status_constant_1.HttpStatus.NOT_FOUND, response_message_constant_1.HttpResponse.USER_NOT_FOUND);
        }
        const userData = await UserDTO_1.UserDTO.toResponse(user);
        return {
            user: {
                _id: userData._id,
                name: userData.name,
                email: userData.email,
                role: userData.role,
            },
            tokenVersion: user.tokenVersion,
        };
    }
    async refreshAccessToken(refreshToken) {
        if (!refreshToken) {
            throw new Error("Refresh token is required");
        }
        const decoded = (0, utils_1.verifyRefreshToken)(refreshToken);
        if (!decoded ||
            typeof decoded !== "object" ||
            !("id" in decoded) ||
            !("role" in decoded) ||
            !("tokenVersion" in decoded)) {
            throw (0, http_error_util_1.createHttpError)(status_constant_1.HttpStatus.FORBIDDEN, "Invalid refresh token");
        }
        const { id, role, tokenVersion } = decoded;
        const user = await this._userRepository.getUserById(id);
        if (!user) {
            throw (0, http_error_util_1.createHttpError)(status_constant_1.HttpStatus.NOT_FOUND, "User not found");
        }
        if (user.isBlocked) {
            throw (0, http_error_util_1.createHttpError)(status_constant_1.HttpStatus.UNAUTHORIZED, "User is blocked");
        }
        if (user.tokenVersion !== tokenVersion) {
            throw (0, http_error_util_1.createHttpError)(status_constant_1.HttpStatus.FORBIDDEN, "Invalid token version");
        }
        const newRefreshToken = (0, utils_1.generateRefreshToken)({
            id: user._id.toString(),
            role,
            tokenVersion: user.tokenVersion + 1,
        });
        await this._userRepository.updateTokenVersion(id, user.tokenVersion + 1);
        const payload = {
            id: user._id.toString(),
            role,
            tokenVersion: user.tokenVersion + 1,
        };
        const accessToken = (0, utils_1.generateAccessToken)(payload);
        const userData = await UserDTO_1.UserDTO.toResponse(user);
        return {
            accessToken,
            refreshToken: newRefreshToken,
            user: userData,
            tokenVersion: user.tokenVersion + 1,
        };
    }
    async updateTokenVersion(userId, newVersion) {
        await this._userRepository.updateTokenVersion(userId, newVersion);
    }
    async getUserById(id) {
        return await this._userRepository.getUserById(id);
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map