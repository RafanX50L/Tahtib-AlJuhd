import { HttpResponse } from "@/constants/response-message.constant";
import { HttpStatus } from "@/constants/status.constant";
import { createHttpError } from "@/utils";
import { Document, Model, Types } from "mongoose";

export abstract class BaseRepository<
  T extends Document & { isBlocked: boolean },
> {
  constructor(protected model: Model<T>) {}

  async findById(id: Types.ObjectId): Promise<T | null> {
    return this.model.findById(id);
  }

  async blockOrUnblockUser(
    id: string
  ): Promise<{ success: boolean; message: string }> {
    const user = await this.findById(new Types.ObjectId(id));
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

  async create(data: Partial<T>): Promise<T> {
    console.log("Creating document with data:", data);
    const document = new this.model(data);
    return document.save();
  }

  async isBlocked(id: string): Promise<boolean> {
    const user = await this.model.findById(id);
    if (user && user.isBlocked) {
      return true;
    } else {
      return false;
    }
  }

  async findByIdAndUpdatePersonalization(
    id: string,
    personalization: Types.ObjectId
  ): Promise<T | null> {
    return this.model.findByIdAndUpdate(id, { personalization }, { new: true });
  }
}
