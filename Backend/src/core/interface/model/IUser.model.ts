
import {  Document, ObjectId } from 'mongoose';


// User Interface
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "client" | "trainer" | "admin";
  personalizationId: ObjectId | null; // References Personalization
  isBlocked: boolean;
  tokenVersion: number;
  calendlyLink?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export default IUser;