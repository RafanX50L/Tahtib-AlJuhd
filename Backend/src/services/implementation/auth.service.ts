import { IUserRepository } from "../../repositories/interface/IUser.repository";
import { IAuthService } from "../interface/IAuth.service";
// import { IUserModel } from "../../models/implementation/user.model";
// import { JwtPayload } from "jsonwebtoken";
import { IUser } from "../../models/interface/IUser.model";

// implementation of the IAuth Service 
export class AuthService implements IAuthService {
    constructor(private readonly _userRepository: IUserRepository) {}

    async signUp(user: IUser):Promise<string> {
        try {
            // const userExists = await this._userRepository.findByEmail(user.email);
            // if (userExists) {
            //     throw new Error("User already exists");
            // }
            // const otp = generateOtp();

            // await sendOtpToEmail(user.email, otp); 

            // const response = await 
            console.log("User created successfully", user);
            return "User created successfully";
        }catch (error) {
            console.error("Error signing up user:", error);
            throw new Error("Error signing up user");
        }
    }
}