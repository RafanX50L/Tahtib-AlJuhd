import { Schema, model } from "mongoose";
import { hashPassword } from "../utils/bcrypt.util";
import IUser from "@/core/interface/model/IUser.model";

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["client", "trainer", "admin"],
      default: "client",
    },
    calendlyLink: { type: String, default: null },
    personalizationId: {
      type: Schema.Types.ObjectId,
      ref: "Personalization",
      default: null,
    },
    isBlocked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (this.isModified("password") && this.password) {
    this.password = await hashPassword(this.password);
  }
  next();
});

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });

export const UserModel = model<IUser>("User", userSchema);
