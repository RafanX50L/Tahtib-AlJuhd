// import { IUserModel } from "../../models/implementation/user.model";
import { IUser } from "../../models/interface/IUser.model";

export interface IAuthService {
    signUp(user: IUser): Promise<string>;
}