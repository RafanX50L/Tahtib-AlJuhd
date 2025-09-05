var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { createHttpError } from "../utils";
import { HttpResponse } from "../constants/response-message.constant";
import { HttpStatus } from "../constants/status.constant";
import { UserModel } from "../models/user.model";
export default function isBlocked() {
    return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!userId) {
                throw createHttpError(HttpStatus.UNAUTHORIZED, "User ID missing in token.");
            }
            const user = yield UserModel.findById(userId);
            if (user === null || user === void 0 ? void 0 : user.isBlocked) {
                return next(createHttpError(HttpStatus.UNAUTHORIZED, HttpResponse.USER_IS_BLOKED));
            }
            next();
        }
        catch (error) {
            next(error);
        }
    });
}
//# sourceMappingURL=isBlocked.middleware.js.map