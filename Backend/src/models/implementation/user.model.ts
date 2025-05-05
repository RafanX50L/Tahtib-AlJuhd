import { model, Schema, Document } from "mongoose";
import { IUser } from "../interface/IUser.model";
import { hashPassword } from "../../utils/bcrypt.util";

export interface IUserModel extends Document, Omit<IUser, "_id"> {}

const userSchema = new Schema<IUserModel>(
  {
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
      enum: ["active", "inactive"],
      default: "active",
    },
    role: {
      type: String,
      enum: ["client", "trainer", "admin"],
      default: "client",
    },
  },
  { timestamps: true }
);

userSchema.pre<IUserModel>("save", async function (next) {
  if (this.isModified("password") && this.password) {
    this.password = await hashPassword(this.password);
  }
  next();
});

userSchema.virtual("personalization", {
  ref: "Personalization",
  localField: "_id",
  foreignField: "userId",
  justOne: true,
});

userSchema.set("toObject", { virtuals: true });
userSchema.set("toJSON", { virtuals: true });

export const UserModel = model<IUserModel>("User", userSchema);