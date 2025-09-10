"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const admin_common_controller_1 = require("../../Controller/admin/admin.common.controller");
const user_Repository_1 = require("../../Repository/user.Repository");
const admin_common_service_1 = require("../../Services/admin/admin.common.service");
const express_1 = require("express");
const adminCommonRoutes = (0, express_1.Router)();
const userRepository = new user_Repository_1.UserRepository();
const adminCommonService = new admin_common_service_1.AdminCommonService(userRepository);
const adminCommonController = new admin_common_controller_1.AdminCommonController(adminCommonService);
adminCommonRoutes.patch('/block-or-unblock/:id', adminCommonController.blockOrUnblock.bind(adminCommonController));
exports.default = adminCommonRoutes;
//# sourceMappingURL=admin.common.routes.js.map