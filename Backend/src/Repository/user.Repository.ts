import { IUserRepository } from "../core/interface/repositories/IUser.repository";
import { BaseRepository } from "@/Repository/base.repository";
import { UserModel } from "@/models/user.model";
import  IUser  from "@/core/interface/model/IUser.model";
import { createHttpError } from "@/utils";
import { HttpStatus } from "@/constants/status.constant";
import { HttpResponse } from "@/constants/response-message.constant";
import {  Types } from "mongoose";



export class UserRepository
  extends BaseRepository<IUser>
  implements IUserRepository
{
  constructor() {
    super(UserModel);
  }

  async createUser(user: Partial<IUser>): Promise<IUser> {
      console.log("Creating user:", user);
      const createdUser = await this.model.create(user);
      return createdUser;
  }

  async blockOrUnblockUser(
    id: string
  ): Promise<{ success: boolean; message: string }> {
    const user = await this.findById(new Types.ObjectId(id));
    console.log(user);
    if (!user) {
      throw createHttpError(HttpStatus.NOT_FOUND, "User not found");
    }

    const updated = await this.model.findByIdAndUpdate(
      id,
      {
        $set: {
          isBlocked: !user.isBlocked, // Flip the actual value
        },
      },
      { new: true }
    );

    if (!updated) {
      throw createHttpError(
        HttpStatus.NO_CONTENT,
        HttpResponse.FAILED_TO_UPDATE_USER_STATUS
      );
    }

    console.log("updated", updated);

    return { success: true, message: "User status updated scuccessfully" };
  }

  async isBlocked(id: string): Promise<boolean> {
    const user = await this.model.findById(id);
    if (user && user.isBlocked) {
      return true;
    } else {
      return false;
    }
  }

  async getUserById(id: string): Promise<IUser | null> {
    return await UserModel.findById(id);
  }

  async updateTokenVersion(userId: string, newVersion: number): Promise<void> {
    await UserModel.findByIdAndUpdate(userId, { tokenVersion: newVersion });
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return await this.model.findOne({ email });
  }

  async findByIdWithPersonalization(id: string): Promise<IUser | null> {
    return await this.model.findById(id).populate("personalization");
  }

  async updatePassword(
    email: string,
    hashedPassword: string
  ): Promise<IUser | null> {
      return await this.model
        .findOneAndUpdate(
          { email },
          { password: hashedPassword },
          { new: true }
        )
        .populate("personalization");
  }

  async updatePersonalizationsId(userId:string,personalizationId:string):Promise<IUser>{
    return await this.update(userId,{personalizationId});
  }

  async getAllClientFilter(
  page: number,
  limit: number,
  statusFilter: string,
  searchTerm: string
){
  const skip = (page - 1) * limit;
  searchTerm = searchTerm?.trim() || "";
  console.log(statusFilter);
  const matchStatus = statusFilter === "all" ? {} : { "personalization.data.planStatus": statusFilter };

  const pipeline = [
    {
      $match: {
        role: "client",
        ...(searchTerm && { name: { $regex: searchTerm, $options: "i" } }),
      },
    },
    {
      $lookup: {
        from: "personalizations",
        localField: "personalizationId",
        foreignField: "_id",
        as: "personalization",
      },
    },
    { $unwind: { path: "$personalization", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "userfiles",
        localField: "personalization.data.userData.profilePictureId",
        foreignField: "_id",
        as: "profilePictureDoc",
      },
    },
    {
      $lookup: {
        from: "sessions",
        localField: "personalization.data.sessionsId",
        foreignField: "_id",
        as: "sessions",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "sessions.trainerId",
        foreignField: "_id",
        as: "trainers",
      },
    },
    {
      $match: {
        ...matchStatus,
      },
    },
    {
      $facet: {
        data: [
          { $skip: skip },
          { $limit: limit },
          {
            $project: {
              _id: 1,
              name: 1,
              email: 1,
              isBlocked: 1,
              role: 1,
              createdAt: 1,
              planStatus: "$personalization.data.planStatus",
              profilePicture: { $arrayElemAt: ["$profilePictureDoc.filePath", 0] },
              trainer: { $arrayElemAt: ["$trainers.name", 0] },
              sessionStatus: { $arrayElemAt: ["$sessions.status", 0] },
            },
          },
        ],
        totalCount: [{ $count: "count" }],
      },
    },
  ];

  const result = await this.model.aggregate(pipeline);
  const data = result[0]?.data || [];
  const totalCount = result[0]?.totalCount[0]?.count || 0;

  return { data, totalCount };
}


}
