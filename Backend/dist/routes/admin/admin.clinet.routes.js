"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const admin_client_controller_1 = require("../../Controller/admin/admin.client.controller");
const personalization_repository_1 = require("../../Repository/personalization.repository");
const user_Repository_1 = require("../../Repository/user.Repository");
const admin_client_service_1 = require("../../Services/admin/admin.client.service");
const express_1 = require("express");
const adminClinetRoutes = (0, express_1.Router)();
const userRepository = new user_Repository_1.UserRepository();
const personalizationRepository = new personalization_repository_1.PersonalizationRepository();
const adminClinetService = new admin_client_service_1.AdminClientService(userRepository, personalizationRepository);
const adminClientController = new admin_client_controller_1.AdminClinetController(adminClinetService);
adminClinetRoutes.get('/clients', adminClientController.getAllClinet.bind(adminClientController));
exports.default = adminClinetRoutes;
//# sourceMappingURL=admin.clinet.routes.js.map