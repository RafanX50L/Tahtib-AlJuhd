"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_dietPlan_controller_1 = require("../../Controller/client/client.dietPlan.controller");
const DietPlan_repository_1 = require("../../Repository/DietPlan.repository");
const personalization_repository_1 = require("../../Repository/personalization.repository");
const client_dietPlan_service_1 = require("../../Services/client/client.dietPlan.service");
const express_1 = require("express");
const dietPlanRouter = (0, express_1.Router)();
const dietPlanRepository = new DietPlan_repository_1.DietPlanRepository();
const clientPersonalizationRepository = new personalization_repository_1.PersonalizationRepository();
const dietPlanService = new client_dietPlan_service_1.ClientDietPlanService(dietPlanRepository, clientPersonalizationRepository);
const dietPlanController = new client_dietPlan_controller_1.ClientDietPlanController(dietPlanService);
dietPlanRouter.get('/diet-plan', dietPlanController.getDietPlan.bind(dietPlanController));
exports.default = dietPlanRouter;
//# sourceMappingURL=clinet.dietPlan.routes.js.map