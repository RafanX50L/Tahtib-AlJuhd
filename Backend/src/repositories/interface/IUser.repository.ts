import { IUserModel } from "../../models/implementation/user.model";
import { IPersonalization } from "../../models/implementation/personalization.model";
import { IUser } from "@/models/interface/IUser.model";

export interface IUserRepository {
  createUser(user: IUser): Promise<IUserModel>;
  findByEmail(email: string): Promise<IUserModel | null>;
  findByIdWithPersonalization(id: string): Promise<IUserModel | null>;
  updatePassword(email: string, hashedPassword: string): Promise<IUserModel | null>;
  updatePersonalization(userId: string, data: IPersonalization["data"]): Promise<IPersonalization | null>;
}