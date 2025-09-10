"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userFile_controller_1 = require("../../Controller/shared/userFile.controller");
const personalization_repository_1 = require("../../Repository/personalization.repository");
const Trainer_personalization_repository_1 = require("../../Repository/Trainer.personalization.repository");
const UserFile_repository_1 = require("../../Repository/UserFile.repository");
const userFile_service_1 = require("../../Services/shared/userFile.service");
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const userFileRouter = (0, express_1.Router)();
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
const userFileRepository = new UserFile_repository_1.UserFileRepository();
const personalizationRepository = new personalization_repository_1.PersonalizationRepository();
const trainerPersonalizationRepository = new Trainer_personalization_repository_1.TrainerPersonalizationRepository();
const userFileService = new userFile_service_1.UserFileService(userFileRepository, personalizationRepository, trainerPersonalizationRepository);
const userFileController = new userFile_controller_1.UserFileController(userFileService);
userFileRouter.patch('/update-profile-photo', upload.single('profilePicture'), userFileController.updateProfilePicture.bind(userFileController));
exports.default = userFileRouter;
//# sourceMappingURL=userFile.routes.js.map