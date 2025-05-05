import { Types } from "mongoose";
import { IPersonalization } from "../../models/implementation/personalization.model";

export interface IUser {
  _id?: Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  status: "active" | "inactive";
  role: "client" | "trainer" | "admin";
  personalization?: IPersonalization;
}