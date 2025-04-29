import { model, Schema, Document } from "mongoose";
import { IUser } from "../interface/IUser.model";
import { hashPassword } from "../../utils/bcrypt.util";

export interface IUserModel extends Document, Omit<IUser, "_id"> {}

const userSchema = new Schema<IUserModel>({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
  },
  status: {
    type: String,
    enum: ["active", "blocked"],
    default: "active",
  },
  role: {
    type: String,
    enum: ["client", "trainer", "admin"],
    default: "client",
  },
});

userSchema.pre<IUserModel>("save",async function (next) {
    if(this.isModified("password")){
        this.password = await hashPassword(this.password);
    }    
    next();
});

const User = model<IUserModel>("User",userSchema);
export default User;