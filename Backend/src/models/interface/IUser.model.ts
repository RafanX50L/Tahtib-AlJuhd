import { Types } from "mongoose";


export interface IUser {
  _id?: Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  isBlocked: boolean;
  role: "client" | "trainer" | "admin";
  personalization: string | null;
}