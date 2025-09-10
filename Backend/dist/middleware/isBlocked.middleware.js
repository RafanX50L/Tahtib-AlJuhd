"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = isBlocked;
const utils_1 = require("../utils");
const response_message_constant_1 = require("../constants/response-message.constant");
const status_constant_1 = require("../constants/status.constant");
const user_model_1 = require("../models/user.model");
function isBlocked() {
    return async (req, res, next) => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                throw (0, utils_1.createHttpError)(status_constant_1.HttpStatus.UNAUTHORIZED, "User ID missing in token.");
            }
            const user = await user_model_1.UserModel.findById(userId);
            if (user?.isBlocked) {
                return next((0, utils_1.createHttpError)(status_constant_1.HttpStatus.UNAUTHORIZED, response_message_constant_1.HttpResponse.USER_IS_BLOKED));
            }
            next();
        }
        catch (error) {
            next(error);
        }
    };
}
//# sourceMappingURL=isBlocked.middleware.js.map