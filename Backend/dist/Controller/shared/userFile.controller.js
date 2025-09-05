var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { createHttpError } from "../../utils";
export class UserFileController {
    constructor(_userFileService) {
        this._userFileService = _userFileService;
    }
    updateProfilePicture(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                const file = req.file;
                const role = (_b = req.user) === null || _b === void 0 ? void 0 : _b.role;
                console.log(req.file);
                if (!file) {
                    return next(createHttpError(400, "No file uploaded"));
                }
                const { signedUrl } = yield this._userFileService.updateProfilePicture(userId, file, role);
                res.status(200).json({
                    message: "Profile picture updated successfully",
                    profilePicture: signedUrl,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
//# sourceMappingURL=userFile.controller.js.map