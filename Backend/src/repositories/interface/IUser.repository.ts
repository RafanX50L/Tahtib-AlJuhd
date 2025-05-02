import { IUserModel } from "../../models/implementation/user.model";
// import { IUser } from "../../models/interface/IUser.model";
// import { Types } from "mongoose";

export interface IUserRepository {
    createUser(user: IUserModel): Promise<IUserModel>;
    findByEmail(email: string): Promise<IUserModel | null>;
}