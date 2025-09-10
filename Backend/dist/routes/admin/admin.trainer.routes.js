"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const admin_trainer_controller_1 = require("../../Controller/admin/admin.trainer.controller");
const Trainer_personalization_repository_1 = require("../../Repository/Trainer.personalization.repository");
const TrainerInterview_repository_1 = require("../../Repository/TrainerInterview.repository");
const user_Repository_1 = require("../../Repository/user.Repository");
const admin_trainer_service_1 = require("../../Services/admin/admin.trainer.service");
const express_1 = require("express");
const adminTrainerRoutes = (0, express_1.Router)();
const trainerPersonalizationRepository = new Trainer_personalization_repository_1.TrainerPersonalizationRepository();
const userRepository = new user_Repository_1.UserRepository();
const trainerINterviewRepository = new TrainerInterview_repository_1.TrainerInterviewRepository();
const adminTrainerService = new admin_trainer_service_1.AdminTrainerSerice(trainerPersonalizationRepository, trainerINterviewRepository, userRepository);
const adminTrainerController = new admin_trainer_controller_1.AdminTrainerController(adminTrainerService);
// adminTrainerRoutes.get('/trainers/approved/:page/limit/:limit/search/:search?',adminTrainerController.getApprovedTrainers.bind(adminTrainerController));
// adminTrainerRoutes.get('/trainers/pending/:page/limit/:limit/search/:search?',adminTrainerController.getPendingTrainers.bind(adminTrainerController));
// GET /trainers/approved?page=1&limit=10&search=john
adminTrainerRoutes.get("/trainers/approved", adminTrainerController.getApprovedTrainers.bind(adminTrainerController));
// GET /trainers/pending?page=1&limit=10&search=john
adminTrainerRoutes.get("/trainers/pending", adminTrainerController.getPendingTrainers.bind(adminTrainerController));
adminTrainerRoutes.post('/trainers/interview/schedule/id/:trainerId/date/:date/time/:time', adminTrainerController.scheduleInterview.bind(adminTrainerController));
adminTrainerRoutes.patch('/trainers/submit-interview-feedback', adminTrainerController.submitInterviewFeedback.bind(adminTrainerController));
adminTrainerRoutes.patch('/trainers/approve', adminTrainerController.approveTrainer.bind(adminTrainerController));
adminTrainerRoutes.patch('/trainers/reject', adminTrainerController.rejectTrainer.bind(adminTrainerController));
exports.default = adminTrainerRoutes;
//# sourceMappingURL=admin.trainer.routes.js.map