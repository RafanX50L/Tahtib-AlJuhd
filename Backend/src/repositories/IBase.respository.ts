import { Types } from "mongoose";

export interface IBaseRepository<T>{
    findById(id: Types.ObjectId): Promise<T | null> ;
    create(data: Partial<T>): Promise<T> ;
    isBlocked(id:string):Promise<boolean>;
}