"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toObjectId = void 0;
const mongoose_1 = require("mongoose");
const toObjectId = (id) => {
    if (!mongoose_1.Types.ObjectId.isValid(id)) {
        throw new Error(`Invalid ObjectId: ${id}`);
    }
    return new mongoose_1.Types.ObjectId(id);
};
exports.toObjectId = toObjectId;
//# sourceMappingURL=convert-object-id.util.js.map