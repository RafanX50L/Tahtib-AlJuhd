"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserFileController = void 0;
const utils_1 = require("../../utils");
const controller_error_handler_util_1 = require("../../utils/controller-error-handler.util");
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
            if (!file) {
                return next((0, utils_1.createHttpError)(400, "No file uploaded"));
            }
            // Validate request using DTO (for consistency with other controllers)
            const { signedUrl } = await this._userFileService.updateProfilePicture(userId, file, role);
            controller_error_handler_util_1.ControllerErrorHandler.handleSuccess(res, {
                message: "Profile picture updated successfully",
                profilePicture: signedUrl,
            }, "Profile picture updated successfully");
        }
        catch (error) {
            controller_error_handler_util_1.ControllerErrorHandler.handleError(error, res, next);
        }
    }
}
exports.UserFileController = UserFileController;
//# sourceMappingURL=userFile.controller.js.map