import { Types } from "mongoose";
export const toObjectId = (id) => {
    if (!Types.ObjectId.isValid(id)) {
        throw new Error(`Invalid ObjectId: ${id}`);
    }
    return new Types.ObjectId(id);
};
//# sourceMappingURL=convert-object-id.util.js.map