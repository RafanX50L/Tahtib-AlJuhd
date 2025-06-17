import { Router } from "express";
import verifyToken from "@/middleware/verify.token.middleware";
import isBlocked from "@/middleware/isBlocked.middleware";
import { TrainerController } from "@/controllers/implementation/trainer.controller";
import { TrainerRepository } from "@/repositories/implementation/trainer.repositor";
import { TrainerService } from "@/services/implementation/Trainer.service";
// import { upload } from "@/utils/fileStorage.utils"; // Import the multer config
import multer from "multer";

const trainerRouter = Router();

const trainerRepository = new TrainerRepository();
const trainerService = new TrainerService(trainerRepository);
const trainerController = new TrainerController(trainerService);

const upload = multer({ storage: multer.memoryStorage() });

// Apply middleware
trainerRouter.use("/", verifyToken("trainer"), isBlocked());

// Route for submitting trainer application
trainerRouter.post(
  "/submit-application",
  upload.any(),
  trainerController.submitApplication.bind(trainerController)
);

export default trainerRouter;
