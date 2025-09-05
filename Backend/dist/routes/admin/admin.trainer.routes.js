import { AdminTrainerController } from "../../Controller/admin/admin.trainer.controller";
import { TrainerPersonalizationRepository } from "../../Repository/Trainer.personalization.repository";
import { TrainerInterviewRepository } from "../../Repository/TrainerInterview.repository";
import { UserRepository } from "../../Repository/user.Repository";
import { AdminTrainerSerice } from "../../Services/admin/admin.trainer.service";
import { Router } from "express";
const adminTrainerRoutes = Router();
const trainerPersonalizationRepository = new TrainerPersonalizationRepository();
const userRepository = new UserRepository();
const trainerINterviewRepository = new TrainerInterviewRepository();
const adminTrainerService = new AdminTrainerSerice(trainerPersonalizationRepository, trainerINterviewRepository, userRepository);
const adminTrainerController = new AdminTrainerController(adminTrainerService);
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
export default adminTrainerRoutes;
//# sourceMappingURL=admin.trainer.routes.js.map