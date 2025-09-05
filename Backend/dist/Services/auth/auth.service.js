var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { comparePassword, generateAccessToken, generateOTP, generateRefreshToken, hashPassword, sendOtpEmail, sendPasswordResetEmail, verifyRefreshToken, } from "../../utils";
import { redisClient } from "../../config/redis.config";
import { createHttpError } from "../../utils/http-error.util";
import { HttpStatus } from "../../constants/status.constant";
import { HttpResponse } from "../../constants/response-message.constant";
import { generateNanoId } from "../../utils/generate-nanoid";
import mongoose from "mongoose";
import { UserDTO } from "../../dtos/auth/UserDTO";
export class AuthService {
    constructor(_userRepository) {
        this._userRepository = _userRepository;
    }
    signUp(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingUser = yield this._userRepository.findByEmail(user.email);
            if (existingUser) {
                throw createHttpError(HttpStatus.CONFLICT, HttpResponse.USER_EXIST);
            }
            const otp = generateOTP();
            console.log("Generated OTP:", otp);
            yield sendOtpEmail(user.email, otp);
            const response = yield redisClient.setEx(user.email, 300, JSON.stringify(Object.assign(Object.assign({}, user), { otp })));
            if (!response) {
                throw createHttpError(HttpStatus.INTERNAL_SERVER_ERROR, "Error saving OTP to Redis");
            }
            console.log("OTP sent to email:", user.email);
            return user.email;
        });
    }
    signIn(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingUser = yield this._userRepository.findByEmail(email);
            if (!existingUser) {
                throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.USER_NOT_FOUND);
            }
            if (!existingUser.password ||
                !(yield comparePassword(password, existingUser.password))) {
                throw createHttpError(HttpStatus.FORBIDDEN, HttpResponse.INVALID_PASSWORD);
            }
            if (existingUser.isBlocked) {
                throw createHttpError(HttpStatus.UNAUTHORIZED, HttpResponse.USER_IS_BLOKED);
            }
            const payload = {
                id: existingUser._id.toString(),
                role: existingUser.role,
                tokenVersion: existingUser.tokenVersion,
            };
            const accessToken = generateAccessToken(payload);
            const refreshToken = generateRefreshToken(payload);
            const userData = yield UserDTO.toResponse(existingUser);
            return {
                user: userData,
                accessToken,
                refreshToken,
                tokenVersion: existingUser.tokenVersion,
            };
        });
    }
    verifyOtp(email, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            const storedDataString = yield redisClient.get(email);
            if (!storedDataString) {
                throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.OTP_NOT_FOUND);
            }
            const storedData = JSON.parse(storedDataString);
            if (storedData.otp !== otp) {
                throw createHttpError(HttpStatus.BAD_REQUEST, HttpResponse.OTP_INCORRECT);
            }
            const name = storedData.email.split("@")[0].replace(/[^a-zA-Z0-9]/g, "_");
            const user = {
                name,
                email: storedData.email,
                password: storedData.password,
                role: storedData.role,
            };
            const createdUser = yield this._userRepository.createUser(user);
            if (!createdUser) {
                throw createHttpError(HttpStatus.CONFLICT, HttpResponse.USER_CREATION_FAILED);
            }
            yield redisClient.del(email);
            const payload = { id: createdUser._id.toString(), role: createdUser.role };
            const accessToken = generateAccessToken(payload);
            const refreshToken = generateRefreshToken(payload);
            const userData = yield UserDTO.toResponse(createdUser);
            return {
                user: userData,
                tokenVersion: createdUser.tokenVersion,
                accessToken,
                refreshToken,
            };
        });
    }
    resendOtp(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const storedDataString = yield redisClient.get(email);
            if (!storedDataString) {
                throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.OTP_NOT_FOUND);
            }
            const storedData = JSON.parse(storedDataString);
            const otp = generateOTP();
            console.log("Resending OTP:", otp);
            yield sendOtpEmail(email, otp);
            yield redisClient.setEx(email, 300, JSON.stringify(Object.assign(Object.assign({}, storedData), { otp })));
            return email;
        });
    }
    forgotPassword(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingUser = yield this._userRepository.findByEmail(email);
            if (!existingUser) {
                throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.USER_NOT_FOUND);
            }
            const token = generateNanoId();
            const storedOnRedis = yield redisClient.setEx(token, 300, email);
            if (!storedOnRedis) {
                throw createHttpError(HttpStatus.INTERNAL_SERVER_ERROR, HttpResponse.SERVER_ERROR);
            }
            yield sendPasswordResetEmail(email, token);
            return {
                status: HttpStatus.OK,
                message: HttpResponse.EMAIL_SENT_SUCCESS,
            };
        });
    }
    resetPassword(token, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const getEmail = yield redisClient.get(token);
            if (!getEmail) {
                throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.TOKEN_EXPIRED);
            }
            const hashedPassword = yield hashPassword(password);
            const updatedUser = yield this._userRepository.updatePassword(getEmail, hashedPassword);
            if (!updatedUser) {
                throw createHttpError(HttpStatus.INTERNAL_SERVER_ERROR, HttpResponse.SERVER_ERROR);
            }
            yield redisClient.del(token);
            return {
                status: HttpStatus.OK,
                message: HttpResponse.PASSWORD_RESET_SUCCESS,
            };
        });
    }
    googleSignUp(email, name, role) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingUser = yield this._userRepository.findByEmail(email);
            if (!existingUser) {
                if (!role) {
                    throw createHttpError(HttpStatus.BAD_REQUEST, "User does not exist, please register first");
                }
                const user = {
                    name,
                    email,
                    role,
                };
                const createdUser = yield this._userRepository.createUser(user);
                if (!createdUser) {
                    throw createHttpError(HttpStatus.INTERNAL_SERVER_ERROR, HttpResponse.USER_CREATION_FAILED);
                }
                const payload = { id: createdUser._id.toString(), role: createdUser.role };
                const accessToken = generateAccessToken(payload);
                const refreshToken = generateRefreshToken(payload);
                const userData = yield UserDTO.toResponse(createdUser);
                return {
                    user: userData,
                    tokenVersion: createdUser.tokenVersion,
                    accessToken,
                    refreshToken,
                };
            }
            else if (existingUser.password) {
                throw createHttpError(HttpStatus.UNAUTHORIZED, HttpResponse.USER_ALREADY_EXIST_WITH_PASSWORD);
            }
            else {
                if (existingUser.isBlocked) {
                    throw createHttpError(HttpStatus.UNAUTHORIZED, HttpResponse.USER_IS_BLOKED);
                }
                const payload = { id: existingUser._id.toString(), role: existingUser.role };
                const accessToken = generateAccessToken(payload);
                const refreshToken = generateRefreshToken(payload);
                const userData = yield UserDTO.toResponse(existingUser);
                return {
                    user: userData,
                    tokenVersion: existingUser.tokenVersion,
                    accessToken,
                    refreshToken,
                };
            }
        });
    }
    getUserData(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const objectId = new mongoose.Types.ObjectId(id);
            const user = yield this._userRepository.findById(objectId);
            if (!user) {
                throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.USER_NOT_FOUND);
            }
            const userData = yield UserDTO.toResponse(user);
            return {
                user: {
                    _id: userData._id,
                    name: userData.name,
                    email: userData.email,
                    role: userData.role,
                },
                tokenVersion: user.tokenVersion,
            };
        });
    }
    refreshAccessToken(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!refreshToken) {
                throw new Error("Refresh token is required");
            }
            const decoded = verifyRefreshToken(refreshToken);
            if (!decoded ||
                typeof decoded !== "object" ||
                !("id" in decoded) ||
                !("role" in decoded) ||
                !("tokenVersion" in decoded)) {
                throw createHttpError(HttpStatus.FORBIDDEN, "Invalid refresh token");
            }
            const { id, role, tokenVersion } = decoded;
            const user = yield this._userRepository.getUserById(id);
            if (!user) {
                throw createHttpError(HttpStatus.NOT_FOUND, "User not found");
            }
            if (user.isBlocked) {
                throw createHttpError(HttpStatus.UNAUTHORIZED, "User is blocked");
            }
            if (user.tokenVersion !== tokenVersion) {
                throw createHttpError(HttpStatus.FORBIDDEN, "Invalid token version");
            }
            const newRefreshToken = generateRefreshToken({
                id: user._id.toString(),
                role,
                tokenVersion: user.tokenVersion + 1,
            });
            yield this._userRepository.updateTokenVersion(id, user.tokenVersion + 1);
            const payload = {
                id: user._id.toString(),
                role,
                tokenVersion: user.tokenVersion + 1,
            };
            const accessToken = generateAccessToken(payload);
            const userData = yield UserDTO.toResponse(user);
            return {
                accessToken,
                refreshToken: newRefreshToken,
                user: userData,
                tokenVersion: user.tokenVersion + 1,
            };
        });
    }
    updateTokenVersion(userId, newVersion) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._userRepository.updateTokenVersion(userId, newVersion);
        });
    }
    getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._userRepository.getUserById(id);
        });
    }
}
//# sourceMappingURL=auth.service.js.map