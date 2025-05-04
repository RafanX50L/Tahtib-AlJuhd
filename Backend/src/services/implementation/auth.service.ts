import { IUserRepository } from "../../repositories/interface/IUser.repository";
import {
  forgotPasswordReturnType,
  IAuthService,
  resetPasswordReturnType,
  signInReturnType,
  verifyOtpReturnType,
} from "../interface/IAuth.service";
import { IUser } from "../../models/interface/IUser.model";
import {
  comparePassword,
  generateAccessToken,
  generateOTP,
  generateRefreshToken,
  hashPassword,
  sendOtpEmail,
  sendPasswordResetEmail,
} from "../../utils";
import { redisClient } from "../../config/redis.config";
import { createHttpError } from "../../utils/http-error.util";
import { HttpStatus } from "../../constants/status.constant";
import { HttpResponse } from "../../constants/response-message.constant";
import { IUserModel } from "../../models/implementation/user.model";
import { generateNanoId } from "../../utils/generate-nanoid";

// implementation of the IAuth Service
export class AuthService implements IAuthService {
  constructor(private readonly _userRepository: IUserRepository) {}

  async signUp(user: IUser): Promise<string> {
    // Check if the user already exists
    const existingUser = await this._userRepository.findByEmail(user.email);
    if (existingUser) {
      throw createHttpError(HttpStatus.CONFLICT, "User already exists");
    }
    const otp = generateOTP();
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
    // Check if the user exists
    const existingUser = await this._userRepository.findByEmail(email);
    if (!existingUser) {
      throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.USER_NOT_FOUND);
    }

    // Check if the password is correct
    console.log(
      "passsword coreect : ",
      await comparePassword(password, existingUser.password),
      password,
      existingUser.password
    );
    if (!(await comparePassword(password, existingUser.password))) {
      throw createHttpError(
        HttpStatus.UNAUTHORIZED,
        HttpResponse.INVALID_PASSWORD
      );
    }

    const payload = { id: existingUser._id, role: existingUser.role };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);
    console.log("Access Token:", accessToken);
    return { role: existingUser.role, accessToken, refreshToken };
  }

  async verifyOtp(email: string, otp: string): Promise<verifyOtpReturnType> {
    const storedDataString = await redisClient.get(email);
    if (!storedDataString) {
      throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.OTP_NOT_FOUND);
    }

    const storedData = JSON.parse(storedDataString);

    if (storedData.otp !== otp)
      throw createHttpError(HttpStatus.BAD_REQUEST, HttpResponse.OTP_INCORRECT);

    const user = {
      name: storedData.name,
      email: storedData.email,
      role: storedData.role,
      password: storedData.password,
    };

    const createdUser = await this._userRepository.createUser(
      user as IUserModel
    );

    if (!createdUser)
      throw createHttpError(
        HttpStatus.CONFLICT,
        HttpResponse.USER_CREATION_FAILED
      );

    await redisClient.del(email);

    const payload = { id: createdUser._id, role: createdUser.role };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    return { user: createdUser, accessToken, refreshToken };
  }

  async resendOtp(email: string): Promise<string> {
    const existingData = JSON.parse((await redisClient.get(email)) as string);
    if (!existingData)
      throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.OTP_NOT_FOUND);

    const otp = generateOTP();
    await sendOtpEmail(email, otp);
    await redisClient.setEx(
      email,
      300,
      JSON.stringify({ ...existingData, otp })
    );
    return email;
  }

  async forgotPassword(email: string): Promise<forgotPasswordReturnType> {
    const existingUser = await this._userRepository.findByEmail(email);
    if (!existingUser)
      throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.USER_NOT_FOUND);

    const token = generateNanoId();

    const storedOnRedis = await redisClient.setEx(token, 300, email);
    if (!storedOnRedis)
      throw createHttpError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        HttpResponse.SERVER_ERROR
      );

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
    if (!getEmail)
      throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.TOKEN_EXPIRED);

    const hashedPassword = await hashPassword(password);

    const updatedUser = await this._userRepository.updatePassword(
      getEmail,
      hashedPassword
    );
    if (!updatedUser)
      throw createHttpError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        HttpResponse.SERVER_ERROR
      );

    await redisClient.del(token);
    return {
      status: HttpStatus.OK,
      message: HttpResponse.PASSWORD_RESET_SUCCESS,
    };
  }

  async googleSignUp(
    email: string,
    name: string,
    role: string
  ): Promise<verifyOtpReturnType> {
    const existingUser = await this._userRepository.findByEmail(email);
    console.log("existing user", existingUser);
    if (!existingUser) {
      if(!role){
        throw createHttpError(HttpStatus.BAD_REQUEST, 'User is not exist,Go for Register first');
      }
      const user = {
        name: name,
        email: email,
        role: role,
      };
      const createdUser = await this._userRepository.createUser(
        user as IUserModel
      );
      if (!createdUser) {
        throw createHttpError(
          HttpStatus.INTERNAL_SERVER_ERROR,
          HttpResponse.USER_CREATION_FAILED
        );
      }
      const payload = { id: createdUser._id, role: createdUser.role };
      const accessToken = generateAccessToken(payload);
      const refreshToken = generateRefreshToken(payload);
      return { user: createdUser, accessToken, refreshToken };
    }
    else if(existingUser && existingUser.password) {
      throw createHttpError(HttpStatus.UNAUTHORIZED, HttpResponse.USER_ALREADY_EXIST_WITH_PASSWORD);
    } else {
      const payload = { id: existingUser._id, role: existingUser.role };

      const accessToken = generateAccessToken(payload);
      const refreshToken = generateRefreshToken(payload);

      return { user: existingUser, accessToken, refreshToken };
    }
  }
}
