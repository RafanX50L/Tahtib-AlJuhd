import { Types } from "mongoose";

export const toObjectId = (id: string)=> {
    if (!Types.ObjectId.isValid(id)) {
        throw new Error(`Invalid ObjectId: ${id}`);
    }
    return new Types.ObjectId(id);
};