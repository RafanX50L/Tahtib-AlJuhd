import { IUserRepository } from "@/core/interface/repositories/IUser.repository";
import {
  forgotPasswordReturnType,
  IAuthService,
  resetPasswordReturnType,
  signInReturnType,
  verifyOtpReturnType,
  SignUpUser,
  getUserDataReturnType,
  refreshTokenReturnType,
} from "../../core/interface/services/auth/IAuth.service";
import {
  comparePassword,
  generateAccessToken,
  generateOTP,
  generateRefreshToken,
  hashPassword,
  sendOtpEmail,
  sendPasswordResetEmail,
  verifyRefreshToken,
} from "../../utils";
import { redisClient } from "../../config/redis.config";
import { createHttpError } from "../../utils/http-error.util";
import { HttpStatus } from "../../constants/status.constant";
import { HttpResponse } from "../../constants/response-message.constant";
import IUser from "@/core/interface/model/IUser.model";
import { generateNanoId } from "../../utils/generate-nanoid";
import mongoose from "mongoose";
import { UserDTO } from "@/dtos/auth/UserDTO";

export class AuthService implements IAuthService {
  constructor(private readonly _userRepository: IUserRepository) {}

  async signUp(user: SignUpUser): Promise<string> {
    const existingUser = await this._userRepository.findByEmail(user.email);
    if (existingUser) {
      throw createHttpError(HttpStatus.CONFLICT, HttpResponse.USER_EXIST);
    }

    const otp = generateOTP();
    console.log("Generated OTP:", otp);
    await sendOtpEmail(user.email, otp);

    const response = await redisClient.setEx(
      user.email,
      300,
      JSON.stringify({ ...user, otp })
    );
    if (!response) {
      throw createHttpError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        "Error saving OTP to Redis"
      );
    }
    console.log("OTP sent to email:", user.email);
    return user.email;
  }

  async signIn(email: string, password: string): Promise<signInReturnType> {
    const existingUser = await this._userRepository.findByEmail(email);
    if (!existingUser) {
      throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.USER_NOT_FOUND);
    }

    if (
      !existingUser.password ||
      !(await comparePassword(password, existingUser.password))
    ) {
      throw createHttpError(
        HttpStatus.FORBIDDEN,
        HttpResponse.INVALID_PASSWORD
      );
    }

    if (existingUser.isBlocked) {
      throw createHttpError(
        HttpStatus.UNAUTHORIZED,
        HttpResponse.USER_IS_BLOKED
      );
    }

    const payload = {
      id: existingUser._id.toString(),
      role: existingUser.role,
    };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);
    const userData = await UserDTO.toResponse(existingUser);

    return {
      user: userData,
      accessToken,
      refreshToken,
    };
  }

  async verifyOtp(email: string, otp: string): Promise<verifyOtpReturnType> {
    const storedDataString = await redisClient.get(email);
    if (!storedDataString) {
      throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.OTP_NOT_FOUND);
    }

    const storedData = JSON.parse(storedDataString as string);

    if (storedData.otp !== otp) {
      throw createHttpError(HttpStatus.BAD_REQUEST, HttpResponse.OTP_INCORRECT);
    }

    const name = storedData.email.split("@")[0].replace(/[^a-zA-Z0-9]/g, "_");
    const user: Partial<IUser> = {
      name,
      email: storedData.email,
      password: storedData.password,
      role: storedData.role,
    };

    const createdUser = await this._userRepository.createUser(user as IUser);
    if (!createdUser) {
      throw createHttpError(
        HttpStatus.CONFLICT,
        HttpResponse.USER_CREATION_FAILED
      );
    }

    await redisClient.del(email);

    const payload = { id: createdUser._id.toString(), role: createdUser.role };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);
    const userData = await UserDTO.toResponse(createdUser);

    return {
      user: userData,
      accessToken,
      refreshToken,
    };
  }

  async resendOtp(email: string): Promise<string> {
    const storedDataString = await redisClient.get(email);
    if (!storedDataString) {
      throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.OTP_NOT_FOUND);
    }

    const storedData = JSON.parse(storedDataString as string);
    const otp = generateOTP();
    console.log("Resending OTP:", otp);
    await sendOtpEmail(email, otp);
    await redisClient.setEx(email, 300, JSON.stringify({ ...storedData, otp }));
    return email;
  }

  async forgotPassword(email: string): Promise<forgotPasswordReturnType> {
    const existingUser = await this._userRepository.findByEmail(email);
    if (!existingUser) {
      throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.USER_NOT_FOUND);
    }

    const token = generateNanoId();
    const storedOnRedis = await redisClient.setEx(token, 300, email);
    if (!storedOnRedis) {
      throw createHttpError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        HttpResponse.SERVER_ERROR
      );
    }

    await sendPasswordResetEmail(email, token);
    return {
      status: HttpStatus.OK,
      message: HttpResponse.EMAIL_SENT_SUCCESS,
    };
  }

  async resetPassword(
    token: string,
    password: string
  ): Promise<resetPasswordReturnType> {
    const getEmail = await redisClient.get(token);
    if (!getEmail) {
      throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.TOKEN_EXPIRED);
    }

    const hashedPassword = await hashPassword(password);
    const updatedUser = await this._userRepository.updatePassword(
      getEmail as string,
      hashedPassword
    );
    if (!updatedUser) {
      throw createHttpError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        HttpResponse.SERVER_ERROR
      );
    }

    await redisClient.del(token);
    return {
      status: HttpStatus.OK,
      message: HttpResponse.PASSWORD_RESET_SUCCESS,
    };
  }

  async googleSignUp(
    email: string,
    name: string,
    role: "client" | "trainer" | "admin"
  ): Promise<verifyOtpReturnType> {
    const existingUser = await this._userRepository.findByEmail(email);
    if (!existingUser) {
      if (!role) {
        throw createHttpError(
          HttpStatus.BAD_REQUEST,
          "User does not exist, please register first"
        );
      }

      const user: Partial<IUser> = {
        name,
        email,
        role,
      };

      const createdUser = await this._userRepository.createUser(user as IUser);
      if (!createdUser) {
        throw createHttpError(
          HttpStatus.INTERNAL_SERVER_ERROR,
          HttpResponse.USER_CREATION_FAILED
        );
      }

      const payload = { id: createdUser._id.toString(), role: createdUser.role };
      const accessToken = generateAccessToken(payload);
      const refreshToken = generateRefreshToken(payload);
      const userData = await UserDTO.toResponse(createdUser);

      return {
        user: userData,
        accessToken,
        refreshToken,
      };
    } else if (existingUser.password) {
      throw createHttpError(
        HttpStatus.UNAUTHORIZED,
        HttpResponse.USER_ALREADY_EXIST_WITH_PASSWORD
      );
    } else {
      if (existingUser.isBlocked) {
        throw createHttpError(
          HttpStatus.UNAUTHORIZED,
          HttpResponse.USER_IS_BLOKED
        );
      }
      const payload = { id: existingUser._id.toString(), role: existingUser.role };
      const accessToken = generateAccessToken(payload);
      const refreshToken = generateRefreshToken(payload);
      const userData = await UserDTO.toResponse(existingUser);

      return {
        user: userData,
        accessToken,
        refreshToken,
      };
    }
  }

  async getUserData(id: string): Promise<getUserDataReturnType> {
    const objectId = new mongoose.Types.ObjectId(id);
    const user = await this._userRepository.findById(objectId);
    if (!user) {
      throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.USER_NOT_FOUND);
    }
    const userData = await UserDTO.toResponse(user);
    return {
      user: {
        _id: userData._id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
      },
    };
  }

  async refreshAccessToken(
    refreshToken: string
  ): Promise<refreshTokenReturnType> {
    if (!refreshToken) {
      throw new Error("Refresh token is required");
    }

    const decoded = verifyRefreshToken(refreshToken);
    if (
      !decoded ||
      typeof decoded !== "object" ||
      !("id" in decoded) ||
      !("role" in decoded)
    ) {
      throw createHttpError(HttpStatus.FORBIDDEN, "Invalid refresh token");
    }

    const { id, role } = decoded as {
      id: string;
      role: string;
    };
    const user = await this._userRepository.getUserById(id);
    if (!user) {
      throw createHttpError(HttpStatus.NOT_FOUND, "User not found");
    }

    if (user.isBlocked) {
      throw createHttpError(HttpStatus.UNAUTHORIZED, "User is blocked");
    }


    const newRefreshToken = generateRefreshToken({
      id: user._id.toString(),
      role,
    });


    const payload = {
      id: user._id.toString(),
      role,
    };

    const accessToken = generateAccessToken(payload);
    const userData = await UserDTO.toResponse(user);

    return {
      accessToken,
      refreshToken: newRefreshToken,
      user: userData,
    };
  }

  async getUserById(id: string): Promise<IUser | null> {
    return await this._userRepository.getUserById(id);
  }
}