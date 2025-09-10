"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserFileController = void 0;
const utils_1 = require("../../utils");
class UserFileController {
    _userFileService;
    constructor(_userFileService) {
        this._userFileService = _userFileService;
    }
    /** Reserved for Workout plan specific methods */
    _placeholder;
    async updateProfilePicture(req, res, next) {
        try {
            const userId = req.user?.id;
            const file = req.file;
            const role = req.user?.role;
            console.log(req.file);
            if (!file) {
                return next((0, utils_1.createHttpError)(400, "No file uploaded"));
            }
            const { signedUrl } = await this._userFileService.updateProfilePicture(userId, file, role);
            res.status(200).json({
                message: "Profile picture updated successfully",
                profilePicture: signedUrl,
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.UserFileController = UserFileController;
//# sourceMappingURL=userFile.controller.js.map