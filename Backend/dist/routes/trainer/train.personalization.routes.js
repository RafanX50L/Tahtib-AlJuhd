"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const trainer_personalization_controller_1 = require("../../Controller/trainer/trainer.personalization.controller");
const Trainer_personalization_repository_1 = require("../../Repository/Trainer.personalization.repository");
const TrainerInterview_repository_1 = require("../../Repository/TrainerInterview.repository");
const user_Repository_1 = require("../../Repository/user.Repository");
const UserFile_repository_1 = require("../../Repository/UserFile.repository");
const trainer_personalization_service_1 = require("../../Services/trainer/trainer.personalization.service");
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
const personalizationRouter = (0, express_1.Router)();
const personalizationRepository = new Trainer_personalization_repository_1.TrainerPersonalizationRepository();
const userFileRePository = new UserFile_repository_1.UserFileRepository();
const userRepository = new user_Repository_1.UserRepository();
const trainerInterviewDetails = new TrainerInterview_repository_1.TrainerInterviewRepository();
const personalizationService = new trainer_personalization_service_1.TrainerPersonalizationService(personalizationRepository, userFileRePository, userRepository, trainerInterviewDetails);
const personalizationController = new trainer_personalization_controller_1.TrainerPersonalizationController(personalizationService);
personalizationRouter.post("/submit-application", upload.fields([
    { name: "profilePhoto", maxCount: 1 },
    { name: "resume", maxCount: 1 },
    { name: "certificationProofs", maxCount: 10 }, // Adjust maxCount as needed
]), personalizationController.submitApplication.bind(personalizationController));
personalizationRouter.get("/application-data", personalizationController.getPendingApplicationDetails.bind(personalizationController));
personalizationRouter.get("/profile-data", personalizationController.getProfileData.bind(personalizationController));
personalizationRouter.patch("/update-profile", personalizationController.updateProfileData.bind(personalizationController));
personalizationRouter.get('/salary', personalizationController.getSalary.bind(personalizationController));
exports.default = personalizationRouter;
//# sourceMappingURL=train.personalization.routes.js.map