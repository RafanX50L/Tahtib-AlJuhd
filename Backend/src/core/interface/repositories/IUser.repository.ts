import IUser from "@/core/interface/model/IUser.model"; 
import { IBaseRepository } from "./IBase.repository";

export interface IClientFilterResult {
  _id: string;
  name: string;
  email: string;
  isBlocked: boolean;
  role: string;
  createdAt: Date;
  planStatus?: 'Active' | 'Inactive';
  profilePicture?: string; // filePath
  trainer?: string;
  sessionStatus?: string;
}

export interface IGetAllClientFilterResponse {
  data: IClientFilterResult[];
  totalCount: number;
}


export interface IUserRepository extends IBaseRepository<IUser> {
  createUser(user: IUser): Promise<IUser>;
  findByEmail(email: string): Promise<IUser | null>;
  isBlocked(id: string): Promise<boolean>;
  blockOrUnblockUser(
    id: string
  ): Promise<{ success: boolean; message: string }>;

  findByIdWithPersonalization(id: string): Promise<IUser | null>;
  updatePassword(email: string, hashedPassword: string): Promise<IUser | null>;
  // updatePersonalizationId(userId: string, personalizationId:string): Promise<void>;
  getUserById(id: string): Promise<IUser | null>;
  updatePersonalizationsId(
    userId: string,
    personalizationId: string
  ): Promise<IUser>;
  getAllClientFilter(page:number,limit:number,statusFilter:string,searchTerm:string):Promise<IGetAllClientFilterResponse>;
  searchForUsers(filter: Record<string, unknown>):Promise<IUser[]>;
}
