import { IUserModel } from "../../models/implementation/user.model";
import { IPersonalization } from "../../models/implementation/personalization.model";
import { IUser } from "@/models/interface/IUser.model";
import { IBaseRepository } from "../IBase.respository";

export interface IUserRepository extends IBaseRepository<IUserModel> {
  createUser(user: IUser): Promise<IUserModel>;
  findByEmail(email: string): Promise<IUserModel | null>;
  findByIdWithPersonalization(id: string): Promise<IUserModel | null>;
  updatePassword(email: string, hashedPassword: string): Promise<IUserModel | null>;
  updatePersonalization(userId: string, data: IPersonalization["data"]): Promise<IPersonalization | null>;
   getUserById (id:string):Promise<IUser | null>;
}