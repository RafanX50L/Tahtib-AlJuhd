import { UserFileController } from "@/Controller/Common/userFile.controller";
import { PersonalizationRepository } from "@/Repository/personalization.repository";
import { TrainerPersonalizationRepository } from "@/Repository/Trainer.personalization.repository";
import { UserFileRepository } from "@/Repository/UserFile.repository";
import {  UserFileService    } from "@/Services/common/userFile.service";
import { Router } from "express";
import multer from "multer";

const userFileRouter = Router();

const upload = multer({ storage: multer.memoryStorage() });

const userFileRepository = new UserFileRepository();
const personalizationRepository = new PersonalizationRepository();
const trainerPersonalizationRepository = new TrainerPersonalizationRepository();
const userFileService = new UserFileService(userFileRepository,personalizationRepository,trainerPersonalizationRepository);
const userFileController = new UserFileController(userFileService);

userFileRouter.patch('/update-profile-photo',upload.single('profilePicture'),userFileController.updateProfilePicture.bind(userFileController));


export default userFileRouter;