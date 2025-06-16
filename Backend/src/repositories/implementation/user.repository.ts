import { IUserRepository } from "../interface/IUser.repository";
import { BaseRepository } from "../base.repository";
import { UserModel, IUserModel } from "../../models/implementation/user.model";
import { IUser } from "../../models/interface/IUser.model";

export class UserRepository
  extends BaseRepository<IUserModel>
  implements IUserRepository
{
  constructor() {
    super(UserModel);
  }

  async createUser(user: Partial<IUser>): Promise<IUserModel> {
    try {
      console.log("Creating user:", user);
      const createdUser = await this.model.create(user);
      return createdUser;
    } catch (error) {
      console.error("Error creating user:", error);
      throw new Error("Error creating user");
    }
  }

  async getUserById(id: string): Promise<IUser | null> {
    try {
      return await this.model.findById(id);
    } catch (error) {
      console.log("Error finding user by Id:", error);
      throw new Error("Error finding user by Id");
    }
  }

  async findByEmail(email: string): Promise<IUserModel | null> {
    try {
      return (await this.model.findOne({ email }));
    } catch (error) {
      console.error("Error finding user by email:", error);
      throw new Error("Error finding user by email");
    }
  }

  async findByIdWithPersonalization(id: string): Promise<IUserModel | null> {
    try {
      return await this.model.findById(id).populate("personalization");
    } catch (error) {
      console.error("Error finding user by ID with personalization:", error);
      throw new Error("Error finding user by ID with personalization");
    }
  }

  async updatePassword(
    email: string,
    hashedPassword: string
  ): Promise<IUserModel | null> {
    try {
      return await this.model
        .findOneAndUpdate(
          { email },
          { password: hashedPassword },
          { new: true }
        )
        .populate("personalization");
    } catch (error) {
      console.error("Error updating password:", error);
      throw new Error("Error updating password");
    }
  }

  async updatePersonalizationId(
    userId: string,
    personalizationId: string
  ): Promise<void> {
    await this.model.findByIdAndUpdate(userId,{personalization:personalizationId},{new:true});
  }
}
