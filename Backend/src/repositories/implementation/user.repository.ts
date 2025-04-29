import { IUserRepository } from "../interface/IUser.repository";
// import { Types } from "mongoose";
import { BaseRepository } from "../base.repository";
import User, { IUserModel } from "../../models/implementation/user.model";
// import { toObjectId } from "../../utils/convert-object-id.util";

export class UserRepository
  extends BaseRepository<IUserModel>
  implements IUserRepository
{
  constructor() {
    super(User);
  }

  async createUser(user: IUserModel): Promise<IUserModel> {
    try {
      return await this.create(user);
    } catch (error) {
      console.error("Error creating user:", error);
      throw new Error("Error creating user");
    }
  }
  async findByEmail(email: string): Promise<IUserModel | null> {
    try {
      return await this.model.findOne({ email });
    } catch (error) {
      console.error("Error finding user by email:", error);
      throw new Error("Error finding user by email");
    }
  }
}
