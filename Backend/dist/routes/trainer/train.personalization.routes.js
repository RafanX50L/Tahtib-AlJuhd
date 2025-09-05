import { TrainerPersonalizationController } from "../../Controller/trainer/trainer.personalization.controller";
import { TrainerPersonalizationRepository } from "../../Repository/Trainer.personalization.repository";
import { TrainerInterviewRepository } from "../../Repository/TrainerInterview.repository";
import { UserRepository } from "../../Repository/user.Repository";
import { UserFileRepository } from "../../Repository/UserFile.repository";
import { TrainerPersonalizationService } from "../../Services/trainer/trainer.personalization.service";
import { Router } from "express";
import multer from "multer";
const upload = multer({ storage: multer.memoryStorage() });
const personalizationRouter = Router();
const personalizationRepository = new TrainerPersonalizationRepository();
const userFileRePository = new UserFileRepository();
const userRepository = new UserRepository();
const trainerInterviewDetails = new TrainerInterviewRepository();
const personalizationService = new TrainerPersonalizationService(personalizationRepository, userFileRePository, userRepository, trainerInterviewDetails);
const personalizationController = new TrainerPersonalizationController(personalizationService);
personalizationRouter.post("/submit-application", upload.fields([
    { name: "profilePhoto", maxCount: 1 },
    { name: "resume", maxCount: 1 },
    { name: "certificationProofs", maxCount: 10 }, // Adjust maxCount as needed
]), personalizationController.submitApplication.bind(personalizationController));
personalizationRouter.get("/application-data", personalizationController.getPendingApplicationDetails.bind(personalizationController));
personalizationRouter.get("/profile-data", personalizationController.getProfileData.bind(personalizationController));
personalizationRouter.patch("/update-profile", personalizationController.updateProfileData.bind(personalizationController));
personalizationRouter.get('/salary', personalizationController.getSalary.bind(personalizationController));
export default personalizationRouter;
//# sourceMappingURL=train.personalization.routes.js.map